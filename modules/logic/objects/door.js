export class Door {
    // @param data: contains two entries that contain an integer denoting the space, followed by coordinates x and y.
    constructor(data) {
        this.spaces = new Map()

        for (let entry of data) {
            let spaceID = entry[0]
            let x = entry[1]
            let y = entry[2]

            this.spaces.set(spaceID, [x, y])
        }
    }

    isEntered(spaceId, playerX, playerY) {
        if (!this.spaces.has(spaceId)) return false

        let doorCoordinates = this.spaces.get(spaceId)
        let doorX = doorCoordinates[0]
        let doorY = doorCoordinates[1]

        return playerX == doorX && playerY == doorY
    }

    getEnteredSpace(originSpaceId) { // given a key, returns the other key in the map, i.e., given an origin space returns the target space
        let spaceIDs = this.spaces.keys()
        
        let targetSpaceID = spaceIDs.next().value 
        if (targetSpaceID != originSpaceId) return targetSpaceID

        return spaceIDs.next().value
    }

    getSpawnCoordinate(targetSpaceID) {
        let [x, y] = this.spaces.get(targetSpaceID);
        
    }
}