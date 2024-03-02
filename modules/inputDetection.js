var activeKey = null
var inputDisplay = document.getElementById("inputDisplay")

function addInputDetection() {
    document.addEventListener('keydown', function(event) {
        if (event.key == activeKey) return
        if (!keyisValid(event.key)) {
            activeKey = null
            return
        }

        activeKey = event.key
        inputDisplay.textContent = activeKey
    })

    document.addEventListener('keyup', function(event) {
        if (event.key != activeKey) return
        
        activeKey = null
        inputDisplay.textContent = activeKey
    })
}

function keyisValid(key) {
    return key == "w" || key == "a" || key == "s" || key == "d" || key == 'o' || key =='k' || key == ' '
}

export { addInputDetection, activeKey}