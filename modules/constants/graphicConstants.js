export const SIZE = 32

export const WIDTH = 15 // X
export const HEIGHT = 11 // Y

export const CANVAS_WIDTH = WIDTH * SIZE
export const CANVAS_HEIGHT = HEIGHT * SIZE

export const NORMALIZE_X = Math.floor(WIDTH / 2)
export const NORMALIZE_Y = Math.floor(HEIGHT / 2)

export const CENTER_WIDTH = NORMALIZE_X * SIZE 
export const CENTER_HEIGHT = NORMALIZE_Y * SIZE

const DIALOGUE_HEIGHT = 3
const DIALOGUE_WIDTH = 14
const X_PADDING = 0.5
const Y_PADDING = 0.5
export const DIALOGUE_X = X_PADDING * SIZE
export const DIALOGUE_Y = (HEIGHT - DIALOGUE_HEIGHT - Y_PADDING) * SIZE

export const DIALOGUE_ARROW_X = (X_PADDING + DIALOGUE_WIDTH - 2*X_PADDING) * SIZE
export const DIALOGUE_ARROW_Y =  (HEIGHT - 3*Y_PADDING) * SIZE