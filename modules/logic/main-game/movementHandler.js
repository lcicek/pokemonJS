import { Direction } from "./direction.js"

var coordinatesDisplay = document.getElementById("coordinatesDisplay")
var prevCoordinatesDisplay = document.getElementById("prevCoordinatesDisplay")
var directionDisplay = document.getElementById("directionDisplay")

// Interface between Player and Outside
export class MovementHandler { // TODO: decide whether class as a wrapper for static functions makes sense
    
    // returns true if movement occured:
    static movePlayer(player, outside, deltas) {
        let targetX = player.x + deltas[0]
        let targetY = player.y + deltas[1]

        if (outside.collides(targetX, targetY)) {
            return false
        }

        if (targetX < outside.width && targetY < outside.height && targetX >= 0 && targetY >= 0) {
            player.prevX = player.x
            player.prevY = player.y

            player.x = targetX
            player.y = targetY
            
            return true
        }

        return false
    }

    static tryMovement(player, outside, key) {
        let moved = false
        let deltas = Direction.toDeltas(key) // get direction of movement
        
        // if movement / direction is valid (only w/a/s/d):
        if (deltas != null) {
            player.setDirection(key)
            moved = this.movePlayer(player, outside, deltas)
        }
    
        coordinatesDisplay.textContent = `(${player.x},${player.y})`
        prevCoordinatesDisplay.textContent = `(${player.prevX},${player.prevY})`
        directionDisplay.textContent = `${player.direction}`

        return moved
    }
}