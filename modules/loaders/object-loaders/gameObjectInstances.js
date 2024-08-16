import { Collectable, Sign, Trainer } from "../../logic/objects/gameObject.js"
import { vegetaF, vegetaFL, vegetaFR } from "../image-loaders/trainerImages.js"

export const ItemNames = {
    Pokeball: "POKEBALL",
    Potion: "POTION"
}

export const interactables = [
    new Collectable(6, 4, ItemNames.Potion),
    new Sign(7, 4, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."),
    new Collectable(8, 4, ItemNames.Pokeball)
]

export const trainers = [
    new Trainer(5, 4, "Strength is the only thing that matters in this world.", 's', [[5, 5], [5, 6], [5, 7], [5, 8]], [[vegetaFR, vegetaF], [vegetaFL, vegetaF]], vegetaF)
]