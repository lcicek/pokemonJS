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

    isOutOfBounds(x, y) {
        return x < 0 || y < 0 || x >= this.width || y >= this.height;
    }

    collides(x, y) {
        return this.isOutOfBounds(x, y) || this.collisionMap[y][x] == 1
    }

    isBush(x, y) {
        if (this.bushMap == null) return false;

        return this.bushMap[y][x] == 1;
    }

    getDoor(x, y) {
        for (let door of this.doors) {
            if (door.isEntered(x, y)) return door;
        }

        return null;
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

    hasForeground() {
        return this.fgImage != null;
    }
}