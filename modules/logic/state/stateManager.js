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

    isInTrainerEncounterState() {
        return this.state == State.TrainerEncounter
    }

    isAwaitingTrainerEncounter() {
        return this.state == State.AwaitingTrainerEncounter
    }

    isAwaitingAnyEncounter() {
        return this.isAwaitingEncounter() || this.isAwaitingTrainerEncounter()
    }

    isInClosingFieldState() {
        return this.state == State.ClosingField
    }

    toString() {
        let i = this.getActiveState();
        return Object.keys(State)[i];
    }
}