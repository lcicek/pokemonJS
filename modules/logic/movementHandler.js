import { Direction } from "./direction.js"
import { MovementLock } from "../time/lock.js"
import { Gate } from "./gate.js"

let moveLock = new MovementLock()
var xyDisplay = document.getElementById("xyDisplay")

function move(player, outside, timestamp, key) {
    let deltas = Direction.toDeltas(key)
    
    if (deltas != null && moveLock.isUnlocked(timestamp)) {
        Gate.movePlayer(player, outside, deltas)
        moveLock.lock(timestamp)
    }

    xyDisplay.textContent = `(${player.x},${player.y})`
}

export { move }