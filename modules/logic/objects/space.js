import { SIZE } from "../../constants/graphicConstants.js";

class SpaceInterface {    
    constructor(id, width, height) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.canvasWidth = width * SIZE
        this.canvasHeight = height * SIZE
        this.collisionMap = [] // override
        this.bushMap = [] // override; TODO: perhaps replace with general object map (0, 1, 2, 3...)
        this.doorCoordinates = []; // override
    }

    collides(x, y) {
        return this.collisionMap[y][x] == 1
    }

    isBush(x, y) {
        return this.bushMap[y][x] == 1
    }

    removeCollision(x, y) {
        this.collisionMap[y][x] = 0
    }

    addCollisions(collisionCoordinates) {
        for (let coordinate of collisionCoordinates) {
            let x = coordinate[0]
            let y = coordinate[1]

            if (this.collisionMap[y][x] == 1) console.log("Warning: Game Object Collision was set at an already solid coordinate.")
            
            this.collisionMap[y][x] = 1
        }
    }

    addCollision(x, y) {
        this.collisionMap[y][x] = 1
    }

    temporarilyRemoveCollision(x, y) {
        this.collisionMap[y][x] = 0
        this.collisionsToReadd.push([x, y])
    }

    refresh() {

    }

    getDoorCoordinates() {
        return this.doorCoordinates;
    }
}

export class House extends SpaceInterface {
    constructor(id, collisionMap) {
        super(id, collisionMap[0].length, collisionMap.length);
        this.collisionMap = collisionMap;
    }
}

export class Outside extends SpaceInterface {
    constructor(id) {
        super(id, 15, 15)
        this.collisionsToReadd = []

        this.doorCoordinates = [
            [4, 9]
        ]

        this.collisionMap = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]

        this.bushMap = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ]
    }
}