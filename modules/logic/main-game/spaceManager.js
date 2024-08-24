import { Spaces } from "../../constants/dictionaries/spaces.js";
import { pokeball, sign } from "../../loaders/image-loaders/objectImages.js";
import { houseInside1 } from "../../loaders/space-loaders/houseInside1/houseInside1.js"
import { outside } from "../../loaders/space-loaders/outside/outside.js";
import { Collectable, Sign, Trainer } from "../objects/gameObject.js";

export class SpaceManager {
    constructor() {
        this.spaces = new Map();
        this.doors = [];

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

    tryGettingGameObject(x, y) {
        for (let interactable of this.activeSpace.interactables) {
            if (x != interactable.x || y != interactable.y) continue;
    
            if (interactable instanceof Collectable && interactable.wasCollected()) return null;
    
            return interactable
        }
    
        return null
    }

    trainerIsEncountered(x, y) {
        for (let trainer of this.activeSpace.trainers) {
            if (!trainer.isInView(x, y)) continue;
            if (trainer.isEncountered(x, y)) return trainer;
        }
    
        return null
    }

    initializeInteractableCollisions() {
        for (let space of this.spaces.values()) {
            for (let interactable of space.interactables) {
                if (interactable instanceof Collectable && interactable.wasCollected()) continue; // can't be collected here but just in case
                space.addCollision(interactable.x, interactable.y)
            }

            for (let trainer of space.trainers) {
                space.addCollision(trainer.x, trainer.y)
            }
        }
    }
    
    getGameObjectsForRendering(playerX, playerY) {
        let gameObjects = this.activeSpace.interactables.concat(this.activeSpace.trainers)
        let backgroundObjects = []
        let foregroundObjects = []
        
        for (let object of gameObjects) {
            if (!object.isInView(playerX, playerY)) continue
    
            let data = []
    
            if (object instanceof Sign) data = [sign, object.getCanvasPosition(playerX, playerY)]
            else if (object instanceof Collectable && !object.wasCollected()) data = [pokeball, object.getCanvasPosition(playerX, playerY)]
            else if (object instanceof Trainer && object.isStill()) data = [object.animation.lastKeyframe, object.getCanvasPosition(playerX, playerY)]
    
            if (data.length > 0 && object.isInForeground(playerY)) foregroundObjects.push(data)
            else if (data.length > 0) backgroundObjects.push(data)
        }
    
        return [backgroundObjects, foregroundObjects]
    }
}