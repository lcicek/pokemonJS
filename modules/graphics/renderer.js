import { CANVAS_WIDTH, CANVAS_HEIGHT, SIZE, CENTER_WIDTH, CENTER_HEIGHT, DIALOGUE_X, DIALOGUE_Y, DIALOGUE_ARROW_X, DIALOGUE_ARROW_Y, DIALOGUE_LINE_1_X, DIALOGUE_LINE_1_Y, DIALOGUE_LINE_2_X, DIALOGUE_LINE_2_Y } from "../constants/graphicConstants.js";
import { outsideImageBG, outsideImageFG, dialogueBoxImage, downArrowImage, grassImageFG } from "../loaders/image-loaders/backgroundImages.js";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
context.imageSmoothingEnabled = false

canvas.width = CANVAS_WIDTH //CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT // CANVAS_HEIGHT

export function setFont() { // TODO: fix error that initial font used is wrong
    context.font = "16px dialogue"
}

export function renderPreviousBackground(playerKeyFrame, playerVisual) {
    renderCanvasBackground() 
    renderMapBackground(playerVisual.x, playerVisual.y)
    renderPlayer(playerKeyFrame)
    renderBush(playerVisual.deltas[0], playerVisual.deltas[1])
    renderMapForeground(playerVisual.x, playerVisual.y)
}

export function renderDialogue(textBlock, isLastBlock) {
    setFont()
    renderDialogueBox(textBlock)

    if (!isLastBlock) renderDialogueArrow()
}

export function renderBushLeaves(relativeCoordinates, remainingShifts) { // TODO: needs to occur before final foreground rendering
    context.fillStyle = 'red'
    let remainingShiftsX = remainingShifts[0]
    let remainingShiftsY = remainingShifts[1]

    for (let coordinates of relativeCoordinates) {
        //context.fillRect(CENTER_WIDTH - remainingShiftsX, CENTER_HEIGHT - remainingShiftsY, 32, 32)
        context.fillRect(
            CENTER_WIDTH + coordinates[0]*SIZE - remainingShiftsX,
            CENTER_HEIGHT + coordinates[1]*SIZE - remainingShiftsY,
            32, 32
        )
    }
}

export function renderMovement(playerKeyFrame, playerVisual, playerIsInBush) {
    renderCanvasBackground() 
    renderMapBackground(playerVisual.x, playerVisual.y)
    renderPlayer(playerKeyFrame)
    renderBush(playerIsInBush, playerVisual)
    renderMapForeground(playerVisual.x, playerVisual.y)
}

function renderBush(playerIsInBush, playerVisual) {
    if (!playerIsInBush) return

    let remainingShifts = playerVisual.getRemainingShifts()
    let remainingShiftsX = remainingShifts[0]
    let remainingShiftsY = remainingShifts[1]

    context.fillStyle = 'red'
    context.drawImage(grassImageFG, CENTER_WIDTH - remainingShiftsX, CENTER_HEIGHT - remainingShiftsY)
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