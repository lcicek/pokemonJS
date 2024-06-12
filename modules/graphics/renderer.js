import { CANVAS_WIDTH, CANVAS_HEIGHT, SIZE, CENTER_WIDTH, CENTER_HEIGHT, DIALOGUE_X, DIALOGUE_Y, DIALOGUE_ARROW_X, DIALOGUE_ARROW_Y, DIALOGUE_LINE_1_X, DIALOGUE_LINE_1_Y, DIALOGUE_LINE_2_X, DIALOGUE_LINE_2_Y } from "../constants/graphicConstants.js";
import { outsideImageBG, outsideImageFG, dialogueBoxImage, downArrowImage, grassImageFG } from "../loaders/image-loaders/backgroundImages.js";

export class Renderer {

    Renderer() {

    }

    initialize() {
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");

        this.context.imageSmoothingEnabled = false
        this.canvas.width = CANVAS_WIDTH
        this.canvas.height = CANVAS_HEIGHT

        this.setFont()
    }

    setShift(shifts) {
        this.shiftX = shifts[0]
        this.shiftY = shifts[1]
    }

    setFont() { // TODO: fix error that initial font used is wrong
        this.context.font = "16px dialogue"
    }

    gameObjects(gameObjectData) {
        for (let data of gameObjectData) {
            let img = data[0]
            let x = data[1][0]
            let y = data[1][1]

            this.context.drawImage(img, x * SIZE - this.shiftX, y * SIZE - this.shiftY)
        }
    }

    regularMovement(playerVisual, playerKeyframe, bushShouldBeRendered) {
        this.backgrounds(playerVisual.x, playerVisual.y)
        this.player(playerKeyframe)
        this.bush(playerVisual, bushShouldBeRendered)
        this.mapForeground(playerVisual.x, playerVisual.y)
    }


    dialogue(textBlock, isLastBlock) {
        this.setFont()
        this.dialogueBox(textBlock)

        if (!isLastBlock) this.dialogueArrow()
    }

    grassAnimation(keyframes, relativeCoordinates) { // TODO: needs to occur before final foreground rendering
        if (keyframes.length == 0) return

        for (let i = 0; i < relativeCoordinates.length; i++) {
            let coordinates = relativeCoordinates[i]
            let keyframe = keyframes[i]

            this.context.drawImage(
                keyframe,
                CENTER_WIDTH + coordinates[0]*SIZE - this.shiftX,
                CENTER_HEIGHT - SIZE + coordinates[1]*SIZE - this.shiftY)
        }
    }

    bush() {
        this.context.drawImage(grassImageFG, CENTER_WIDTH - this.shiftX, CENTER_HEIGHT - this.shiftY)
    }

    backgrounds(playerVisualX, playerVisualY) {
        this.canvasBackground()
        this.mapBackground(playerVisualX, playerVisualY)
    }

    canvasBackground() {
        this.context.fillStyle = 'black'
        this.context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }

    mapBackground(x, y) {
        this.context.drawImage(outsideImageBG, x, y)
    }

    mapForeground(x, y) {
        this.context.drawImage(outsideImageFG, x, y)
    }

    player(playerKeyFrame) {
        this.context.drawImage(playerKeyFrame, CENTER_WIDTH, CENTER_HEIGHT - SIZE/2)
    }

    dialogueBox(textBlock) {
        this.context.drawImage(dialogueBoxImage, DIALOGUE_X, DIALOGUE_Y)
        this.context.fillText(textBlock[0], DIALOGUE_LINE_1_X, DIALOGUE_LINE_1_Y);
        if (textBlock.length > 1) this.context.fillText(textBlock[1], DIALOGUE_LINE_2_X, DIALOGUE_LINE_2_Y);
    }

    dialogueArrow() {
        this.context.drawImage(downArrowImage, DIALOGUE_ARROW_X, DIALOGUE_ARROW_Y)
    }
}