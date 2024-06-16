import { HEIGHT, NORMALIZE_X, NORMALIZE_Y, WIDTH } from "../../constants/graphicConstants.js"
import { TrainerAnimation } from "../../graphics/animation.js"
import { Direction } from "../main-game/direction.js"

class GameObject {
    constructor(x, y, text) {
        this.x = x
        this.y = y
        this.text = text
    }

    isInView(playerX, playerY) {
        let [canvasX, canvasY] = this.getCanvasPosition(playerX, playerY)
        return -1 <= canvasX && canvasX <= WIDTH+1 && -1 <= canvasY && canvasY <= HEIGHT+1 // add a margin of -1/+1 so object doesnt get cut out when it's moving out of frame
    }

    getCanvasPosition(playerX, playerY) {
        let relativeX = playerX - this.x
        let relativeY = playerY - this.y
        
        return [NORMALIZE_X - relativeX, NORMALIZE_Y - relativeY]
    }
}

export class Sign extends GameObject {
    constructor(x, y, text) {
        super(x, y, text)
    }
}

export class Collectable extends GameObject {
    constructor(x, y, collectableName) {
        super(x, y, "You found one " + collectableName + ".")
        this.name = collectableName
        this.collected = false
    }

    collect() {
        this.collected = true
    }

    wasCollected() {
        return this.collected
    }
}

export class Trainer extends GameObject {
    constructor(x, y, text, direction, encounterCoordinates, keyframes, initialKeyframe) { // TODO: add name, dialogue etc
        super(x, y, text) // TODO: make text more sophisticated for dialogue later
        
        this.nextX = undefined
        this.nextY = undefined
        this.direction = direction
        this.encounterCoordinates = encounterCoordinates
        this.still = true
        this.fought = false
        this.animation = new TrainerAnimation(keyframes, initialKeyframe) // TODO: consider design that decouples trainer logic from animation
    }

    isStill() {
        return this.still
    }

    walk() {
        this.still = false
    }

    stand() {
        this.still = true
        this.x = this.nextX
        this.y = this.nextY

        this.nextX = undefined
        this.nextY = undefined
    }

    setNextPosition(playerX, playerY) {
        let distanceX = Math.abs(playerX - this.x)
        let distanceY = Math.abs(playerY - this.y)
        
        if (Direction.isVertical(this.direction)) distanceY--
        else distanceX--
        
        let totalDistance = distanceX + distanceY

        this.nextX = this.x + distanceX
        this.nextY = this.y + distanceY
        
        return totalDistance
    }

    isEncountered(x, y) {
        if (this.fought) return false

        for (let coordinate of this.encounterCoordinates) {
            if (coordinate[0] == x && coordinate[1] == y) return true
        }
        
        return false
    }

    wasFought() {
        this.fought = true
    }

    getCanvasPosition(playerX, playerY) {
        let relativeX = playerX - this.x
        let relativeY = playerY - this.y
        
        return [NORMALIZE_X - relativeX, NORMALIZE_Y - relativeY - 0.5] // -0.5 because trainer sprites are 32x48 large
    }
}