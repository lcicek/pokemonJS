import { framesPerMovement } from "../constants/timeConstants.js"
import { Lock } from "../time/lock.js"
import { CharacterAnimation } from "./animation.js"

export class AnimationQueue {
    constructor() {
        this.animations = []
        this.idle = true
        this.finished = false
    }

    addAnimation(animation) {
        this.animations.push(animation)
    }

    setAnimation() {
        this.animation = this.animations.shift()
        this.idle = false
    }

    animate(tick) {
        if (this.idle) return

        if (this.animation instanceof CharacterAnimation && (tick- 1) % framesPerMovement == 0) this.animation.toggleStep()
        
        // TODO: consider special case where we need to check if the last tick has unlocked the lock
        
        if (this.animations.length > 0) this.setAnimation()
        else this.finished = true
               
    }

    reset() {
        this.animations = []
        this.idle = true
        this.finished = false
    }

    getKeyframe(tick) {
        if (this.isIdle()) return undefined

        return this.animation.getKeyframe(tick)
    }

    isIdle() {
        return this.idle
    }

    isFinished() {
        return this.finished
    }

    isFinalAnimationFrame() {
        return this.animations.length == 0
    }

    isFinalAnimation() {
        return this.animation && this.animations.length == 0
    }
}