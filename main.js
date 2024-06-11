import { renderGrassAnimation, renderDialogue, renderPreviousBackground, setFont, renderBackgrounds, renderPlayer, renderBush, renderMapForeground, renderRegularMovement } from "./modules/graphics/renderer.js";
import { addInputDetection, getActiveKey, keyIsInvalid } from "./modules/inputDetection.js";
import { enforceFps } from "./modules/time/timeHandler.js";
import { Player } from "./modules/logic/main-game/player.js";
import { MovementHandler } from "./modules/logic/main-game/movementHandler.js";
import { MenuNavigator } from "./modules/logic/menus/navigator.js";
import { StateManager } from "./modules/logic/state/stateManager.js";
import { Outside } from "./modules/logic/main-game/space.js";
import { encounterOccurs } from "./modules/logic/main-game/pokemonEncounter.js";
import { State } from "./modules/logic/state/state.js";
import { Action } from "./modules/constants/action.js";
import { Direction } from "./modules/logic/main-game/direction.js";
import { interactables } from "./modules/constants/interactables.js";
import { framesPerClosingField, framesPerMovement, framesPerNavigation } from "./modules/constants/timeConstants.js";
import { Lock } from "./modules/time/lock.js"
import { Dialogue } from "./modules/logic/dialogue/dialogue.js";
import { GrassAnimation, PlayerAnimation } from "./modules/graphics/animation.js";
import { PlayerVisual } from "./modules/graphics/playerVisual.js";
import { BushManager } from "./modules/logic/main-game/bushManager.js";
import { RC } from "./modules/constants/renderComponents.js";
import { Collectable } from "./modules/logic/objects/interactable.js";
import { Bag } from "./modules/logic/main-game/bag.js";
import { BagMenu, GameMenu } from "./modules/logic/menus/menu.js";
import { trainerIsEncountered } from "./modules/constants/trainers.js";

let outside = new Outside()
let player = new Player(8, 8)
let playerAnimation = new PlayerAnimation()
let playerVisual = new PlayerVisual(player);
let stateManager = new StateManager()
let menuNavigator;
let dialogue = new Dialogue()
let bushManager = new BushManager()
let grassAnimation = new GrassAnimation()
let lock = new Lock()
let bag = new Bag()

async function gameLoop(timestamp) {
    tryUpdateIntermediateState()

    let acted = act(timestamp) // will perform locking mechanisms

    handleGameRendering()
    handleDialogueRendering(acted)

    await enforceFps(timestamp) // needs to be last function in loop (other than recursive call)
    window.requestAnimationFrame(gameLoop)
};

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
    if (!stateManager.isInGameState()) return
    if (lock.isUnlocked() && bushManager.isIdle()) return

    prepareGameRendering()

    if (bushManager.isIdle()) { // case: no grass animations occuring
        renderGame(RC.Background, RC.Player, RC.Bush, RC.Foreground)
        return
    }

    if (Direction.isVertical(player.direction)) renderGame(RC.Background, RC.GrassAnimation, RC.Player, RC.Bush, RC.Foreground)
    else renderGame(RC.Background, RC.Player, RC.Bush, RC.GrassAnimation, RC.Foreground)
}


function renderGame(...renderComponents) {
    let playerKeyframe = lock.isLocked() ? playerAnimation.getKeyframe(lock.getTick()) : playerAnimation.lastKeyframe
    
    let grassKeyframes = grassAnimation.getKeyframes(bushManager.getTicks())
    let relativeGrassCoordinates = bushManager.getRelativeCoordinates(player.x, player.y)
    let grassShifts = playerVisual.getRemainingShifts()
    
    let bushShouldBeRendered = outside.isBush(player.x, player.y)
    if (lock.isLocked() && !bushManager.isIdle()) bushShouldBeRendered = bushShouldBeRendered && (!Direction.north(player.direction) || lock.isLastTick())
    
    for (let rc of renderComponents) {
        if (rc == RC.Background) renderBackgrounds(playerVisual.x, playerVisual.y)
        else if (rc == RC.Player) renderPlayer(playerKeyframe)
        else if (rc == RC.Bush) renderBush(playerVisual, bushShouldBeRendered)
        else if (rc == RC.GrassAnimation && grassKeyframes.length != 0) renderGrassAnimation(grassKeyframes, relativeGrassCoordinates, grassShifts)
        else if (rc == RC.Foreground) renderMapForeground(playerVisual.x, playerVisual.y)
    }
}

function tryTrainerEncounter() {
    if (trainerIsEncountered(player.x, player.y)) {
        stateManager.setState(State.AwaitingEncounter)
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
    }
}

function act(timestamp) {
    if (lock.isLocked()) {
        lock.tick(timestamp)
        return false
    }

    let activeKey = getActiveKey()
    if (keyIsInvalid(activeKey)) return false

    let navigated = tryMenu(activeKey, timestamp)
    let interacted = tryInteraction(activeKey, timestamp)
    let moved = tryMovement(activeKey, timestamp) // TODO: consider changing tryMovement to work even with activeKey = null
    
    if (moved) {
        tryPokemonEncounter()
        tryBush()
        tryTrainerEncounter()
    }

    let acted = navigated || interacted || moved
    return acted
}

function tryBush() {    
    if (!player.collided() && outside.isBush(player.x, player.y)) {
        bushManager.add(player.x, player.y)
    }
}

function tryInteraction(activeKey, timestamp) {
    if (stateManager.isInGameState() && activeKey == Action.A) { // case: start
        let deltas = Direction.toDeltas(player.direction)
        let targetX = player.x + deltas[0]
        let targetY = player.y + deltas[1]
        let coordinate = [targetX, targetY].toString() // TODO: consider changing approach

        if (!interactables.has(coordinate)) return false

        let target = interactables.get(coordinate)
        
        if (target instanceof Collectable && !target.wasCollected()) {
            target.collect()
            outside.removeCollision(targetX, targetY)
            bag.add(target)
        } else if (target instanceof Collectable) {
            return
        }
        
        dialogue.setText(target.text)

        stateManager.setState(State.Interaction)
        lock.lock(framesPerNavigation, timestamp)
        return true
    } 
    
    if (stateManager.isInInteractionState() && (activeKey == Action.A || activeKey == Action.B)) { // case: continues
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
        renderPreviousBackground(playerAnimation.lastKeyframe, playerVisual, outside.isBush(player.x, player.y))
        renderMapForeground(playerVisual.x, playerVisual.y)

        return
    }

    if (!stateManager.isInInteractionState()) return
    if (stateManager.isInInteractionState && !acted) return

    renderDialogue(dialogue.getCurrentBlock(), dialogue.isLastBlock())
}

function tryMenu(activeKey, timestamp) {
    if (lock.isLocked()) return false
    if (!stateManager.isInGameState() && !stateManager.isInMenuState()) return false // only states where menu can be interacted with

    // case: menu is closed
    if (menuNavigator.isClosed()) {
        let wasOpened = menuNavigator.tryOpen(activeKey)
        if (wasOpened) stateManager.setState(State.Menu)
        
        return wasOpened
    }

    // case: menu is open
    let gameMenuWasOpen = menuNavigator.getActive() instanceof GameMenu
    let navigated = menuNavigator.update(activeKey) // case: user initiated navigation in menu
    let bagMenuWasOpened = navigated && gameMenuWasOpen && menuNavigator.getActive() instanceof BagMenu

    if (bagMenuWasOpened) {
        menuNavigator.getActive().setItems(bag.contents)
    }

    menuNavigator.setDisplay()

    if (menuNavigator.isClosed()) { // case: user closed menu
        stateManager.setState(State.ClosingField)
        lock.lock(framesPerClosingField, timestamp)
        return true
    } 

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
    if (lock.isLocked()) return false
    if (!stateManager.isInGameState()) return false

    let moved = MovementHandler.tryMovement(player, outside, activeKey) // will update player location and direction
    if (moved) {
        playerAnimation.setKeyframeCycle(player.direction)
        playerAnimation.toggleStep()
        lock.lock(framesPerMovement, timestamp)
    }

    return moved
}

window.onload = function() {
    addInputDetection()
    setFont()
    renderRegularMovement(playerVisual, playerAnimation.lastKeyframe) // initial render

    menuNavigator = new MenuNavigator()
    window.requestAnimationFrame(gameLoop)
}