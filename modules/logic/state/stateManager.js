import { State } from "./state.js";

export class StateManager {
    constructor() {
        this.setGameState()
    }

    setMenuState() {
        this.state = State.Menu
    }

    setGameState() {
        if (!this.inGameState()) this.state = State.Game
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