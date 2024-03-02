import { State } from "./state.js";
import { Action } from "./constants/action.js";
import { BagMenu, PokemonMenu } from "./menu.js";

export class StateManager {
    constructor() {
        this.setGameState()
    }

    setMenuState() {
        this.state = State.Menu
    }

    setGameState() {
        this.state = State.Game
    }

    getActiveState() {
        return this.state
    }

    inGameState() {
        return this.getActiveState() === State.Game
    }

    toString() {
        let i = this.getActiveState();
        return Object.keys(State)[i];
    }
}