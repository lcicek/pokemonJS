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

export function getGameObjectsForRendering(playerX, playerY, tick) {
    let gameObjects = interactables.concat(trainers)
    let data = []
    
    for (let object of gameObjects) {
        if (!object.isInView(playerX, playerY)) continue

        if (object instanceof Sign) data.push([sign, object.getCanvasPosition(playerX, playerY)])
        else if (object instanceof Collectable && !object.wasCollected()) data.push([pokeball, object.getCanvasPosition(playerX, playerY)])
        else if (object instanceof Trainer && object.isStill()) data.push([object.animation.getKeyframe(tick), object.getCanvasPosition(playerX, playerY)])
        
    }

    return data
}