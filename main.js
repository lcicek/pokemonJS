import { renderDialogue, renderMovement, renderPreviousBackground, setFont } from "./modules/graphics/renderer.js";
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
import { framesPerClosingField, framesPerMovement, framesPerNavigation, timePerFrameMS } from "./modules/constants/timeConstants.js";
import { Lock } from "./modules/time/lock.js"
import { Dialogue } from "./modules/logic/dialogue/dialogue.js";
import { PlayerAnimation } from "./modules/graphics/animation.js";
import { PlayerVisual } from "./modules/graphics/playerVisual.js";

let outside = new Outside()
let player = new Player(8, 8)
let playerAnimation = new PlayerAnimation()
let playerVisual = new PlayerVisual(player);
let stateManager = new StateManager()
let menuNavigator;
let dialogue = new Dialogue()

let lock = new Lock(timePerFrameMS)

async function gameLoop(timestamp) {
    tryUpdateIntermediateState()

    let acted = processInput(timestamp) // will perform locking mechanisms

    handleMovementRendering(acted)
    handleDialogueRendering(acted)

    await enforceFps(timestamp) // needs to be last function in loop (other than recursive call)
    window.requestAnimationFrame(gameLoop)
};

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

function processInput(timestamp) {
    if (lock.isLocked()) {
        lock.tick(timestamp)
        return false
    }

    let activeKey = getActiveKey()
    if (keyIsInvalid(activeKey)) return false

    let navigated = tryMenu(activeKey, timestamp)
    let interacted = tryInteraction(activeKey, timestamp)
    let moved = tryMovement(activeKey, timestamp) // TODO: consider changing tryMovement to work even with activeKey = null
    if (moved) tryPokemonEncounter()

    let acted = navigated || interacted || moved

    return acted
}

function tryInteraction(activeKey, timestamp) {
    if (stateManager.isInGameState() && activeKey == Action.A) { // case: start
        let deltas = Direction.toDeltas(player.direction)
        let targetX = player.x + deltas[0]
        let targetY = player.y + deltas[1]
        let coordinate = "" + targetX + targetY // TODO: consider changing approach

        if (!interactables.has(coordinate)) return false

        let target = interactables.get(coordinate)
        
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
        renderPreviousBackground(playerAnimation.getKeyframe(), playerVisual.x, playerVisual.y)
        return
    }

    if (!stateManager.isInInteractionState()) return
    if (stateManager.isInInteractionState && !acted) return

    renderDialogue(dialogue.getCurrentBlock(), dialogue.isLastBlock())
}

function handleMovementRendering(acted) {
    if (!stateManager.isInGameState() || (!acted && lock.isUnlocked())) return // i.e. no new action and no past action that still needs to be rendered

    let movementBegins = lock.isFirstTick()
    let movementEnds = lock.isLastTick()

    if (movementBegins) playerVisual.updatePosition(player)
    else if (movementEnds) playerVisual.setPositionToNext()
    else if (!player.collided()) playerVisual.shiftVisual(player.direction)

    playerAnimation.setKeyframe(lock.getTick())

    renderMovement(playerAnimation.getKeyframe(), playerVisual.x, playerVisual.y)
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
    let navigated = menuNavigator.update(activeKey) // case: user initiated navigation in menu

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
        playerAnimation.setCycle(player.direction)
        playerAnimation.toggleStep()
        lock.lock(framesPerMovement, timestamp)
    }

    return moved
}

window.onload = function() {
    addInputDetection()
    setFont()
    renderMovement(playerAnimation.getKeyframe(), playerVisual.x, playerVisual.y) // initial render

    menuNavigator = new MenuNavigator()
    window.requestAnimationFrame(gameLoop)
}