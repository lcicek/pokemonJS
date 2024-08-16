import { outside } from "../../loaders/space-loaders/outside.js";

export class SpaceManager {
    constructor() {
        this.spaces = []
        this.doors = []
    }

    initializeSpaces() {
        this.spaces.push(outside)
    }
}