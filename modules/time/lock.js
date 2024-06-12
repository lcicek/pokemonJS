import { timePerFrameMS } from "../constants/timeConstants.js"

export class Lock {
    currentTick = undefined
    endTick = undefined
    duration = undefined
    starTime = undefined

    lock(frames, startTime) {
        this.endTick = frames // TODO: consider changing endTick and duration to be one thing
        this.currentTick = 1 // TODO: check if it should be zero or one
        this.startTime = startTime
        this.duration = frames * timePerFrameMS
    }

    isUnlocked() {
        return this.endTick === undefined
    }

    unlock() {
        this.currentTick = undefined
        this.endTick = undefined
        this.duration = undefined
        this.starTime = undefined
    }
    
    isLocked() {
        return !this.isUnlocked()
    }

    tick(timestamp) {
        if (this.currentTick !== undefined) {
            this.currentTick++
        }

        if (this.currentTick > this.endTick || timestamp - this.starTime > this.duration) {
            this.unlock()
        }

        if (timestamp - this.starTime > this.duration) {
            console.log("Lock-Frames were skipped due to a frame taking too long.")
        }
    }

    isFirstTick() {
        return this.currentTick == 1
    }

    getTick() {
        return this.currentTick
    }

    isLastTick() {
        return this.currentTick == this.endTick
    }

    isHalfwayElapsed() {
        return this.currentTick >= Math.floor(this.endTick / 2) // TODO: check math floor usage. should be correct for 32
    }
}