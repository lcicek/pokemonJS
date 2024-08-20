import { HEIGHT, WIDTH } from "./graphicConstants.js"

export const FPS = 60
export const timePerFrame = 1 / FPS // in s
export const timePerFrameMS = timePerFrame * 1000 // in ms


// ideally, disivible by SIZE (i.e. 32/64/...)
export const framesPerMovement = 16
export const framesPerNavigation = 16
export const framesPerClosingField = 16
export const framesPerGrassAnimation = 16 * framesPerMovement // 192
export const framesPerFightMark = 32

export const ticksPerMovementKeyframe = framesPerMovement / 2
export const ticksPerGrassKeyframe = framesPerGrassAnimation / 4
export const ticksPerFightMarkKeyframe = framesPerFightMark / 1 // TODO: update once sprites are ready

// TODO: formalize when to use iterations and when to use ticks
export const iterationsPerEncounterTransition = Math.floor((WIDTH * HEIGHT) / 2) + 1
export const iterationsPerDoorTransition = 80
export const iterationsPerBlackScreen = 40