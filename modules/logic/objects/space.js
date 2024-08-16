export class Space {    
    constructor(spaceId, bgImage, fgImage, level, collisionMap, bushMap, doors) {
        this.spaceId = spaceId;

        this.bgImage = bgImage;
        this.fgImage = fgImage;
        
        this.level = level;
        this.collisionMap = collisionMap;
        this.bushMap = bushMap;
        this.doors = doors;

        this.width = collisionMap[0].length;
        this.height = collisionMap.length;
        this.collisionsToReadd = []
    }

    collides(x, y) {
        return this.collisionMap[y][x] == 1
    }

    isBush(x, y) {
        return this.bushMap[y][x] == 1
    }

    isDoor(x, y) {
        for (let door of this.doors) {
            if (door.isEntered(x, y)) return true;
        }

        return false;
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
}