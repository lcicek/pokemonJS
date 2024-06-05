import { CANVAS_WIDTH, CANVAS_HEIGHT, SIZE, CENTER_WIDTH, CENTER_HEIGHT, NORMALIZE_X, NORMALIZE_Y, DIALOGUE_X, DIALOGUE_Y, DIALOGUE_ARROW_X, DIALOGUE_ARROW_Y, DIALOGUE_LINE_1_X, DIALOGUE_LINE_1_Y, DIALOGUE_LINE_2_X, DIALOGUE_LINE_2_Y } from "../constants/graphicConstants.js";
import { outsideImageBG, outsideImageFG, dialogueBoxImage, downArrowImage } from "../loaders/image-loaders/backgroundImages.js";
import { timePerFrameMS, framesPerMovement } from "../constants/timeConstants.js";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
context.imageSmoothingEnabled = false

canvas.width = CANVAS_WIDTH //CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT // CANVAS_HEIGHT

var startX = undefined
var startY = undefined
var x = undefined
var y = undefined
var targetX = undefined
var targetY = undefined

export function setFont() { // TODO: fix error that initial font used is wrong
    context.font = "16px dialogue"
}

export function renderPreviousBackground(playerKeyFrame) {
    if (x == undefined || y == undefined) return

    renderCanvasBackground() 
    renderMapBackground(x, y)
    renderPlayer(playerKeyFrame)
    renderMapForeground(x, y)
}

export function renderDialogue(textBlock, isLastBlock) {
    setFont()
    renderDialogueBox(textBlock)

    if (!isLastBlock) renderDialogueArrow()
}

export function renderMovement(player, movementBegins, movementEnds, isThirdTick, playerKeyFrame) {
    if (movementBegins) prepareMovementRender(player)

    let shiftDistancePerFrame = isThirdTick ? 2 : 1
    let horizontalMovement = (targetX - startX) != 0
    let direction = (startX < targetX) || (startY < targetY) ? 1 : -1
    let reachedTarget = 
        (horizontalMovement && direction > 0 && x + shiftDistancePerFrame >= targetX) ||
        (horizontalMovement && direction < 0 && x - shiftDistancePerFrame <= targetX) ||
        (!horizontalMovement && direction > 0 && y + shiftDistancePerFrame >= targetY) ||
        (!horizontalMovement && direction < 0 && y - shiftDistancePerFrame <= targetY)

    if (movementEnds || reachedTarget) {
        if (!movementEnds && !reachedTarget) console.log("movementEnds != reachedTarget")
        x = targetX
        y = targetY
    } else {
        if (horizontalMovement && direction > 0) x += shiftDistancePerFrame
        else if (horizontalMovement && direction < 0) x -= shiftDistancePerFrame
        else if (!horizontalMovement && direction > 0) y += shiftDistancePerFrame
        else if (!horizontalMovement && direction < 0) y -= shiftDistancePerFrame   
    }

    renderCanvasBackground() 
    renderMapBackground(x, y)
    renderPlayer(playerKeyFrame)
    renderMapForeground(x, y)
}

function prepareMovementRender(player) {
    // TODO: check for possible performance improvement
    startX = -(player.prevX - NORMALIZE_X) * SIZE
    startY = -(player.prevY - NORMALIZE_Y) * SIZE

    x = startX
    y = startY

    targetX = -(player.x - NORMALIZE_X) * SIZE
    targetY = -(player.y - NORMALIZE_Y) * SIZE
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

function renderPlayer(playerKeyFrame) {
    context.drawImage(playerKeyFrame, CENTER_WIDTH, CENTER_HEIGHT - SIZE/2)
}

function renderDialogueBox(textBlock) {
    context.drawImage(dialogueBoxImage, DIALOGUE_X, DIALOGUE_Y)
    context.fillText(textBlock[0], DIALOGUE_LINE_1_X, DIALOGUE_LINE_1_Y);
    if (textBlock.length > 1) context.fillText(textBlock[1], DIALOGUE_LINE_2_X, DIALOGUE_LINE_2_Y);
}

function renderDialogueArrow() {
    context.drawImage(downArrowImage, DIALOGUE_ARROW_X, DIALOGUE_ARROW_Y)
}