var encounterDisplay = document.getElementById("encounterDisplay")

export class PokemonEncounter {
    static encounterOccurs() {
        let encounterProbability = 0.1

        let threshold = encounterProbability * 10
        let randomNumber = Math.floor(Math.random() * 10) + 1; // between 1 and 10
        return randomNumber <= threshold
    }

    static checkPokemonEncounter() {
        if (this.encounterOccurs()) {
            encounterDisplay.textContent = `true`
        } else {
            encounterDisplay.textContent = `false`
        }
    }
}