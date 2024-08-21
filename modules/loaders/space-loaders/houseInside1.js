import { Space } from "../../logic/objects/space.js";
import { houseInsideImage } from "../image-loaders/spaceImages.js";
import { Door } from "../../logic/objects/door.js";
import { Spawn } from "../../logic/objects/spawn.js";
import { Spaces } from "../../constants/dictionaries/spaces.js";

// TODO: make list of some kind once there are more doors
let originSpace = Spaces.HouseInside1;
let targetSpace = Spaces.Outside;

let level = 1

let collisionMap = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 1, 1, 1],
];

let doors = [
    new Door(new Spawn(originSpace, 3, 5), new Spawn(targetSpace, 4, 11))
];

export const houseInside1 = new Space(originSpace, houseInsideImage, null, level, collisionMap, null, doors);
