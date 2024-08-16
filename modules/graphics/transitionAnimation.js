import { HEIGHT, WIDTH } from "../constants/graphicConstants.js";
import { iterationsPerEncounterTransition } from "../constants/timeConstants.js";

class TransitionAnimation {
    constructor(maxIterations) {
        this.columns = WIDTH;
        this.rows = HEIGHT;
        this.maxIterations = maxIterations;
    }

    getBoxCoordinates() {
        // to override
    }
}

export class EncounterTransitionAnimation extends TransitionAnimation {
    constructor() {
        super(iterationsPerEncounterTransition)
    }

    getBoxCoordinates(tick) {
        let tlColumn = (tick-1) % this.columns;
        let tlRow = Math.floor((tick-1) / this.columns)
        let shouldInverseColumns = tlRow % 2 == 1

        if (shouldInverseColumns) tlColumn = this.columns - 1 - tlColumn;

        let brColumn = this.columns - 1 - tlColumn;
        let brRow = this.rows - 1 - tlRow;

        return [[tlColumn, tlRow], [brColumn, brRow]];
    }
}