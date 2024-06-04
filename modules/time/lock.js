export class Lock {
    currentFrame = 0
    endFrame = undefined
    duration = undefined
    starTime = undefined

    constructor(intendedTimePerFrameMS) {
        this.intendedTimePerFrameMS = intendedTimePerFrameMS
    }

    lock(frames, startTime) {
        this.endFrame = frames // TODO: consider changing endframe and duration to be one thing
        this.currentFrame = 1 // TODO: check if it should be zero or one
        this.startTime = startTime
        this.duration = frames * this.intendedTimePerFrameMS
    }

    isUnlocked() {
        return this.endFrame === undefined
    }

    unlock() {
        this.currentFrame = undefined
        this.endFrame = undefined
        this.duration = undefined
        this.starTime = undefined
    }
    
    isLocked() {
        return !this.isUnlocked()
    }

    tick(timestamp) {
        if (this.currentFrame !== undefined) {
            this.currentFrame++
        }

        if (this.currentFrame > this.endFrame || timestamp - this.starTime > this.duration) {
            this.unlock()
        }

        if (timestamp - this.starTime > this.duration) {
            console.log("Lock-Frames were skipped due to a frame taking too long.")
        }
    }

    isFirstTick() {
        return this.currentFrame == 1
    }

    isLastTick() {
        return this.currentFrame == this.endFrame
    }
}