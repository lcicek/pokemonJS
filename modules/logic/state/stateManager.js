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
        return this.state == State.Game || this.isInAwaitingState() // TODO: inspect
    }

    isInInteractionState() {
        return this.state == State.Interaction
    }

    isInMenuState() {
        return this.state == State.Menu
    }

    isInFightState() {
        return this.state == State.TrainerFight || this.state == State.PokemonFight
    }

    isInTrainerEncounterState() {
        return this.state == State.TrainerEncounter || 
               this.state == State.TrainerWalk ||
              (this.state == State.Interaction && this.getNextState() == State.EncounterTransition) 
    }

    isInDoorTransitionState() {
        return this.isInDoorEntryTransitionState() || this.isInDoorExitTransitionState()
    }

    isInDoorEntryTransitionState() {
        return this.state == State.DoorEntryTransition
    }

    isInDoorExitTransitionState() {
        return this.state == State.DoorExitTransition
    }

    isInBlackScreenTransitionState() {
        return this.state == State.BlackScreen
    }

    isInEncounterTransitionState() {
        return this.state == State.EncounterTransition
    }

    // Ongoing-TODO: add different transition states here
    isInTransitionState() {
        return this.isInEncounterTransitionState() || this.isInDoorTransitionState() || this.isInBlackScreenTransitionState()
    }

    // Ongoing-TODO: add awaiting states here
    isInAwaitingState() {
        return this.state == State.AwaitingPokemonEncounter ||
                this.state == State.AwaitingTrainerEncounter ||
                this.state == State.AwaitingDoorEntry
    }

    isInClosingFieldState() {
        return this.state == State.ClosingField
    }

    toString() {
        let i = this.getActiveState();
        return Object.keys(State)[i];
    }
}