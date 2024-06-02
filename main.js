import { render } from "./modules/graphics/renderer.js";
import { addInputDetection, getActiveKey } from "./modules/inputDetection.js";
import { enforceFps } from "./modules/time/timeHandler.js";
import { Player } from "./modules/logic/main-game/player.js";
import { MovementHandler } from "./modules/logic/main-game/movementHandler.js";
import { MenuNavigator } from "./modules/logic/menus/navigator.js";
import { StateManager } from "./modules/logic/state/stateManager.js";
import { Outside } from "./modules/logic/main-game/space.js";
import { MovementLock } from "./modules/time/lock.js";
import { tryEncounter } from "./modules/logic/main-game/pokemonEncounter.js";
import { State } from "./modules/logic/state/state.js";

let outside = new Outside()
let player = new Player(8, 8)
let stateManager = new StateManager()
let menuNavigator;
let moveLock = new MovementLock()

async function gameLoop(timestamp) {
    let acted = moveLock.isUnlocked() ? processInput(timestamp) : false // will perform locking mechanisms

    handleGameRendering(acted)

    await enforceFps(timestamp) // needs to be last function in loop (other than recursive call)
    window.requestAnimationFrame(gameLoop)
};

function processInput(timestamp) {
    let activeKey = getActiveKey()

    if (activeKey === null) return false

    handleMenu(activeKey, timestamp)
    handleGame(activeKey, timestamp)

    return true
}

function handleGameRendering(acted) {
    if (!stateManager.isInGameState()) return
    if (!acted && moveLock.isUnlocked()) return // i.e. no new action and no past action that still needs to be rendered

    let movementBegins = moveLock.isFirstTick()
    let movementEnds = moveLock.isLastTick()

    render(player, movementBegins, movementEnds)
    
    moveLock.tick()

    if (moveLock.isUnlocked() && stateManager.isAwaitingEncounter()) {
        stateManager.setState(State.Encounter)
    }
}

function handleMenu(activeKey, timestamp) { // TODO: adjust to changed lock
    if (!stateManager.isInGameState() && !stateManager.isInMenuState()) return // only states where menu can be interacted with

    if (menuNavigator.isClosed()) {
        let wasOpened = menuNavigator.tryOpen(activeKey, timestamp)
        if (wasOpened) stateManager.setMenuState()
    } else {
        menuNavigator.update(activeKey, timestamp)

        if (menuNavigator.isClosed()) { // i.e. menus was closed with this udpate
            stateManager.setState(State.Game)
        }
    }
}

function handlePokemonEncounter() {
    let playerIsInBush = outside.isBush(player.x, player.y)
    if (!playerIsInBush) return

    let pokemonEncountered = tryEncounter() // TODO: also determine which pokemon is encountered
    
    if (pokemonEncountered) {
        stateManager.setState(State.AwaitingEncounter)
    }
}

function handleGame(activeKey) {
    if (!stateManager.isInGameState() || moveLock.isLocked()) return

    let moved = MovementHandler.performMovement(player, outside, activeKey)
    if (moved) {
        moveLock.lock()
        handlePokemonEncounter()
    }
}

window.onload = function() {
    addInputDetection()
    render(player, true, true) // initial render

    menuNavigator = new MenuNavigator()
    window.requestAnimationFrame(gameLoop)
}