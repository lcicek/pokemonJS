import { Direction as dir } from "../main-game/direction.js";

class MenuInterface {
    items;
    length;

    constructor(items) {
        this.items = items;
        this.length = items.length;
        this.index = items.length > 0 ? 0 : undefined;
    }

    // returns whether navigation took place
    navigate() {}

    hasItems() {
        return this.length > 0
    }

    getSelected() {
        return this.hasItems() ? this.items[this.index] : undefined;
    }

    reset() {
        if (this.hasItems())
            this.index = 0;
    }
}

class ColumnMenuInterface extends MenuInterface {
    
    navigate(input) {
        let down = dir.south(input)
        let up = dir.north(input)

        if (down) this.index = (this.index + 1) % this.length;
        if (up) this.index = (this.index - 1) < 0 ? this.length-1 : (this.index - 1);

        return down || up
    }
}

export class StartMenu extends ColumnMenuInterface {
    constructor() {
        super(["continue cached game", "load saved game", "create new game"])
    }
}

export class GameMenu extends ColumnMenuInterface {
    constructor() {
        super(["pokemon", "bag", "save"])
    }

    bagSelected() {
        return this.getSelected() == "bag"
    }

    pokemonSelected() {
        return this.getSelected() == "pokemon"
    }

    saveSelected() {
        return this.getSelected() == "save"
    }
}

export class PokemonMenu extends MenuInterface {
    constructor() {
        super([null, null, null, null, null, null])
    }

    navigate(input) {
        let indexIsEven = this.index % 2 == 0;

        if (dir.south(input)) this.index = (this.index + 2) % this.length;
        else if (dir.north(input)) this.index = (this.index - 2 < 0) ? this.index + 4 : this.index - 2; // for 2 by 3
        else if (dir.west(input) || dir.east(input)) this.index = indexIsEven ? this.index + 1 : this.index - 1;

        return true
    }
}

export class BagMenu extends ColumnMenuInterface {
    constructor() {
        super([])
        this.bagDisplay = document.getElementById("bagDisplay")
    }

    setItems(bagContents) {
        this.items = bagContents
        this.length = bagContents.length
        this.index = 0
    }

    getSelected() {
        if (!this.hasItems()) return

        return this.items[this.index].name
    }
}

export class PokemonDetailsMenu extends MenuInterface {
    constructor() {
        super(["pokemon description", "pokemon attacks"])
    }

    navigate(input) {
        let right = dir.east(input)
        let left = dir.west(input)

        if (right) this.index = (this.index + 1) % this.length;
        if (left) this.index = (this.index - 1) < 0 ? this.length-1 : (this.index - 1);

        return right || left
    }
}

export class SaveMenu extends MenuInterface {
    constructor() {
        super([])
    }
}