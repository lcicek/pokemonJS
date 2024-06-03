import { State } from "./state.js";

var stateDisplay = document.getElementById("stateDisplay")

export class StateManager {
    constructor() {
        this.setState(State.Game)
    }

    setState(state) {
        this.state = state
        stateDisplay.textContent = `${Object.keys(State)[this.state]}`
    }

    getActiveState() {
        return this.state
    }

    isInGameState() {
        return this.state == State.Game || this.state == State.AwaitingEncounter
    }

    isInInteractionState() {
        return this.state == State.Interaction
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