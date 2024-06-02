import { State } from "./state.js";

var stateDisplay = document.getElementById("stateDisplay")

export class StateManager {
    constructor() {
        this.setGameState()
    }

    setState(state) {
        this.state = state
        stateDisplay.textContent = `${Object.keys(State)[this.state]}`
    }

    setMenuState() {
        this.setState(State.Menu)
    }

    setGameState() {
        this.setState(State.Game)
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