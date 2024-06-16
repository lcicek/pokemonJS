import { f, fr, fl, b, br, bl, r, rr, rl, l, lr, ll } from "../loaders/image-loaders/characterImages.js";
import { g1, g6, g7, g8 } from "../loaders/image-loaders/backgroundImages.js";
import { vegetaF, vegetaFR, vegetaFL } from "../loaders/image-loaders/trainerImages.js";

import { Direction } from "../logic/main-game/direction.js";
import { framesPerMovement, ticksPerFightMarkKeyframe, ticksPerGrassKeyframe, ticksPerMovementKeyframe } from "../constants/timeConstants.js";
import { fightMark } from "../loaders/image-loaders/objectImages.js";

class Animation {
    constructor(keyframes, ticksPerKeyframe) {
        this.keyframes = keyframes
        this.ticksPerKeyframe = ticksPerKeyframe
    }

    getKeyframe(tick) {
        return this.keyframes[this.indexOfKeyframe(tick)]
    }

    indexOfKeyframe(tick) {
        console.log(tick, this.keyframes.length, this.ticksPerKeyframe)
        return Math.floor((tick-1) / this.ticksPerKeyframe)
    }
}

export class FightMarkAnimation extends Animation {
    constructor() {
        super([fightMark], ticksPerFightMarkKeyframe)
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

class CharacterAnimation extends Animation {
    constructor(keyframes, initialKeyframe) {
        super(keyframes, ticksPerMovementKeyframe)
        this.step = 1
        this.lastKeyframe = initialKeyframe
    }

    indexOfKeyframe(tick) {
        tick = (tick - 1) % framesPerMovement
        return Math.floor(tick / this.ticksPerKeyframe)
    }

    toggleStep() {
        this.step ^= 1
    }

    getKeyframe(tick) {
        if (tick == undefined) return this.lastKeyframe

        let keyframe = this.keyframes[this.indexOfKeyframe(tick)][this.step]
        this.lastKeyframe = keyframe

        return keyframe
    }
}

export class TrainerAnimation extends CharacterAnimation {
    constructor(keyframes, initialKeyframe) {
        super(keyframes, initialKeyframe)
    }
}

export class PlayerAnimation extends CharacterAnimation {
    constructor() {
        super([[[fr, f], [fl, f]],
               [[br, b], [bl, b]],
               [[rr, r], [rl, r]],
               [[lr, l], [ll, l]]], f)

        this.currentCycleIndex = 0
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

    getKeyframe(tick) {
        if (tick == undefined) return this.lastKeyframe
        
        let keyframe = this.keyframes[this.currentCycleIndex][this.step][this.indexOfKeyframe(tick)]
        this.lastKeyframe = keyframe

        return keyframe
    }
}