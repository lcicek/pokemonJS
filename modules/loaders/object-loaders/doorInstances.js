import { Door } from "../../logic/objects/door.js"
import { spaces } from "./spaceInstances.js"

// TODO: FIX INSTANTIATION

export const doors = [
    // outside space:
    [
        new Door([[0, 9, 4], [1, 1, 2]])
    ]
]; 

for (let i = 0; i < spaces.length; i++) {
    let space = spaces[i];
    let spaceID = space.id;
    let doorCoordinates = space.getDoorCoordinates();
    let doorsInCurrentSpace = []

    for (let doorCoordinate of doorCoordinates) {
        let x = doorCoordinate[1];
        let y = doorCoordinate[0];
        let data = [i, x, y]; // TODO: check order (1 vs 0 first)
        let door = new Door(data);

        doorsInCurrentSpace.push(door);
    }

    doors.push(doorsInCurrentSpace)
}