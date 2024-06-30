import { State } from "./state.js";

var stateDisplay = document.getElementById("stateDisplay")

export class StateManager {
    constructor() {
        this.nextStates = []
        this.setState(State.Game)
        this.mode = 0 // 0 = single, 1 = queue
    }

    setNextStates(...states) {
        this.nextStates = states
        this.mode = 1
        this.enterNextState()
    }

    isInputState() {
        return this.state == State.Game || this.state == State.Menu || this.state == State.Interaction
    }

    getNextState() {
        return this.nextStates[0]
    }

    enterNextState() {
        if (this.nextStates.length > 0) {
            let currentState = this.nextStates.shift()
            this.setState(currentState)
        }
        else this.mode = 0
    }

    setState(state) {
        this.state = state
        stateDisplay.textContent = `${Object.keys(State)[this.state]}`
    }

    getActiveState() {
        return this.state
    }

    hasNextState() {
        return this.nextStates.length > 0
    }

    isInGameState() {
        return this.state == State.Game || this.state == State.AwaitingPokemonEncounter // TODO: inspect
    }

    isInInteractionState() {
        return this.state == State.Interaction
    }

    isInMenuState() {
        return this.state == State.Menu
    }

    isAwaitingPokemonEncounter() {
        return this.state == State.AwaitingPokemonEncounter
    }

    isInFightState() {
        return this.state == State.TrainerFight || this.state == State.PokemonFight
    }

    isInTrainerEncounterState() {
        return this.state == State.TrainerEncounter || 
               this.state == State.TrainerWalk ||
              (this.state == State.Interaction && this.getNextState() == State.EncounterTransition) 
    }

    isInTransitionState() {
        return this.state == State.EncounterTransition // TODO: add different transition states here
    }

    isAwaitingTrainerEncounter() {
        return this.state == State.AwaitingTrainerEncounter
    }

    isAwaitingAnyEncounter() {
        return this.isAwaitingPokemonEncounter() || this.isAwaitingTrainerEncounter()
    }

    isInClosingFieldState() {
        return this.state == State.ClosingField
    }

    toString() {
        let i = this.getActiveState();
        return Object.keys(State)[i];
    }
}