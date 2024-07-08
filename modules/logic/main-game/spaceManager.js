import { doors } from "../../loaders/object-loaders/doorInstances.js";
import { spaces } from "../../loaders/object-loaders/spaceInstances.js";

export class SpaceManager {
    constructor() {
        this.spaces = spaces;
        this.doors = doors;

        this.activeSpaceID = 0; // TODO: set differently in the future
    }

    tryEnterNewSpace(playerX, playerY) {
        let originSpace = this.spaces[this.activeSpaceID];
        let doorCoordinates = originSpace.getDoorCoordinates();

        for (let coordinate of doorCoordinates) {
            if (playerX != coordinate[1] || playerY != coordinate[0]) continue;

            let targetDoor = this.doors[this.activeSpaceID].
        }
    }
}