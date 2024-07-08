import { House, Outside } from "../../logic/objects/space";

const Space = {
    Outside: 0,
    House1: 1
}

export const spaces = [
    new Outside(Space.Outside),
    new House(Space.House1,
        [
            [1, 1, 1],
            [1, 0, 1],
            [1, 0, 1]
        ]
    )
]