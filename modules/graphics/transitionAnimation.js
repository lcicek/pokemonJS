import { HEIGHT, WIDTH } from "../constants/graphicConstants.js";
import { iterationsPerEncounterTransition, ticksPerEncounterTransitionIteration } from "../constants/timeConstants.js";

class TransitionAnimation {
    constructor(maxIterations, ticksPerIteration) {
        this.columns = WIDTH;
        this.rows = HEIGHT;
        this.maxIterations = maxIterations;
        this.ticksPerIteration = ticksPerIteration;
    }

    getBoxCoordinates() {
        // to override
    }
}

export class EncounterTransitionAnimation extends TransitionAnimation {
    constructor() {
        super(iterationsPerEncounterTransition, ticksPerEncounterTransitionIteration)
    }

    getBoxCoordinates(tick) {
        tick = Math.floor(tick / this.ticksPerIteration) + 1 // essentially casts tick from range 1 to 2x back to 1 to x, where 2 is ticksPerIteration

        let tlColumn = (tick-1) % this.columns;
        let tlRow = Math.floor((tick-1) / this.columns)
        let shouldInverseColumns = tlRow % 2 == 1

        if (shouldInverseColumns) tlColumn = this.columns - 1 - tlColumn;

        let brColumn = this.columns - 1 - tlColumn;
        let brRow = this.rows - 1 - tlRow;

        return [[tlColumn, tlRow], [brColumn, brRow]];
    }
}