import { Direction as dir } from "../main-game/direction.js";

class MenuInterface {
    items;
    length;

    constructor(items) {
        this.items = items;
        this.length = items.length;
        this.index = items.length > 0 ? 0 : undefined;
    }

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
        if (dir.south(input)) this.index = (this.index + 1) % this.length;
        if (dir.north(input)) this.index = (this.index - 1) < 0 ? this.length-1 : (this.index - 1);
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
    }
}

export class BagMenu extends ColumnMenuInterface {

    constructor() {
        super([])
    }

    add(item) {
        this.items.add(item)
        this.length++;
    }

    remove(item) {
        this.items.remove(item) // TODO: check for correctness
        this.length--;
    }
}

export class PokemonDetailsMenu extends MenuInterface {
    constructor() {
        super(["pokemon description", "pokemon attacks"])
    }

    navigate(input) {
        if (dir.east(input)) this.index = (this.index + 1) % this.length;
        if (dir.west(input)) this.index = (this.index - 1) < 0 ? this.length-1 : (this.index - 1);
    }
}

export class SaveMenu extends MenuInterface {
    constructor() {
        super([])
    }
}