export class Door {
    constructor(originSpawn, targetSpawn) {
        this.originSpawn = originSpawn;
        this.targetSpawn = targetSpawn;
    }

    isEntered(x, y) {
        if (x == this.originSpawn.x && y == this.originSpawn.y) console.log("door entered")
        
        return x == this.originSpawn.x && y == this.originSpawn.y;
    }    
}