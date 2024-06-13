import { NORMALIZE_X, NORMALIZE_Y, SIZE } from "../constants/graphicConstants.js"
import { Direction } from "../logic/main-game/direction.js"

export class CharacterVisual {
    constructor() {
        //
    }
}

export class PlayerVisual {
    constructor(player) {
        this.setPosition(player)
    }

    setPosition(player) { // TODO: improve performance. perhaps by shifting instead of recalculating
        this.x = (-player.prevX + NORMALIZE_X) * SIZE
        this.y = (-player.prevY + NORMALIZE_Y) * SIZE

        this.nextX = (-player.x + NORMALIZE_X) * SIZE
        this.nextY = (-player.y + NORMALIZE_Y) * SIZE

        this.deltas = Direction.toDeltas(player.direction)
    }

    shiftVisual() {
        this.x -= this.deltas[0]
        this.y -= this.deltas[1]
    }

    ensurePositionIsNext() {
        this.x = this.nextX
        this.y = this.nextY
    }

    reachedTarget() {
        return this.x == this.nextX && this.y == this.nextY
    }

    getRemainingShifts() {
        return [this.nextX - this.x, this.nextY - this.y]
    }
}