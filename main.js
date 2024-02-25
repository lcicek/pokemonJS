import { render } from "./modules/renderer.js";
import { addInputDetection, activeKey } from "./modules/inputDetection.js";
import { enforceFps } from "./modules/fpsHandler.js";
import { Player } from "./modules/player.js";
import { getMovementDirection } from "./modules/movementHandler.js";
import { Gate } from "./modules/gate.js";
import { World } from "./modules/world.js";
import { WIDTH, HEIGHT } from "./modules/constants/graphicConstants.js";
import { MovementLock } from "./modules/lock.js";

let world = new World(13, 9)
let player = new Player(0, 0)
var xyDisplay = document.getElementById("xyDisplay")
let moveLock = new MovementLock()

async function gameLoop(timestamp) {
    let deltas = getMovementDirection(activeKey)
    
    if (deltas != null && moveLock.isUnlocked(timestamp)) {
        Gate.movePlayer(player, world, deltas)
        moveLock.lock(timestamp)
    }

    xyDisplay.textContent = `(${player.x},${player.y})`

    render(world, player.x, player.y)

    await enforceFps(timestamp) // needs to be last function in loop (other than recursive call)
    window.requestAnimationFrame(gameLoop)
};

window.onload = function() {
    addInputDetection()
    window.requestAnimationFrame(gameLoop)
}