export class Direction {
    static isDirection(key) {
        return key == 'w' || key == 'a' || key == 's' || key == 'd'
    }

    static northwest(key) {
        return this.west(key) || this.north(key)
    }

    static northeast(key) {
        return this.north(key) || this.east(key);
    }

    static southwest(key) {
        return this.south(key) || this.west(key);
    }

    static southeast(key) {
        return this.south(key) || this.east(key);
    }

    static west(key) {
        return key == 'a'
    }

    static east(key) {
        return key == 'd'
    }

    static south(key) {
        return key == 's'
    }

    static north(key) {
        return key == 'w'
    }

    static isHorizontal(key) {
        return key == 'a' || key == 'd'
    }

    static isVertical(key) {
        return !this.isHorizontal(key)
    } 

    static toDeltas(key) {
        if (!this.isDirection(key)) return null;
        
        let deltas = [0, 0];
    
        if (key == "w") {
            deltas[1] = -1
        } else if (key == "s") {
            deltas[1] = 1
        } else if (key == "a") {
            deltas[0] = -1
        } else if (key == 'd') {
            deltas[0] = 1
        }
    
        return deltas
    }

    static toScalarDeltas(key, scalar) {
        let deltas = this.toDeltas(key)
        return [deltas[0] * scalar, deltas[1] * scalar]
    }
}