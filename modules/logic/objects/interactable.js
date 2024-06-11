import { HEIGHT, NORMALIZE_X, NORMALIZE_Y, WIDTH } from "../../constants/graphicConstants.js"

class Interactable {
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

export class Sign extends Interactable {
    constructor(x, y, text) {
        super(x, y, text)
    }
}

export class Collectable extends Interactable {
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