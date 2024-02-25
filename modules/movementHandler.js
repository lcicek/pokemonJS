function getMovementDirection(key) {
    if (key == null) return null

    let deltas = [0, 0];

    if (key == "w") {
        deltas[1] = -1
    } else if (key == "s") {
        deltas[1] = 1
    } else if (key == "a") {
        deltas[0] = -1
    } else if (key == 'd') {
        deltas[0] = 1
    }

    return deltas
}

export { getMovementDirection }