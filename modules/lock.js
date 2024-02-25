export class Lock {
    #startTime;
    #duration;    

    lock(startTime, duration) {
        this.startTime = startTime
        this.duration = duration
    }

    isUnlocked(currTime) {
        return this.startTime === undefined || this.startTime + this.duration <= currTime
    }
}

export class MovementLock extends Lock {
    lock(startTime) {
        super.lock(startTime, 250) // 500 ms
    }
}