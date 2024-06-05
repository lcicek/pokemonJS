import { f, fr, fl, b, br, bl, r, rr, rl, l, lr, ll } from "../loaders/image-loaders/characterImages.js";
import { Direction } from "../logic/main-game/direction.js";
import { framesPerMovement } from "../constants/timeConstants.js";

export class PlayerAnimation {
    constructor() {
        this.cycles = [
            [[fr, f], [fl, f]],
            [[br, b], [bl, b]],
            [[rr, r], [rl, r]],
            [[lr, l], [ll, l]]
        ]

        this.currentCycleIndex = 0
        this.currentKeyframe = 1
        this.step = 1
        this.ticksPerKeyframe = framesPerMovement / 2 // using the term "ticks" since "frames" would also be a time unit here, whereas keyframes are images
    }

    setCycle(direction) {
        let index = -1

        if (Direction.south(direction)) index = 0
        else if (Direction.north(direction)) index = 1
        else if (Direction.east(direction)) index = 2
        else if (Direction.west(direction)) index = 3
        else console.error("Invalid direction provided.")

        this.currentCycleIndex = index
    }

    setKeyframe(currentTick) {
        this.currentKeyframe = Math.floor((currentTick-1) / this.ticksPerKeyframe) // TODO: check all integer division cases in project
    }

    toggleStep() {
        this.step ^= 1
    }

    getKeyframe() {
        return this.cycles[this.currentCycleIndex][this.step][this.currentKeyframe]
    }

    
}