import { Sign, Collectable, Trainer } from "../logic/objects/gameObject.js"
import { sign, pokeball } from "../loaders/image-loaders/objectImages.js"
import { trainers, interactables } from "../loaders/game-object-loaders/gameObjectInstances.js"

export function trainerIsEncountered(x, y) {
    for (let trainer of trainers) {
        if (!trainer.isInView(x, y)) continue

        if (trainer.isEncountered(x, y)) return trainer
    }

    return null
}

export function tryGettingGameObject(x, y) {
    for (let interactable of interactables) {
        if (x != interactable.x || y != interactable.y) continue

        if (interactable instanceof Collectable && interactable.wasCollected()) return null

        return interactable
    }

    return null
}

export function getGameObjectCollisions() {
    let gameObjects = interactables.concat(trainers)
    let coordinates = []
    
    for (let object of gameObjects) {
        if (object instanceof Collectable && object.wasCollected()) continue
        coordinates.push([object.x, object.y])
    }

    return coordinates
}

export function getGameObjectsForRendering(playerX, playerY) {
    let gameObjects = interactables.concat(trainers)
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