import { render } from "./modules/graphics/renderer.js";
import { addInputDetection, getActiveKey } from "./modules/inputDetection.js";
import { enforceFps } from "./modules/time/fpsHandler.js";
import { Player } from "./modules/logic/main-game/player.js";
import { MovementHandler } from "./modules/logic/main-game/movementHandler.js";
import { MenuNavigator } from "./modules/logic/menus/navigator.js";
import { StateManager } from "./modules/logic/state/stateManager.js";
import { Outside } from "./modules/logic/main-game/space.js";
import { MovementLock } from "./modules/time/lock.js";

let outside = new Outside()
let player = new Player(8, 8)
let stateManager = new StateManager()
let menuNavigator;
let moveLock = new MovementLock()

let movementEnded = false

async function gameLoop(timestamp) {
    if (moveLock.isLocked()) {
        movementEnded = moveLock.tryUnlock(timestamp) // movelock unlocked means movement has come to an end
    } else {
        movementEnded = true
    }

    let acted = processInput(timestamp)

    // only render if there is a new action, a movement is being carried out or a movement has ended (and needs to be rendered in the final frame):
    if (acted || moveLock.isLocked() || movementEnded) render(player.x, player.y, movementEnded)

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

function handleMenu(activeKey, timestamp) {
    if (menuNavigator.isClosed()) {
        let wasOpened = menuNavigator.tryOpen(activeKey, timestamp)
        if (wasOpened) stateManager.setMenuState()
        else stateManager.setGameState() // TODO: might cause problems in the future. game state might have to be set more elaborately
    } else {
        menuNavigator.update(activeKey, timestamp)
    }
}

function handleGame(activeKey, timestamp) {
    if (!stateManager.inGameState() || moveLock.isLocked(timestamp)) return

    let moved = MovementHandler.performMovement(player, outside, timestamp, activeKey)
    if (moved) moveLock.lock(timestamp)
}

window.onload = function() {
    addInputDetection()
    render(player.x, player.y) // initial render

    menuNavigator = new MenuNavigator()
    window.requestAnimationFrame(gameLoop)
}