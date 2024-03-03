import { render } from "./modules/renderer.js";
import { addInputDetection, getActiveKey } from "./modules/inputDetection.js";
import { enforceFps } from "./modules/fpsHandler.js";
import { Player } from "./modules/player.js";
import { World } from "./modules/world.js";
import { move } from "./modules/movementHandler.js";
import { MenuNavigator } from "./modules/menu.js";
import { StateManager } from "./modules/stateManager.js";

let world = new World(13, 9)
let player = new Player(0, 0)

let stateManager = new StateManager()
let menuNavigator;

async function gameLoop(timestamp) {
    let activeKey = getActiveKey()
    
    if (activeKey != null) {
        menuNavigator.update(activeKey, timestamp)
        if (menuNavigator.isActive()) stateManager.setMenuState()
        else stateManager.setGameState()

        if (stateManager.inGameState()) move(player, world, timestamp, activeKey)
    }
    
    render(world, player.x, player.y)

    await enforceFps(timestamp) // needs to be last function in loop (other than recursive call)
    window.requestAnimationFrame(gameLoop)
};

window.onload = function() {
    addInputDetection()
    
    menuNavigator = new MenuNavigator()
    window.requestAnimationFrame(gameLoop)
}