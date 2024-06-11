import { Sign, Collectable } from "../logic/objects/interactable.js"

export const Items = {
    Pokeball: "Pokeball",
    Potion: "Potion"
}

export const interactables = new Map()

interactables.set("7,4", new Sign("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."))
interactables.set("8,4", new Collectable(Items.Pokeball))
interactables.set("6,4", new Collectable(Items.Potion))