import { framesPerMovement, framesPerNavigation } from "../constants/timeConstants.js";

export class Lock {
    currentFrame = 0
    endFrame = undefined   

    lock(duration) {
        this.endFrame = duration
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

export class MovementLock extends Lock {
    lock() {
        super.lock(framesPerMovement)
    }
}

export class MenuLock extends Lock {
    lock() {
        super.lock(framesPerNavigation)
    }
}