export class Trainer {
    constructor(x, y, direction, encounterCoordinates) { // TODO: add name, dialogue etc
        this.x = x
        this.y = y
        this.direction = direction
        this.encounterCoordinates = encounterCoordinates
        this.fought = false
    }

    isEncountered(x, y) {
        if (this.fought) return false

        for (let coordinate of this.encounterCoordinates) {
            if (coordinate[0] == x && coordinate[1] == y) return true
        }
        
        return false
    }

    wasFought() {
        this.fought = true
    }
}