var encounterDisplay = document.getElementById("encounterDisplay")

function tryEncounter() {
    let pokemonEncountered = encounterOccurs()

    if (pokemonEncountered) {
        encounterDisplay.textContent = `true`
    } else {
        encounterDisplay.textContent = `false`
    }

    return pokemonEncountered
}

function encounterOccurs() {
    let encounterProbability = 0.1 // TODO: put in constants file
    let threshold = encounterProbability * 10
    let randomNumber = Math.floor(Math.random() * 10) + 1; // between 1 and 10

    return randomNumber <= threshold
}


export { tryEncounter }