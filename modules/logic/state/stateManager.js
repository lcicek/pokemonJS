import { State } from "./state.js";

export class StateManager {
    constructor() {
        this.setGameState()
    }

    setState(state) {
        this.state = state
    }

    setMenuState() {
        this.state = State.Menu
    }

    setGameState() {
        if (!this.isInGameState()) this.state = State.Game
    }

    getActiveState() {
        return this.state
    }

    isInGameState() {
        return this.state == State.Game || this.state == State.AwaitingEncounter
    }

    isInMenuState() {
        return this.state == State.Menu
    }

    isAwaitingEncounter() {
        return this.state == State.AwaitingEncounter
    }

    toString() {
        let i = this.getActiveState();
        return Object.keys(State)[i];
    }
}