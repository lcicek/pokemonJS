import { f, fr, fl, b, br, bl, r, rr, rl, l, lr, ll } from "../loaders/image-loaders/characterImages.js";
import { g1, g2, g3, g4, g5, g6, g7, g8 } from "../loaders/image-loaders/backgroundImages.js";
import { Direction } from "../logic/main-game/direction.js";
import { ticksPerGrassKeyframe, ticksPerMovementKeyframe } from "../constants/timeConstants.js";

class Animation {
    constructor(keyframes, ticksPerKeyframe) {
        this.keyframes = keyframes
        this.ticksPerKeyframe = ticksPerKeyframe
    }

    getKeyframe(tick) {
        return this.keyframes[this.indexOfKeyframe(tick)]
    }

    indexOfKeyframe(tick) {
        return Math.floor((tick-1) / this.ticksPerKeyframe)
    }
}

export class GrassAnimation extends Animation {
    constructor() {
        super([g1, g6, g7, g8], ticksPerGrassKeyframe)
    }

    getKeyframes(ticks) {
        let keyframes = []

        for (let tick of ticks) {
            keyframes.push(this.getKeyframe(tick))
        }

        return keyframes
    }
}

export class PlayerAnimation extends Animation {
    constructor() {
        super([[[fr, f], [fl, f]],
                [[br, b], [bl, b]],
                [[rr, r], [rl, r]],
                [[lr, l], [ll, l]]], ticksPerMovementKeyframe)

        // these variables are set so that the animation initially points to 'f'
        this.currentCycleIndex = 0
        this.step = 1
        this.lastKeyframe = f
    }

    setKeyframeCycle(direction) {
        let index = -1

        if (Direction.south(direction)) index = 0
        else if (Direction.north(direction)) index = 1
        else if (Direction.east(direction)) index = 2
        else if (Direction.west(direction)) index = 3
        else console.error("Invalid direction provided.")

        this.currentCycleIndex = index
    }

    toggleStep() {
        this.step ^= 1
    }

    getKeyframe(tick) {
        let keyframe = this.keyframes[this.currentCycleIndex][this.step][this.indexOfKeyframe(tick)]
        this.lastKeyframe = keyframe

        return keyframe
    }
}