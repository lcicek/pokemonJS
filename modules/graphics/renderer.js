import { CANVAS_WIDTH, CANVAS_HEIGHT, SIZE, CENTER_WIDTH, CENTER_HEIGHT } from "../constants/graphicConstants.js";
import { image } from "../loaders/resourceLoader.js";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH //CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT // CANVAS_HEIGHT

function render(world, px, py) { // player x,y
    renderBackground(context) 
    renderWorld(context, world, px, py)
    renderPlayer(context)
}

function renderBackground(context) {
    context.fillStyle = 'black'
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

function renderWorld(context, world, px, py) {
    // player (x, y) to canvas (x, y):
    let x = CENTER_WIDTH - px * SIZE
    let y = CENTER_HEIGHT - py * SIZE

    // normalize position to center

    context.fillStyle = 'green'
    context.fillRect(x, y, world.width*SIZE, world.height*SIZE)
}

function renderPlayer(context) {
    context.fillStyle = 'red'
    context.fillRect(CENTER_WIDTH, CENTER_HEIGHT, SIZE, SIZE)
}

export {render}