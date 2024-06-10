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

export function renderPreviousBackground(playerKeyFrame, playerVisual, playerIsInBush) {
    renderBackgrounds(playerVisual.x, playerVisual.y)
    renderPlayer(playerKeyFrame)
    renderBush(playerVisual, playerIsInBush)
}

export function renderRegularMovement(playerVisual, playerKeyframe, bushShouldBeRendered) {
    renderBackgrounds(playerVisual.x, playerVisual.y)
    renderPlayer(playerKeyframe)
    renderBush(playerVisual, bushShouldBeRendered)
    renderMapForeground(playerVisual.x, playerVisual.y)
}


export function renderDialogue(textBlock, isLastBlock) {
    setFont()
    renderDialogueBox(textBlock)

    if (!isLastBlock) renderDialogueArrow()
}

export function renderGrassAnimation(keyframes, relativeCoordinates, remainingShifts) { // TODO: needs to occur before final foreground rendering
    if (keyframes.length == 0) return
    
    let remainingShiftsX = remainingShifts[0]
    let remainingShiftsY = remainingShifts[1]

    for (let i = 0; i < relativeCoordinates.length; i++) {
        let coordinates = relativeCoordinates[i]
        let keyframe = keyframes[i]

        context.drawImage(
            keyframe,
            CENTER_WIDTH + coordinates[0]*SIZE - remainingShiftsX,
            CENTER_HEIGHT - SIZE + coordinates[1]*SIZE - remainingShiftsY)
    }
}

export function renderBush(playerVisual, bushShouldBeRendered) {
    if (!bushShouldBeRendered) return

    let remainingShifts = playerVisual.getRemainingShifts()
    let remainingShiftsX = remainingShifts[0]
    let remainingShiftsY = remainingShifts[1]

    context.drawImage(grassImageFG, CENTER_WIDTH - remainingShiftsX, CENTER_HEIGHT - remainingShiftsY)
}

export function renderBackgrounds(playerVisualX, playerVisualY) {
    renderCanvasBackground()
    renderMapBackground(playerVisualX, playerVisualY)
}

function renderCanvasBackground() {
    context.fillStyle = 'black'
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

function renderMapBackground(x, y) {
    context.drawImage(outsideImageBG, x, y)
}

export function renderMapForeground(x, y) {
    context.drawImage(outsideImageFG, x, y)
}

export function renderPlayer(playerKeyFrame) {
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