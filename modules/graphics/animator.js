import { Lock } from "../time/lock.js"

export class Animator {
    constructor() {
        this.animations = []
        this.durations = []
        this.idle = true
        this.finished = false
    }

    addAnimation(animation, duration) {
        this.animations.push(animation)
        this.durations.push(duration)
    }

    setAnimation() {
        this.animation = this.animations.shift()
        this.duration = this.durations.shift()

        this.lock = new Lock()
        this.lock.lock(this.duration)

        this.idle = false
    }

    animate() {
        if (this.idle) return
        if (this.lock.isLocked()) this.lock.tick()
        if (this.lock.isLocked()) return // special case where we need to check if the last tick has unlocked the lock
        
        if (this.animations.length > 0) this.setAnimation()
        else this.finished = true
               
    }

    reset() {
        this.animations = []
        this.durations = []
        this.idle = true
        this.finished = false
    }

    getKeyframe() {
        if (this.isIdle()) return undefined

        return this.animation.getKeyframe(this.lock.getTick())
    }

    getTick() {
        if (this.isIdle()) return undefined
        
        return this.lock.getTick()
    }

    isIdle() {
        return this.idle
    }

    isFinished() {
        return this.finished
    }

    isFinalAnimationFrame() {
        return this.lock.isLastTick() && this.animations.length == 0
    }

    isFinalAnimation() {
        return this.animation && this.animations.length == 0
    }
}