export class Lock {
    currentFrame = 0
    endFrame = undefined

    constructor(duration) {
        this.duration = duration
    }

    lock() {
        this.endFrame = this.duration // TODO: consider changing endframe and duration to be one thing
        this.currentFrame = 1 // TODO: check if it should be zero or one
    }

    isUnlocked() {
        return this.endFrame === undefined
    }

    unlock() {
        this.currentFrame = undefined
        this.endFrame = undefined;
    }
    
    isLocked() {
        return !this.isUnlocked()
    }

    tick() {
        if (this.currentFrame !== undefined) this.currentFrame++

        if (this.currentFrame > this.endFrame) {
            this.unlock()
        }
    }

    isFirstTick() {
        return this.currentFrame == 1
    }

    isLastTick() {
        return this.currentFrame == this.endFrame
    }
}