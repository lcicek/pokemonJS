import { Direction, Direction as dir} from "./direction.js";
import { Action } from "./constants/action.js";
import { MenuLock } from "./lock.js";

export class MenuNavigator {    
    constructor() {
        this.menuDisplay = document.getElementById("menuDisplay")

        // this.startMenu = new StartMenu()
        this.gameMenu = new GameMenu()
        this.bagMenu = new BagMenu()
        this.saveMenu = new SaveMenu()
        this.pokemonMenu = new PokemonMenu()
        this.pokemonDetailsMenu = new PokemonDetailsMenu()

        this.active = -1;
        this.menu = []
        this.menu.push(this.gameMenu, this.bagMenu, this.saveMenu, this.pokemonMenu, this.pokemonDetailsMenu)
        
        this.menuLock = new MenuLock()
    }

    update(input, timestamp) {
        if (!this.isActive()) { // note: impossible state is: (inactive, locked)
            this.setDisplay()

            if (input === Action.START) {
                this.activate()
                this.menuLock.lock(timestamp)
                this.setDisplay()
            }

            return
        }

        this.setDisplay()

        if (this.menuLock.isLocked(timestamp)) return

        if (Direction.isDirection(input)) this.getActive().navigate(input)
        else if (input === Action.B) this.closeMenu()
        else if (input === Action.A) this.nextMenu()
        // TODO: handle case where non-valid input (e.g. for PDMenu that would include Action.A) locks lock

        console.log(this.getActive().index) // TODO: fix short keyboard presses not being detected appropriately
        if (this.isActive()) this.menuLock.lock(timestamp)
    }

    setDisplay() {
        let str = ""
        if (this.isActive()) str = ` ${this.getActive().constructor.name}`
        this.menuDisplay.textContent = str
    }

    activate() {
        this.active = 0
    }

    nextMenu() {
        if (this.active === 0) {
            let gameMenu = this.getActive()

            if (gameMenu.bagSelected()) this.active = 1
            else if (gameMenu.saveSelected()) this.active = 2
            else if (gameMenu.pokemonSelected()) this.active = 3
            else console.error("Error occured. Game Menu item is not selected properly.")
        } else if (this.active == 3) {
            this.active++; // TODO: add associated pokemon data to be shown in pokemon details
        }
    }

    closeMenu() {
        if (!this.isActive()) return
        
        this.getActive().reset()

        if (1 <= this.active && this.active <= 3) this.active = 0
        else this.active--
    }

    getActive() {
        return this.menu[this.active]
    }

    isActive() {
        return this.active >= 0
    }
}

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
        else if (dir.west(input) || dir.east(key)) this.index = indexIsEven ? this.index + 1 : this.index - 1;
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
        super([]) // TODO: change
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