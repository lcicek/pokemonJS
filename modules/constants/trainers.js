import { Trainer } from "../logic/main-game/trainer.js"

const trainers = [
    new Trainer(9, 4, 's', [[9, 5], [9, 6]])
]

export function trainerIsEncountered(x, y) {
    for (let trainer of trainers) {
        if (trainer.isEncountered(x, y)) return true
    }

    return false
}