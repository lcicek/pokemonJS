export const FPS = 30
export const timePerFrame = 1 / FPS // in s
export const timePerFrameMS = timePerFrame * 1000 // in ms


// ideally, disivible by SIZE (i.e. 32/64/...)
export const framesPerMovement = 32
export const framesPerNavigation = 32
export const framesPerClosingField = 32
export const framesPerGrassAnimation = 4 * framesPerMovement // 192
export const framesPerFightMark = 64

export const ticksPerMovementKeyframe = framesPerMovement / 2
export const ticksPerGrassKeyframe = framesPerGrassAnimation / 4
export const ticksPerFightMarkKeyframe = framesPerFightMark / 1 // TODO: update once sprites are ready