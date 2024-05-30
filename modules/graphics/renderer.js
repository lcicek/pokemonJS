import { CANVAS_WIDTH, CANVAS_HEIGHT, SIZE, CENTER_WIDTH, CENTER_HEIGHT, NORMALIZE_X, NORMALIZE_Y } from "../constants/graphicConstants.js";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH //CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT // CANVAS_HEIGHT

function render(outside, px, py, image) { // player x,y
    renderBackground(context) 
    renderOutside(context, outside, px, py, image)
    renderPlayer(context)
}

function renderBackground(context) {
    context.fillStyle = 'black'
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

function renderOutside(context, outside, px, py, image) {
    // player (x, y) to canvas (x, y):
    let x = CENTER_WIDTH - px * SIZE
    let y = CENTER_HEIGHT - py * SIZE

    // normalize position to center
    let outsideX = -(px - NORMALIZE_X) * SIZE
    let outsideY = -(py - NORMALIZE_Y) * SIZE
    //context.fillStyle = 'green'
    //context.fillRect(x, y, world.width*SIZE, world.height*SIZE)
    context.drawImage(image, outsideX, outsideY)
}

function renderPlayer(context) {
    context.fillStyle = 'red'
    context.fillRect(CENTER_WIDTH, CENTER_HEIGHT, SIZE, SIZE)
}

export {render}