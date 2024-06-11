import { Sign, Collectable } from "../logic/objects/interactable.js"
import { sign, pokeball } from "../loaders/image-loaders/backgroundImages.js"

export const ItemNames = {
    Pokeball: "Pokeball",
    Potion: "Potion"
}

export const interactables = [
    new Sign(7, 4, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."),
    new Collectable(8, 4, ItemNames.Pokeball),
    new Collectable(6, 4, ItemNames.Potion)
]

export function tryGettingInteractable(x, y) {
    for (let interactable of interactables) {
        if (x != interactable.x || y != interactable.y) continue

        if (interactable instanceof Collectable && interactable.wasCollected()) return null

        return interactable
    }

    return null
}

export function getInteractablesForRendering(playerX, playerY) {
    let data = []
    
    for (let interactable of interactables) {
        if (!interactable.isInView(playerX, playerY)) continue

        if (interactable instanceof Sign) data.push([sign, interactable.getCanvasPosition(playerX, playerY)])
        else if (interactable instanceof Collectable && !interactable.wasCollected()) data.push([pokeball, interactable.getCanvasPosition(playerX, playerY)])
    }

    return data
}