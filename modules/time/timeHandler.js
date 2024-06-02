import { FPS, timePerFrame } from "../constants/timeConstants.js";

let prevTimestamp; // timestamp
var fpsDisplay = document.getElementById("fpsDisplay")

async function enforceFps(timestamp) {
    if (prevTimestamp === undefined) {
        prevTimestamp = timestamp
    }
    
    let elapsed = (timestamp - prevTimestamp) / 1000 // in seconds
    let remaining = timePerFrame - elapsed
    prevTimestamp = timestamp
    
    if (remaining >= 0) {
        fpsDisplay.textContent = FPS // = 1 / timePerFrame = 1 / (elapsed + remaining) 
        await sleep(remaining)
    } else {
        let currentFPS = Math.round(1 / elapsed)
        fpsDisplay.textContent = currentFPS
        //console.log(`Elapsed time:  ${elapsed * 1000}ms. Intended time: 16.67ms. Current FPS: ${currentFPS}.`)
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export { enforceFps }