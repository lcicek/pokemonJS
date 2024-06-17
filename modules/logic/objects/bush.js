import { framesPerGrassAnimation } from "../../constants/timeConstants.js"
import { Lock } from "../../time/lock.js"

export class Bush {
    constructor(x, y, timestamp) {
        this.x = x
        this.y = y
        this.lock = new Lock()
        this.lock.lock(framesPerGrassAnimation, timestamp)   
    }

    update() {
        this.lock.tick()
    }

    canBeRemoved() {
        return this.lock.isUnlocked()
    }

    getTick() { // TODO: put this somewhere else
        return this.lock.getTick()
    }
}