import { HEIGHT, NORMALIZE_X, NORMALIZE_Y, WIDTH } from "../../constants/graphicConstants.js"
import { TrainerAnimation } from "../../graphics/animation.js"
import { Direction } from "../main-game/direction.js"

class GameObject {
    constructor(x, y, text) {
        this.x = x
        this.y = y
        this.text = text
    }

    isInForeground(playerY) {
        return this.y > playerY
    }

    isInView(playerX, playerY) {
        let [canvasX, canvasY] = this.getCanvasPosition(playerX, playerY)
        return -2 <= canvasX && canvasX <= WIDTH+2 && -2 <= canvasY && canvasY <= HEIGHT+2 // add a margin of -2/+2 so object doesnt get cut out when it's moving out of frame
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

        this.tmpX = undefined
        this.tmpY = undefined

        this.direction = direction
        this.encounterCoordinates = encounterCoordinates
        this.still = true
        this.encountered = false
        this.animation = new TrainerAnimation(keyframes, initialKeyframe) // TODO: consider design that decouples trainer logic from animation
    }

    isInForeground(playerY) {
        return this.getY() > playerY
    }

    isStill() {
        return this.still
    }

    walk() {
        this.still = false
    }

    stand() {
        this.still = true
        this.tmpX = this.nextX
        this.tmpY = this.nextY

        this.nextX = undefined
        this.nextY = undefined
    }

    setNextPosition(playerX, playerY) {
        let distanceX = Math.abs(playerX - this.getX())
        let distanceY = Math.abs(playerY - this.getY())
        
        if (Direction.isVertical(this.direction)) distanceY--
        else distanceX--
        
        let totalDistance = distanceX + distanceY

        this.nextX = this.getX() + distanceX
        this.nextY = this.getY() + distanceY
        
        return totalDistance
    }

    resetPosition() {
        this.tmpX = undefined
        this.tmpY = undefined
    }

    isEncountered(x, y) {
        if (this.encountered) return false

        for (let coordinate of this.encounterCoordinates) {
            if (coordinate[0] == x && coordinate[1] == y) return true
        }
        
        return false
    }

    wasEncountered() {
        this.encountered = true
    }

    getCanvasPosition(playerX, playerY) {
        let relativeX = playerX - this.getX()
        let relativeY = playerY - this.getY()
        
        return [NORMALIZE_X - relativeX, NORMALIZE_Y - relativeY - 0.5] // -0.5 because trainer sprites are 32x48 large
    }

    getX() {
        return this.tmpX == undefined ? this.x : this.tmpX
    }

    getY() {
        return this.tmpY == undefined ? this.y : this.tmpY
    }
}