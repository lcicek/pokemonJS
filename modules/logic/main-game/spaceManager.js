import { Spaces } from "../../constants/dictionaries/spaces.js";
import { houseInside1 } from "../../loaders/space-loaders/houseInside1.js";
import { outside } from "../../loaders/space-loaders/outside.js";

export class SpaceManager {
    constructor() {
        this.spaces = new Map();
        this.doors = [];

        this.initializeSpaces()

        this.activeSpace = outside;
        this.nextSpawn = undefined;
    }

    updateActiveSpace(player) {
        this.activeSpace = this.spaces.get(this.nextSpawn.spaceId);

        player.prevX = this.nextSpawn.x;
        player.prevY = this.nextSpawn.y;

        player.x = this.nextSpawn.x;
        player.y = this.nextSpawn.y;

        this.nextSpawn = undefined;
    }

    setNextSpace(space) {
        this.nextSpace = space;
    }

    initializeSpaces() {
        this.spaces.set(Spaces.Outside, outside)
        this.spaces.set(Spaces.HouseInside1, houseInside1);
    }

    addCollisionToSpace(x, y) {
        this.activeSpace.addCollision(x, y); // TODO: check if causes issues
    }

    removeCollisionFromSpace(x, y) {
        this.activeSpace.removeCollision(x, y);
    }

    isBush(x, y) {
        return this.activeSpace.isBush(x, y);
    }

    isDoor(x, y) {
        let door = this.activeSpace.getDoor(x, y);
        if (door == null) return false;

        this.nextSpawn = door.targetSpawn
        return true;
    }

    spaceHasForeground() {
       return this.activeSpace.hasForeground();
    }
}