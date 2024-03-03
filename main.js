import { render } from "./modules/renderer.js";
import { addInputDetection, getActiveKey } from "./modules/inputDetection.js";
import { enforceFps } from "./modules/fpsHandler.js";
import { Player } from "./modules/player.js";
import { World } from "./modules/world.js";
import { move } from "./modules/movementHandler.js";
import { MenuNavigator } from "./modules/navigator.js";
import { StateManager } from "./modules/stateManager.js";

let world = new World(13, 9)
let player = new Player(0, 0)

let stateManager = new StateManager()
let menuNavigator;

async function gameLoop(timestamp) {
    processInput(timestamp)
    render(world, player.x, player.y)

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
    if (stateManager.inGameState()) move(player, world, timestamp, activeKey)
}

window.onload = function() {
    addInputDetection()
    
    menuNavigator = new MenuNavigator()
    window.requestAnimationFrame(gameLoop)
}