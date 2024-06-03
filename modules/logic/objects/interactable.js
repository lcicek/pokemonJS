class InteractableInterface {
    constructor(text) {
        this.text = text
    }
}

export class Sign extends InteractableInterface {
    constructor(text) {
        super(text)
    }
}

export class Collectable extends InteractableInterface {
    constructor(collectableName) {
        super("You found one " + collectableName + ".")

        this.collected = false
    }

    collect() {
        this.collected = true
    }
}