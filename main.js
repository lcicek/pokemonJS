import { render } from "./modules/graphics/renderer.js";
import { addInputDetection, getActiveKey } from "./modules/inputDetection.js";
import { enforceFps } from "./modules/time/fpsHandler.js";
import { Player } from "./modules/logic/main-game/player.js";
import { MovementHandler } from "./modules/logic/main-game/movementHandler.js";
import { MenuNavigator } from "./modules/logic/menus/navigator.js";
import { StateManager } from "./modules/logic/state/stateManager.js";
import { Outside } from "./modules/logic/main-game/space.js";

let outside = new Outside()
let player = new Player(8, 8)

let stateManager = new StateManager()
let menuNavigator;

async function gameLoop(timestamp) {
    processInput(timestamp)
    render(player.x, player.y)

    await enforceFps(timestamp) // needs to be last function in loop (other than recursive call)
    window.requestAnimationFrame(gameLoop)
};

function processInput(timestamp) {
    let activeKey = getActiveKey()

    if (activeKey === null) return

    handleMenu(activeKey, timestamp)
    handleGame(activeKey, timestamp)
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
    if (stateManager.inGameState()) {
        MovementHandler.performMovement(player, outside, timestamp, activeKey)
    }
}

window.onload = function() {
    addInputDetection()
    
    menuNavigator = new MenuNavigator()
    window.requestAnimationFrame(gameLoop)
}