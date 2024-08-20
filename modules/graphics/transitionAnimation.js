import { HEIGHT, WIDTH } from "../constants/graphicConstants.js";
import { iterationsPerDoorTransition, iterationsPerEncounterTransition } from "../constants/timeConstants.js";

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

export class DoorTransitionAnimation extends TransitionAnimation {
    constructor() {
        super(iterationsPerDoorTransition);

        this.opacitySectionSize = iterationsPerDoorTransition / 20; // TODO: move 20 to constants
        this.opacityStep = 1 / 20
    }

    getOpacity(tick) {
        let normalizedTick = tick - 1;
        let section = (normalizedTick / this.opacitySectionSize) + 1;
        return section * this.opacityStep
    }
}

export class DoorEntryTransitionAnimation extends DoorTransitionAnimation {
    constructor() {
        super();
    }
}

export class DoorExitTransitionAnimation extends DoorTransitionAnimation {
    constructor() {
        super();
    }

    getOpacity(tick) {
        let normalizedTick = tick - 1;
        let section = (normalizedTick / this.opacitySectionSize) + 1;
        return 1 - (section * this.opacityStep) // invert because we go from dark to light / opacity of black decreases
    }
}