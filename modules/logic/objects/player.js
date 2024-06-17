export class Player {
    constructor(x, y) {
        this.x = x
        this.y = y
        
        this.prevX = x
        this.prevY = y

        this.direction = 's' // TODO: change depending on how player starts out
        this.mode = 1 // mode 1 or 2 aka walk vs sprint
    }

    setDirection(direction) {
        this.direction = direction
    }

    toggleMode() {
        this.mode ^= 3 
    }
    
    collided() {
        return this.prevX == this.x && this.prevY == this.y
    }
}