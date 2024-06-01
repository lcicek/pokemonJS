import { CANVAS_WIDTH, CANVAS_HEIGHT, SIZE, CENTER_WIDTH, CENTER_HEIGHT, NORMALIZE_X, NORMALIZE_Y } from "../constants/graphicConstants.js";
import { outsideImage, characterSf } from "../loaders/resourceLoader.js";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

canvas.width = CANVAS_WIDTH //CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT // CANVAS_HEIGHT

function render(px, py) { // player x,y
    context.imageSmoothingEnabled = false
    renderBackground(context) 
    renderOutside(context, px, py)
    renderPlayer(context)
}

function renderBackground(context) {
    context.fillStyle = 'black'
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

function renderOutside(context, px, py) {
    // normalize position to center
    let outsideX = -(px - NORMALIZE_X) * SIZE
    let outsideY = -(py - NORMALIZE_Y) * SIZE
    context.drawImage(outsideImage, outsideX, outsideY)
}

function renderPlayer(context) {
    context.drawImage(characterSf, CENTER_WIDTH, CENTER_HEIGHT - SIZE/2)
}

export {render}