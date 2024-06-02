export class Player {
    constructor(x, y) {
        this.x = x
        this.y = y
        
        this.prevX = x
        this.prevY = y

        this.movementDirection = null
    }

    setMovementDirection(direction) {
        this.movementDirection = direction
    }
}