import { CANVAS_WIDTH, CANVAS_HEIGHT, SIZE, CENTER_WIDTH, CENTER_HEIGHT, NORMALIZE_X, NORMALIZE_Y } from "../constants/graphicConstants.js";
import { outsideImageBG, outsideImageFG, characterSf } from "../loaders/resourceLoader.js";
import { timePerFrameMS, framesPerMovement } from "../constants/timeConstants.js";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
context.imageSmoothingEnabled = false

canvas.width = CANVAS_WIDTH //CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT // CANVAS_HEIGHT

const shiftDistancePerFrame = Math.floor(SIZE / framesPerMovement)

var startX = undefined
var startY = undefined
var x = undefined
var y = undefined
var targetX = undefined
var targetY = undefined

function render(player, movementBegins, movementEnds) { // player x,y
    if (movementBegins) prepareCoordinates(player)

    let horizontalMovement = (targetX - startX) != 0
    let direction = (startX < targetX) || (startY < targetY) ? 1 : -1
    let reachedTarget = 
        (horizontalMovement && direction > 0 && x + shiftDistancePerFrame >= targetX) ||
        (horizontalMovement && direction < 0 && x - shiftDistancePerFrame <= targetX) ||
        (!horizontalMovement && direction > 0 && y + shiftDistancePerFrame >= targetY) ||
        (!horizontalMovement && direction < 0 && y - shiftDistancePerFrame <= targetY)

    if (movementEnds || reachedTarget) {
        x = targetX
        y = targetY
    } else {
        // one of these will be zero since movement occurs only in one direction x/y:
        if (horizontalMovement && direction > 0) x += shiftDistancePerFrame
        else if (horizontalMovement && direction < 0) x -= shiftDistancePerFrame
        else if (!horizontalMovement && direction > 0) y += shiftDistancePerFrame
        else if (!horizontalMovement && direction < 0) y -= shiftDistancePerFrame   
    }

    // console.log(x, y)

    renderCanvasBackground() 
    renderMapBackground(x, y)
    renderPlayer()
    renderMapForeground(x, y)
}

function prepareCoordinates(player) {
    // TODO: check for possible performance improvement
    startX = -(player.prevX - NORMALIZE_X) * SIZE
    startY = -(player.prevY - NORMALIZE_Y) * SIZE

    x = startX
    y = startY

    targetX = -(player.x - NORMALIZE_X) * SIZE
    targetY = -(player.y - NORMALIZE_Y) * SIZE

    console.log("start:")
    console.log(startX, startY)
    console.log("target:")
    console.log(targetX, targetY)
    console.log("##############")
}

function renderCanvasBackground() {
    context.fillStyle = 'black'
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

function renderMapBackground(x, y) {
    context.drawImage(outsideImageBG, x, y)
}

function renderMapForeground(x, y) {
    context.drawImage(outsideImageFG, x, y)
}

function renderPlayer() {
    context.drawImage(characterSf, CENTER_WIDTH, CENTER_HEIGHT - SIZE/2)
}

export {render}