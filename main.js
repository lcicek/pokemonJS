import { render } from "./modules/graphics/renderer.js";
import { addInputDetection, getActiveKey, keyIsInvalid } from "./modules/inputDetection.js";
import { enforceFps } from "./modules/time/timeHandler.js";
import { Player } from "./modules/logic/main-game/player.js";
import { MovementHandler } from "./modules/logic/main-game/movementHandler.js";
import { MenuNavigator } from "./modules/logic/menus/navigator.js";
import { StateManager } from "./modules/logic/state/stateManager.js";
import { Outside } from "./modules/logic/main-game/space.js";
import { tryEncounter } from "./modules/logic/main-game/pokemonEncounter.js";
import { State } from "./modules/logic/state/state.js";
import { Action } from "./modules/constants/action.js";
import { Direction } from "./modules/logic/main-game/direction.js";
import { interactables } from "./modules/constants/interactables.js";
import { framesPerClosingField, framesPerMovement, framesPerNavigation, timePerFrameMS } from "./modules/constants/timeConstants.js";
import { Lock } from "./modules/time/lock.js"

let outside = new Outside()
let player = new Player(8, 8)
let stateManager = new StateManager()
let menuNavigator;

let lock = new Lock(timePerFrameMS)

async function gameLoop(timestamp) {
    let acted = processInput(timestamp) // will perform locking mechanisms

    handleGameRendering(acted) // TODO: handle case where if a single frame exceeds a certain time threshold (e.g. the intended time for all frames of a movement), we skip smooth rendering
    // console.log(menuLock.isLocked())

    await enforceFps(timestamp) // needs to be last function in loop (other than recursive call)
    window.requestAnimationFrame(gameLoop)
};

function processInput(timestamp) {
    if (lock.isLocked()) {
        lock.tick(timestamp)
        return false
    }

    if (stateManager.isInClosingFieldState()) stateManager.setState(State.Game)

    let activeKey = getActiveKey()
    if (keyIsInvalid(activeKey)) return false

    tryMenu(activeKey, timestamp)
    tryInteraction(activeKey, timestamp)
    tryMovement(activeKey, timestamp) // TODO: consider changing tryMovement to work even with activeKey = null

    return true
}

function tryInteraction(activeKey, timestamp) {
    if (stateManager.isInGameState() && activeKey == Action.A) { // case: start interaction
        let deltas = Direction.toDeltas(player.direction)
        let targetX = player.x + deltas[0]
        let targetY = player.y + deltas[1]
        let coordinate = "" + targetX + targetY // TODO: consider changing approach

        if (!interactables.has(coordinate)) return

        let target = interactables.get(coordinate)
        console.log(target.text)

        stateManager.setState(State.Interaction)
        lock.lock(framesPerNavigation, timestamp)
        return
    } 
    
    if (stateManager.isInInteractionState() && (activeKey == Action.A || activeKey == Action.B)) { // case: dialogue continues
        // TODO: implement when graphics are there, to be able to tell how much text can fit in one dialogue box
        stateManager.setState(State.ClosingField)
        lock.lock(framesPerClosingField, timestamp)
    }
}

function handleGameRendering(acted) {
    if (!stateManager.isInGameState()) return
    if (!acted && lock.isUnlocked()) return // i.e. no new action and no past action that still needs to be rendered

    let movementBegins = lock.isFirstTick()
    let movementEnds = lock.isLastTick()

    render(player, movementBegins, movementEnds)

    if (lock.isUnlocked() && stateManager.isAwaitingEncounter()) {
        stateManager.setState(State.Encounter)
    }
}

function tryMenu(activeKey, timestamp) {
    if (lock.isLocked()) return
    if (!stateManager.isInGameState() && !stateManager.isInMenuState()) return // only states where menu can be interacted with

    // case: menu is closed
    if (menuNavigator.isClosed()) {
        let wasOpened = menuNavigator.tryOpen(activeKey)
        if (wasOpened) stateManager.setState(State.Menu)
        
        return
    }

    // case: menu is open
    let navigated = menuNavigator.update(activeKey) // case: user initiated navigation in menu

    if (menuNavigator.isClosed()) { // case: user closed menu
        stateManager.setState(State.ClosingField)
        lock.lock(framesPerClosingField, timestamp)
        return
    } 

    if (navigated) lock.lock(framesPerNavigation, timestamp)
}

function handlePokemonEncounter() {
    let playerIsInBush = outside.isBush(player.x, player.y)
    if (!playerIsInBush) return

    let pokemonEncountered = tryEncounter() // TODO: also determine which pokemon is encountered
    
    if (pokemonEncountered) {
        stateManager.setState(State.AwaitingEncounter)
    }
}

function tryMovement(activeKey, timestamp) {
    if (lock.isLocked()) return
    if (!stateManager.isInGameState()) return

    let moved = MovementHandler.tryMovement(player, outside, activeKey)
    if (moved) {
        lock.lock(framesPerMovement, timestamp)
        handlePokemonEncounter()
    }
}

window.onload = function() {
    addInputDetection()
    render(player, true, true) // initial render

    menuNavigator = new MenuNavigator()
    window.requestAnimationFrame(gameLoop)
}