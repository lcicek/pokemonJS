import { Renderer } from "./modules/graphics/renderer.js";
import { addInputDetection, getActiveKey, isMovementKey, keyIsInvalid } from "./modules/inputDetection.js";
import { enforceFps } from "./modules/time/timeHandler.js";
import { Player } from "./modules/logic/main-game/player.js";
import { MovementHandler } from "./modules/logic/main-game/movementHandler.js";
import { MenuNavigator } from "./modules/logic/menus/navigator.js";
import { StateManager } from "./modules/logic/state/stateManager.js";
import { Outside } from "./modules/logic/main-game/space.js";
import { encounterOccurs } from "./modules/logic/main-game/pokemonEncounter.js";
import { State } from "./modules/logic/state/state.js";
import { Key } from "./modules/constants/key.js";
import { Direction } from "./modules/logic/main-game/direction.js";
import { getGameObjectCollisions, getGameObjectsForRendering, trainerIsEncountered, tryGettingGameObject } from "./modules/constants/gameObjects.js";
import { framesPerClosingField, framesPerFightMark, framesPerMovement, framesPerNavigation } from "./modules/constants/timeConstants.js";
import { Lock } from "./modules/time/lock.js"
import { Dialogue } from "./modules/logic/dialogue/dialogue.js";
import { FightMarkAnimation, GrassAnimation, PlayerAnimation } from "./modules/graphics/animation.js";
import { PlayerVisual } from "./modules/graphics/playerVisual.js";
import { BushManager } from "./modules/logic/main-game/bushManager.js";
import { GC } from "./modules/constants/graphicComponents.js";
import { Collectable } from "./modules/logic/objects/gameObject.js";
import { Bag } from "./modules/logic/main-game/bag.js";
import { BagMenu, GameMenu } from "./modules/logic/menus/menu.js";
import { AnimationQueue } from "./modules/graphics/animationQueue.js";
import { ActionType } from "./modules/constants/actionType.js";
import { NavigationType } from "./modules/constants/navigationType.js";

let outside = new Outside()
let player = new Player(8, 8)
let playerAnimation = new PlayerAnimation()
let playerVisual = new PlayerVisual(player);
let stateManager = new StateManager()
let menuNavigator;
let dialogue = new Dialogue()
let bushManager = new BushManager()
let grassAnimation = new GrassAnimation()
let fightMarkAnimation = new FightMarkAnimation()
let lock = new Lock()
let bag = new Bag()
let renderer = new Renderer()
let animationQueue = new AnimationQueue()

let activeTrainer // TODO: change 

async function gameLoop(timestamp) {
    tryUpdateIntermediateState()

    let key = getKey(timestamp)
    let actionType = tryAction(key, timestamp)
    let acted = actionType != ActionType.None

    if (actionType == ActionType.Movement) handleGameLogic()

    handleGameRendering()
    let trainerDialogueStarts = handleTrainerEncounterRendering(timestamp)
    handleDialogueRendering(acted || trainerDialogueStarts)

    await enforceFps(timestamp) // needs to be last function in loop (other than recursive call)
    window.requestAnimationFrame(gameLoop)
};

function getKey(timestamp) {
    if (lock.isLocked()) {
        lock.tick(timestamp)
        return null
    }

    let activeKey = getActiveKey()

    return keyIsInvalid(activeKey) ? null : activeKey
}

function tryAction(key, timestamp) {
    if (key == null) return ActionType.None

    if (tryMovement(key, timestamp)) return ActionType.Movement
    else if (tryMenu(key, timestamp)) return ActionType.Navigation
    else if (tryInteraction(key, timestamp)) return ActionType.Interaction
    else return ActionType.None
}

function handleGameLogic() {
    tryBush()
    tryPokemonEncounter()
    tryTrainerEncounter()
}

function handleGameGraphics() {

}



function handleTrainerEncounterRendering(timestamp) {
    if (!stateManager.isInTrainerEncounterState()) return false

    if (animationQueue.isIdle()) animationQueue.setAnimation()
    else animationQueue.animate()
    
    if (animationQueue.isFinished()) {
        animationQueue.reset()
        // stateManager.setState(State.TrainerFight) // TODO: implement state queue of some kind

        dialogue.setText(activeTrainer.text)
        stateManager.setState(State.Interaction)
        lock.lock(framesPerNavigation, timestamp)
        
        outside.addCollision(activeTrainer.tmpX, activeTrainer.tmpY)
        return true
    }

    if (animationQueue.isFinalAnimation()) { // TODO: define clear semantics between animationQueue and trainer encounter
        activeTrainer.walk() // TODO: only needs to be called once

        let canvasPosition = activeTrainer.getCanvasPosition(player.x, player.y)
        let shifts = Direction.toDeltas(activeTrainer.direction)
        
        let tick = animationQueue.getTick()
        shifts[0] *= tick
        shifts[1] *= tick

        renderer.walkingTrainer(animationQueue.getKeyframe(), canvasPosition[0], canvasPosition[1], shifts)
    } else {
        let canvasPosition = activeTrainer.getCanvasPosition(player.x, player.y)
        renderer.fightMark(animationQueue.getKeyframe(), canvasPosition[0], canvasPosition[1] - 1)
    }

    if (animationQueue.isFinalAnimationFrame()) activeTrainer.stand()

    return false
}

function prepareGameRendering() {
    // prepare player/movement rendering:
    if (lock.isLocked()) {
        let movementBegins = lock.isFirstTick()
        let movementEnds = lock.isLastTick()

        if (movementBegins) playerVisual.setPosition(player)
        
        if (!movementEnds && !player.collided()) playerVisual.shiftVisual(player.direction)
        else if (movementEnds) playerVisual.ensurePositionIsNext()
    }
    
    // prepare grass animation rendering:
    bushManager.tryUpdate()
    bushManager.tryRemove()
}

function handleGameRendering() {
    if (!stateManager.isInGameState() && !stateManager.isAwaitingAnyEncounter() && !stateManager.isInTrainerEncounterState()) return
    if (lock.isUnlocked() && bushManager.isIdle() && animationQueue.isIdle()) return

    prepareGameRendering()

    if (bushManager.isIdle()) { // case: no grass animations occuring
        renderGame(GC.Player, GC.Bush)
        return
    }

    if (Direction.isVertical(player.direction)) renderGame(GC.GrassAnimation, GC.Player, GC.Bush)
    else renderGame(GC.Player, GC.Bush, GC.GrassAnimation)
}


function renderGame(...renderComponents) {
    let playerKeyframe = playerAnimation.getKeyframe(lock.getTick())
    let grassKeyframes = grassAnimation.getKeyframes(bushManager.getTicks())
    let relativeGrassCoordinates = bushManager.getRelativeCoordinates(player.x, player.y)
    
    let bushShouldBeRendered = outside.isBush(player.x, player.y)
    if (lock.isLocked() && !bushManager.isIdle()) bushShouldBeRendered = bushShouldBeRendered && (!Direction.north(player.direction) || lock.isLastTick())

    renderer.setShift(playerVisual.getRemainingShifts())
    
    // always render backgrounds, game objects and foregrounds regardless of provided components:
    renderer.backgrounds(playerVisual.x, playerVisual.y)
    let [backgroundGameObjects, foregroundGameObjects] = getGameObjectsForRendering(player.x, player.y)
    
    if (backgroundGameObjects.length > 0) renderer.gameObjects(backgroundGameObjects)
    for (let rc of renderComponents) {
        if (rc == GC.Player) renderer.player(playerKeyframe)
        else if (rc == GC.Bush && bushShouldBeRendered) renderer.bush()
        else if (rc == GC.GrassAnimation && grassKeyframes.length != 0) renderer.grassAnimation(grassKeyframes, relativeGrassCoordinates)
    }
    if (foregroundGameObjects.length > 0) renderer.gameObjects(foregroundGameObjects)
    renderer.mapForeground(playerVisual.x, playerVisual.y)
}

function tryTrainerEncounter() {
    let trainer = trainerIsEncountered(player.x, player.y)

    if (trainer != null) {
        stateManager.setState(State.AwaitingTrainerEncounter)
        
        animationQueue.addAnimation(fightMarkAnimation, framesPerFightMark)
        animationQueue.addAnimation(trainer.animation, framesPerMovement * trainer.setNextPosition(player.x, player.y))
    
        activeTrainer = trainer
        trainer.wasEncountered()
        outside.removeCollision(activeTrainer.x, activeTrainer.y)
    }
}

function tryUpdateIntermediateState() {
    if (lock.isLocked()) return

    if (stateManager.isAwaitingEncounter()) {
        stateManager.setState(State.Encounter)
        return
    }

    if (stateManager.isInClosingFieldState()) {
        stateManager.setState(State.Game)
        return
    }

    if (stateManager.isAwaitingTrainerEncounter()) {
        stateManager.setState(State.TrainerEncounter)
        return
    }
}

function tryBush() {    
    if (!player.collided() && outside.isBush(player.x, player.y)) {
        bushManager.add(player.x, player.y)
    }
}

function tryInteraction(activeKey, timestamp) {
    if (stateManager.isInGameState() && activeKey == Key.A) { // case: start
        let deltas = Direction.toDeltas(player.direction)
        let targetX = player.x + deltas[0]
        let targetY = player.y + deltas[1]
        let target = tryGettingGameObject(targetX, targetY)
        
        if (target == null) return false

        if (target instanceof Collectable) {
            target.collect()
            outside.removeCollision(targetX, targetY)
            bag.add(target)
        }
        
        dialogue.setText(target.text)

        stateManager.setState(State.Interaction)
        lock.lock(framesPerNavigation, timestamp)
        return true
    } 
    
    if (stateManager.isInInteractionState() && (activeKey == Key.A || activeKey == Key.B)) { // case: continues
        if (dialogue.isLastBlock()) {
            stateManager.setState(State.ClosingField)
            lock.lock(framesPerClosingField, timestamp)
        } else {
            dialogue.nextBlock()
            lock.lock(framesPerNavigation, timestamp)
        }

        return true
    }

    return false
}

function handleDialogueRendering(acted) {
    if (stateManager.isInClosingFieldState()) {
        renderGame(GC.Player, GC.Bush)
        return
    }

    if (!stateManager.isInInteractionState()) return
    if (stateManager.isInInteractionState && !acted) return

    renderer.dialogue(dialogue.getCurrentBlock(), dialogue.isLastBlock())
}

function tryMenu(activeKey, timestamp) {
    if (lock.isLocked()) return false
    if (!stateManager.isInGameState() && !stateManager.isInMenuState()) return false // only states where menu can be interacted with

    if (menuNavigator.isClosed()) menuNavigator.tryOpen(activeKey)
    else menuNavigator.update(activeKey)

    if (menuNavigator.lastNavigationType == NavigationType.Close && menuNavigator.isClosed()) { // case: menu was closed in last update
        stateManager.setState(State.ClosingField)
        lock.lock(framesPerClosingField, timestamp)
        return true
    }

    let gameMenuWasOpened = menuNavigator.lastNavigationType == NavigationType.Open

    if (gameMenuWasOpened && menuNavigator.bagMenuIsOpen()) {
        menuNavigator.getActive().setItems(bag.contents)
    }
    
    if (gameMenuWasOpened && menuNavigator.gameMenuIsOpen()) {
        stateManager.setState(State.Menu)
    }

    let navigated = menuNavigator.lastNavigationType != NavigationType.None
    if (navigated) lock.lock(framesPerNavigation, timestamp) 
    
    return navigated
}

function tryPokemonEncounter() {
    let playerIsInBush = outside.isBush(player.x, player.y)
    if (!playerIsInBush || player.collided()) return

    if (encounterOccurs()) { // TODO: also determine which pokemon is encountered
        stateManager.setState(State.AwaitingEncounter)
    }
}

function tryMovement(activeKey, timestamp) {
    if (lock.isLocked() || !stateManager.isInGameState() || !isMovementKey(activeKey)) return false
    if (!stateManager.isInGameState()) return false

    let moved = MovementHandler.tryMovement(player, outside, activeKey) // will update player location and direction
    lock.lock(framesPerMovement, timestamp)

    playerAnimation.setKeyframeCycle(player.direction)
    playerAnimation.toggleStep()

    return moved
}

window.onload = function() {
    addInputDetection()

    let collisionCoordinates = getGameObjectCollisions()
    outside.addCollisions(collisionCoordinates)

    renderer.initialize()
    renderGame(GC.Player, GC.Bush) // initial render

    menuNavigator = new MenuNavigator()
    window.requestAnimationFrame(gameLoop)
}