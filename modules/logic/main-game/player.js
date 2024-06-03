export class Player {
    constructor(x, y) {
        this.x = x
        this.y = y
        
        this.prevX = x
        this.prevY = y

        this.direction = 's' // TODO: change depending on how player starts out
    }

    setDirection(direction) {
        this.direction = direction
    }
}