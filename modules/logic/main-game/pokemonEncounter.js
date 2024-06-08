var encounterDisplay = document.getElementById("encounterDisplay")

export function encounterOccurs() {
    let encounterProbability = 0 // TODO: put in constants file
    let threshold = encounterProbability * 10
    let randomNumber = Math.floor(Math.random() * 10) + 1; // between 1 and 10
    let pokemonEncountered = randomNumber <= threshold

    if (pokemonEncountered) {
        encounterDisplay.textContent = `true`
    } else {
        encounterDisplay.textContent = `false`
    }

    return pokemonEncountered
}