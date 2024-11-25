export const SIZE = 32

export const WIDTH = 17 // X
export const HEIGHT = 13 // Y

export const CANVAS_WIDTH = WIDTH * SIZE
export const CANVAS_HEIGHT = HEIGHT * SIZE

export const NORMALIZE_X = Math.floor(WIDTH / 2)
export const NORMALIZE_Y = Math.floor(HEIGHT / 2)

export const CENTER_WIDTH = NORMALIZE_X * SIZE 
export const CENTER_HEIGHT = NORMALIZE_Y * SIZE

const DIALOGUE_HEIGHT = 3
const DIALOGUE_WIDTH = 16
const X_PADDING = 0.5
const Y_PADDING = 0.5
export const DIALOGUE_X = X_PADDING * SIZE
export const DIALOGUE_Y = (HEIGHT - DIALOGUE_HEIGHT - Y_PADDING) * SIZE

export const DIALOGUE_ARROW_X = (X_PADDING + DIALOGUE_WIDTH - 2*X_PADDING) * SIZE
export const DIALOGUE_ARROW_Y =  (HEIGHT - 3*Y_PADDING) * SIZE

export const DIALOGUE_LINE_1_X = DIALOGUE_X + 2*X_PADDING*SIZE
export const DIALOGUE_LINE_1_Y = DIALOGUE_Y + 2.5*Y_PADDING*SIZE

export const DIALOGUE_LINE_2_X = DIALOGUE_X + 2*X_PADDING*SIZE
export const DIALOGUE_LINE_2_Y = DIALOGUE_Y + 4.5*Y_PADDING*SIZE