import { Direction } from "./direction.js"
import { MovementLock } from "../../time/lock.js"

let moveLock = new MovementLock()
var coordinatesDisplay = document.getElementById("coordinatesDisplay")

// Interface between Player and Outside
export class MovementHandler { // TODO: decide whether class as a wrapper for static functions makes sense
    static movePlayer(player, outside, deltas) {
        let targetX = player.x + deltas[0]
        let targetY = player.y + deltas[1]

        if (outside.collides(targetX, targetY)) {
            return
        }

        if (targetX < outside.width && targetY < outside.height && targetX >= 0 && targetY >= 0) {
            player.x = targetX
            player.y = targetY
        }
    }

    static performMovement(player, outside, timestamp, key) {
        // get direction of movement:
        let deltas = Direction.toDeltas(key)
        
        // if movement / direction is valid (only w/a/s/d):
        if (deltas != null && moveLock.isUnlocked(timestamp)) {
            this.movePlayer(player, outside, deltas)
            moveLock.lock(timestamp)
        }
    
        coordinatesDisplay.textContent = `(${player.x},${player.y})`
    }
}