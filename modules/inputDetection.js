var inputDisplay = document.getElementById("inputDisplay")

let keyboard = {
    Press: 0,
    Down: 1,
}

let mode = 0
const activeKeys = new Set()

function addInputDetection() {
    document.addEventListener('keydown', function(event) {
        if (!keyisValid(event.key)) return // case: irrelevant input
        
        activeKeys.add(event.key)
        inputDisplay.textContent = Array.from(activeKeys)
    })

    document.addEventListener('keyup', function(event) {
        if (activeKeys.has(event.key)) activeKeys.delete(event.key)
        
        inputDisplay.textContent = Array.from(activeKeys)
    })
}

function keyisValid(key) {
    return key == "w" || key == "a" || key == "s" || key == "d" || key == 'o' || key =='k' || key == ' '
}

function toggleMode(key) {
    mode ^= 1
}

function getActiveKey() {
    let activeKey = null
    if (activeKeys.size > 0) [activeKey] = activeKeys // gets head of set

    return activeKey
}

export { addInputDetection, getActiveKey }