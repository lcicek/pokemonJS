import { Direction } from "../utils/direction.js"

var coordinatesDisplay = document.getElementById("coordinatesDisplay")
var prevCoordinatesDisplay = document.getElementById("prevCoordinatesDisplay")
var directionDisplay = document.getElementById("directionDisplay")

// Interface between Player and Space
export class MovementHandler { // TODO: decide whether class as a wrapper for static functions makes sense
    
    // returns true if movement occured:
    static movePlayer(player, space, deltas) {
        let targetX = player.x + deltas[0]
        let targetY = player.y + deltas[1]

        if (space.collides(targetX, targetY)) {
            player.prevX = player.x
            player.prevY = player.y

            return true
        }

        if (targetX < space.width && targetY < space.height && targetX >= 0 && targetY >= 0) {
            player.prevX = player.x
            player.prevY = player.y

            player.x = targetX
            player.y = targetY
            
            return true
        }

        return false
    }

    static tryMovement(player, space, key) {
        let moved = false
        let deltas = Direction.toDeltas(key) // get direction of movement
        
        // if movement / direction is valid (only w/a/s/d):
        if (deltas != null) {
            player.setDirection(key)
            moved = this.movePlayer(player, space, deltas)
        }
    
        coordinatesDisplay.textContent = `(${player.x},${player.y})`
        prevCoordinatesDisplay.textContent = `(${player.prevX},${player.prevY})`
        directionDisplay.textContent = `${player.direction}`

        return moved
    }
}