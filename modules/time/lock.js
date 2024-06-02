import { timePerMovement, timePerNavigation } from "../constants/timeConstants.js";

export class Lock {
    endTime = undefined;    

    lock(startTime, duration) {
        this.endTime = startTime + duration
    }

    isUnlocked() {
        return this.endTime === undefined
    }

    tryUnlock(currTime) {
        let lockElapsed = this.endTime <= currTime
        if (lockElapsed) this.unlock()

        return lockElapsed
    }

    unlock() {
        this.endTime = undefined;
    }
    
    isLocked() {
        return !this.isUnlocked()
    }
}

export class MovementLock extends Lock {
    lock(startTime) {
        super.lock(startTime, timePerMovement)
    }
}

export class MenuLock extends Lock {
    lock(startTime) {
        super.lock(startTime, timePerNavigation)
    }
}