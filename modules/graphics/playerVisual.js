import { NORMALIZE_X, NORMALIZE_Y, SIZE } from "../constants/graphicConstants.js"
import { Direction } from "../logic/main-game/direction.js"

export class PlayerVisual {
    constructor(player) {
        this.updatePosition(player)
        this.shift = player.mode
    }

    updatePosition(player) { // TODO: improve performance. perhaps by shifting instead of recalculating
        this.x = -(player.prevX - NORMALIZE_X) * SIZE
        this.y = -(player.prevY - NORMALIZE_Y) * SIZE

        this.nextX = -(player.x - NORMALIZE_X) * SIZE
        this.nextY = -(player.y - NORMALIZE_Y) * SIZE
    }

    updateShift() {
        this.shift ^= 3
    }

    shiftVisual(direction) {
        if (Direction.north(direction)) this.y += this.shift
        else if (Direction.south(direction)) this.y -= this.shift
        else if (Direction.east(direction)) this.x -= this.shift
        else if (Direction.west(direction)) this.x += this.shift
    }

    setPositionToNext() {
        this.x = this.nextX
        this.y = this.nextY
    }

    reachedTarget() {
        return this.x == this.nextX && this.y == this.nextY
    }
}