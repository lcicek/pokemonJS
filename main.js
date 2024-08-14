import { Renderer } from "./modules/graphics/renderer.js";
import { addInputDetection, getActiveKey, isMovementKey, keyIsInvalid } from "./modules/inputDetection.js";
import { TimeHandler } from "./modules/time/timeHandler.js";
import { Player } from "./modules/logic/objects/player.js";
import { MovementHandler } from "./modules/logic/main-game/movementHandler.js";
import { MenuNavigator } from "./modules/logic/menus/navigator.js";
import { StateManager } from "./modules/logic/state/stateManager.js";
import { Outside } from "./modules/logic/objects/space.js";
import { encounterOccurs } from "./modules/logic/main-game/pokemonEncounter.js";
import { State } from "./modules/logic/state/state.js";
import { Key } from "./modules/constants/dictionaries/key.js";
import { Direction } from "./modules/logic/utils/direction.js";
import { getGameObjectCollisions, getGameObjectsForRendering, trainerIsEncountered, tryGettingGameObject } from "./modules/logic/utils/gameObjectMethods.js";
import { framesPerClosingField, framesPerFightMark, framesPerMovement, framesPerNavigation, ticksPerEncounterTransition, timePerFrameMS } from "./modules/constants/timeConstants.js";
import { Lock } from "./modules/time/lock.js"
import { Dialogue } from "./modules/logic/dialogue/dialogue.js";
import { GrassAnimation, PlayerAnimation } from "./modules/graphics/animation.js";
import { PlayerVisual } from "./modules/graphics/playerVisual.js";
import { BushManager } from "./modules/logic/main-game/bushManager.js";
import { GC } from "./modules/constants/dictionaries/graphicComponents.js";
import { Collectable } from "./modules/logic/objects/gameObject.js";
import { Bag } from "./modules/logic/objects/bag.js";
import { ActionType } from "./modules/constants/dictionaries/actionType.js";
import { NavigationType } from "./modules/constants/dictionaries/navigationType.js";
import { EncounterTransitionAnimation } from "./modules/graphics/transitionAnimation.js";

let outside = new Outside()
let player = new Player(8, 8)
let playerAnimation = new PlayerAnimation()
let playerVisual = new PlayerVisual(player);
let stateManager = new StateManager()
let menuNavigator;
let dialogue = new Dialogue()
let bushManager = new BushManager()
let grassAnimation = new GrassAnimation()
let encounterTransitionAnimation = new EncounterTransitionAnimation()
let lock = new Lock()
let bag = new Bag()
let renderer = new Renderer()
let timeHandler = new TimeHandler()

// TODO: consider changing approach:
let activeTrainer;
let activeTarget;

async function gameLoop(currTime) {
    window.requestAnimationFrame(gameLoop) // order does not matter, this can also be at end of function

    if (timeHandler.isWaiting(currTime)) return;
    timeHandler.initiateFrame(currTime)

    let wasUnlocked = updateLock(currTime)
    let acted = handleGameLogic(currTime)    
    let mustRender = rerenderIsNecessary(acted, wasUnlocked)

    handleGameRendering(mustRender)
    handleTrainerEncounterRendering()
    handleDialogueRendering(mustRender)
    renderTransition()
};

function renderTransition() {
    if (!stateManager.isInTransitionState() || lock.isUnlocked()) return;

    let boxCoordinates = encounterTransitionAnimation.getBoxCoordinates(lock.getTick());
    renderer.transitionBoxes(boxCoordinates)
}

function updateLock(timestamp) {
    if (lock.isLocked()) lock.tick(timestamp)

    return lock.isUnlocked()
}

function rerenderIsNecessary(acted, wasUnlocked) {
    if (stateManager.isInTransitionState() || stateManager.isInFightState()) return false

    return acted || lock.isLocked() || wasUnlocked || !bushManager.isIdle()
}

function handleGameLogic(timestamp) {
    if (lock.isLocked()) return false

    let acted = false
    tryUpdateIntermediateState()

    if (stateManager.isInputState()) {
        let key = getKey()
        let actionType = tryAction(key, timestamp)
        acted = actionType != ActionType.None

        if (actionType == ActionType.Movement) tryPostMovementAction()
    } else if (stateManager.isInTransitionState()) {
        lock.lock(ticksPerEncounterTransition)
    }

    handleTrainerEncounter(timestamp)

    return acted
}

function getKey() {
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

function tryPostMovementAction() {
    tryBush()
    tryPokemonEncounter()
    tryTrainerEncounter()
}

function handleTrainerEncounter(timestamp) {
    if (!stateManager.isInTrainerEncounterState()) return

    let state = stateManager.getActiveState()
    let lockDuration

    if (state == State.TrainerEncounter) {
        lockDuration = framesPerFightMark*2
    } else if (state == State.TrainerWalk) {
        lockDuration = framesPerMovement * activeTrainer.setNextPosition(player.x, player.y)
        activeTrainer.walk()
    } else if (state == State.Interaction) {
        activeTrainer.stand()
        outside.addCollision(activeTrainer.nextX, activeTrainer.nextY) // TODO: check if causes issues
        dialogue.setText(activeTrainer.text)   
        return // i.e. don't lock since user has to press key 
    }

    lock.lock(lockDuration, timestamp)
}

function handleTrainerEncounterRendering() {
    if (!stateManager.isInTrainerEncounterState() || stateManager.getActiveState() == State.Interaction) return

    if (stateManager.getActiveState() == State.TrainerWalk) {
        let canvasPosition = activeTrainer.getCanvasPosition(player.x, player.y)
        let shifts = Direction.toScalarDeltas(activeTrainer.direction, lock.getTick())

        renderer.walkingTrainer(activeTrainer.animation.getKeyframe(lock.getTick()), canvasPosition[0], canvasPosition[1], shifts)
        return
    } 
    
    if (stateManager.getActiveState() == State.TrainerEncounter) {
        let canvasPosition = activeTrainer.getCanvasPosition(player.x, player.y)
        renderer.fightMark(canvasPosition[0], canvasPosition[1] - 1)
    }
}

function prepareGameRendering() {
    if (!stateManager.isInGameState() && !stateManager.isAwaitingAnyEncounter()) return

    // prepare player/movement rendering:
    if (lock.isLocked()) {
        let movementBegins = lock.isFirstTick()
        let movementEnds = lock.isLastTick()

        if (movementBegins) playerVisual.setPosition(player)
        
        if (!movementEnds && !player.collided()) playerVisual.shiftVisual(player.direction)
        else if (movementEnds) playerVisual.ensurePositionIsNext()
    }
    
    // prepare grass animation rendering:
    if (!bushManager.isIdle()) {
        bushManager.tryUpdate()
        bushManager.tryRemove()
    }
}

function handleGameRendering(mustRender) {
    if (!mustRender) return // TODO: refine

    prepareGameRendering()

    if (bushManager.isIdle()) { // case: no grass animations occuring
        renderGame(GC.Player, GC.Bush)
        return
    }

    if (Direction.isVertical(player.direction)) renderGame(GC.GrassAnimation, GC.Player, GC.Bush)
    else renderGame(GC.Player, GC.Bush, GC.GrassAnimation)
}

function renderGame(...gameComponents) {
    let playerKeyframe = stateManager.isInGameState() ? playerAnimation.getKeyframe(lock.getTick()) : playerAnimation.lastKeyframe
    let grassKeyframes = grassAnimation.getKeyframes(bushManager.getTicks())
    let relativeGrassCoordinates = bushManager.getRelativeCoordinates(player.x, player.y)
    
    let bushShouldBeRendered = outside.isBush(player.x, player.y)
    if (lock.isLocked() && !bushManager.isIdle()) bushShouldBeRendered = bushShouldBeRendered && (!Direction.north(player.direction) || lock.isLastTick())

    renderer.setShift(playerVisual.getRemainingShifts())

    // always render backgrounds, game objects and foregrounds regardless of provided components:
    renderer.backgrounds(playerVisual.x, playerVisual.y)
    let [backgroundGameObjects, foregroundGameObjects] = getGameObjectsForRendering(player.x, player.y)
    
    if (backgroundGameObjects.length > 0) renderer.gameObjects(backgroundGameObjects)

    for (let gc of gameComponents) {
        if (gc == GC.Player) renderer.player(playerKeyframe)
        else if (gc == GC.Bush && bushShouldBeRendered) renderer.bush()
        else if (gc == GC.GrassAnimation && grassKeyframes.length != 0) renderer.grassAnimation(grassKeyframes, relativeGrassCoordinates)
    }

    if (foregroundGameObjects.length > 0) renderer.gameObjects(foregroundGameObjects)
    renderer.mapForeground(playerVisual.x, playerVisual.y)
}

function tryTrainerEncounter() {
    let trainer = trainerIsEncountered(player.x, player.y)

    if (trainer != null) {
        stateManager.setNextStates(State.AwaitingTrainerEncounter, State.TrainerEncounter, State.TrainerWalk, State.Interaction, State.EncounterTransition, State.TrainerFight)
    
        activeTrainer = trainer
        trainer.wasEncountered()
        outside.removeCollision(activeTrainer.x, activeTrainer.y)
    }
}

function tryUpdateIntermediateState() {
    if (stateManager.hasNextState() && !stateManager.isInInteractionState()) {
        stateManager.enterNextState()
    }
}

function tryBush() {    
    if (!player.collided() && outside.isBush(player.x, player.y)) {
        bushManager.add(player.x, player.y)
    }
}

function tryInteraction(activeKey, timestamp) {
    // case: user starts interaction
    if (stateManager.isInGameState() && activeKey == Key.A) {
        let deltas = Direction.toDeltas(player.direction)
        let targetX = player.x + deltas[0]
        let targetY = player.y + deltas[1]
        let target = tryGettingGameObject(targetX, targetY)
        
        if (target == null) return false

        activeTarget = target

        dialogue.setText(target.text)
        stateManager.setState(State.Interaction)
        lock.lock(framesPerNavigation, timestamp)
        
        return true
    } 

    // case: no interaction
    if (!stateManager.isInInteractionState() || (activeKey != Key.A && activeKey != Key.B)) return false
    
    // case: user presses A or B during interaction
    if (!dialogue.isLastBlock()) {
        dialogue.nextBlock()
        lock.lock(framesPerNavigation, timestamp)
        return true
    }

    if (activeTarget instanceof Collectable) {
        activeTarget.collect()
        outside.removeCollision(activeTarget.x, activeTarget.y)
        bag.add(activeTarget)
    }

    if (stateManager.hasNextState()) {
        stateManager.enterNextState() // TODO: consider adding lock here too;
        lock.lock(ticksPerEncounterTransition) // TODO: MOVE SOMEWHERE ELSE
    } else {
        stateManager.setNextStates(State.ClosingField, State.Game)
        lock.lock(framesPerClosingField, timestamp)
    }

    return true
    

}

function handleDialogueRendering(mustRender) {
    if (!stateManager.isInInteractionState() || !mustRender) return

    renderer.dialogue(dialogue.getCurrentBlock(), dialogue.isLastBlock())
}

function tryMenu(activeKey, timestamp) {
    if (lock.isLocked()) return false
    if (!stateManager.isInGameState() && !stateManager.isInMenuState()) return false // only states where menu can be interacted with

    if (menuNavigator.isClosed()) menuNavigator.tryOpen(activeKey)
    else menuNavigator.update(activeKey)

    // case: menu was closed during last update
    if (menuNavigator.lastNavigationType == NavigationType.Close && menuNavigator.isClosed()) {
        stateManager.setNextStates(State.ClosingField, State.Game)
        lock.lock(framesPerClosingField, timestamp)
        return true
    }

    let gameMenuWasOpened = menuNavigator.lastNavigationType == NavigationType.Open

    // case: game menu was opened during last update
    if (gameMenuWasOpened && menuNavigator.gameMenuIsOpen()) {
        stateManager.setState(State.Menu)
    }

    // case: bag menu was opened during last update
    if (gameMenuWasOpened && menuNavigator.bagMenuIsOpen()) {
        menuNavigator.getActive().setItems(bag.contents)
        menuNavigator.setDisplay()
    }

    let navigated = menuNavigator.lastNavigationType != NavigationType.None
    if (navigated) lock.lock(framesPerNavigation, timestamp) 
    
    return navigated
}

function tryPokemonEncounter() {
    let playerIsInBush = outside.isBush(player.x, player.y)
    if (!playerIsInBush || player.collided()) return

    if (encounterOccurs()) { // TODO: also determine which pokemon is encountered
        stateManager.setNextStates(State.AwaitingPokemonEncounter, State.EncounterTransition, State.PokemonFight)
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