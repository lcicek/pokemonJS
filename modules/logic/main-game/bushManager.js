import { Bush } from "./bush.js"

export class BushManager {
    constructor() {
        this.bushes = []
    }

    tryUpdate() {
        for (let bush of this.bushes) bush.update()
    }

    add(x, y) {
        let bush = this.getBush()

        if (bush != null) this.bushes.splice(bush) // remove if present
        
        this.bushes.push(new Bush(x, y)) // insert again at end of queue
    }

    getBush(x, y) {
        for (let i = 0; i < this.bushes.length; i++) {
            let bush = this.bushes[i]

            if (bush.x == x && bush.y == y) return bush
        }

        return null
    }

    tryRemove() {
        if (this.bushes.length > 0 && this.bushes[0].canBeRemoved()) {
            this.bushes.shift()
            return true
        }

        return false
    }

    getTicks() { // TODO: consider outputting this alongside relative coordinates for performance
        let ticks = []
        for (let bush of this.bushes) {
            ticks.push(bush.getTick())
        }

        return ticks
    }
    
    getRelativeCoordinates(playerX, playerY) {
        let relativeCoordinates = []
        for (let bush of this.bushes) {
            relativeCoordinates.push([bush.x - playerX, bush.y - playerY])
        }

        return relativeCoordinates
    }

    isIdle() {
        return this.bushes.length == 0
    }
}