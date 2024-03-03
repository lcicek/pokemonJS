export class Lock {
    endTime;    

    lock(startTime, duration) {
        this.endTime = startTime + duration
    }

    isUnlocked(currTime) {
        if (this.endTime === undefined) return true

        let unlocked = this.endTime <= currTime
        if (unlocked) this.reset()

        return unlocked
    }

    reset() {
        this.endTime = undefined;
    }
    
    isLocked(currTime) {
        return !this.isUnlocked(currTime)
    }
}

export class MovementLock extends Lock {
    lock(startTime) {
        super.lock(startTime, 150) // ms
    }
}

export class MenuLock extends Lock {
    lock(startTime) {
        super.lock(startTime, 150)
    }
}