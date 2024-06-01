import { CANVAS_WIDTH, CANVAS_HEIGHT, SIZE, CENTER_WIDTH, CENTER_HEIGHT, NORMALIZE_X, NORMALIZE_Y } from "../constants/graphicConstants.js";
import { outsideImageBG, outsideImageFG, characterSf } from "../loaders/resourceLoader.js";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

canvas.width = CANVAS_WIDTH //CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT // CANVAS_HEIGHT

function render(px, py, isFinalMovementFrame) { // player x,y
    context.imageSmoothingEnabled = false
    let [mapX, mapY] = calculateMapCoordinates(px, py)

    renderCanvasBackground(context) 
    renderMapBackground(context, mapX, mapY)
    renderPlayer(context)
    renderMapForeground(context, mapX, mapY)
}

function calculateMapCoordinates(px, py) {
    let mapX = -(px - NORMALIZE_X) * SIZE // TODO: improve performance
    let mapY = -(py - NORMALIZE_Y) * SIZE

    return [mapX, mapY]
}

function renderCanvasBackground(context) {
    context.fillStyle = 'black'
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

function renderMapBackground(context, x, y) {
    context.drawImage(outsideImageBG, x, y)
}

function renderMapForeground(context, x, y) {
    context.drawImage(outsideImageFG, x, y)
}

function renderPlayer(context) {
    context.drawImage(characterSf, CENTER_WIDTH, CENTER_HEIGHT - SIZE/2)
}

export {render}