import { GameMenu, BagMenu, SaveMenu, PokemonMenu, PokemonDetailsMenu } from "./menu.js"
import { Direction } from "../main-game/direction.js"
import { Action } from "../../constants/action.js"

// const startMenu = new StartMenu()
const gameMenu = new GameMenu()
const bagMenu = new BagMenu()
const saveMenu = new SaveMenu()
const pokemonMenu = new PokemonMenu()
const pokemonDetailsMenu = new PokemonDetailsMenu()

class NavigatorInterface {
    constructor(menus, menuDisplay, subMenuDisplay) {
        this.active = -1;
        this.menu = []
        for (let m of menus) this.menu.push(m)

        this.menuDisplay = document.getElementById(menuDisplay)
        this.subMenuDisplay = document.getElementById(subMenuDisplay)
    }

    update(input) {
        if (!this.isOpen()) console.error("Navigator.update() was called despite not being active.") // sanity check

        let navigated = true

        if (Direction.isDirection(input)) navigated = this.getActive().navigate(input)
        else if (input === Action.B) this.closeMenu()
        else if (input === Action.A) this.nextMenu()
        else navigated = false

        return navigated
    }

    setDisplay() {
        if (this.isOpen()) {
            this.menuDisplay.textContent = ` ${this.getActive().constructor.name}`
            this.subMenuDisplay.textContent = this.getActive().getSelected()
        } else {
            this.menuDisplay.textContent = ""
            this.subMenuDisplay.textContent = ""
        }
    }

    activate() {
        this.active = 0
    }

    getActive() {
        return this.menu[this.active]
    }

    isOpen() {
        return this.active >= 0
    }

    isClosed() {
        return !this.isOpen()
    }
}

// TODO: implement FightNavigator

export class MenuNavigator extends NavigatorInterface {    
    constructor() {
        super([gameMenu, bagMenu, saveMenu, pokemonMenu, pokemonDetailsMenu], "menuDisplay", "subMenuDisplay")
    }

    tryOpen(input) {
        if (this.isOpen()) return true

        let opened = false
        if (input === Action.START) {
            this.activate()
            opened = true
        }

        this.setDisplay()
        return opened
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
        if (!this.isOpen()) return
        
        this.getActive().reset()

        if (1 <= this.active && this.active <= 3) this.active = 0
        else this.active--
    }
}