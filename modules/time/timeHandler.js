import { timePerFrameMS } from "../constants/timeConstants.js";

export class TimeHandler {
    fpsDisplay = document.getElementById("fpsDisplay");
    frameEndTime = -1;

    isWaiting(currTime) {
        return currTime < this.frameEndTime;
    }

    setFrameEndTime(currTime) {
        this.frameEndTime = currTime + timePerFrameMS;
    }

    updateFpsDisplay(currTime) {
        let excessMS = currTime - this.frameEndTime;
        let elapsedMS = timePerFrameMS + excessMS;

        let currFPS = 1000 / elapsedMS
        fpsDisplay.textContent = currFPS.toFixed(0)
    }

    initiateFrame(currTime) {
        if (this.isWaiting(currTime)) return;

        this.updateFpsDisplay(currTime)
        this.setFrameEndTime(currTime)
    }
}

var fpsDisplay = document.getElementById("fpsDisplay")

