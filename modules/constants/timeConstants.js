const FPS = 60
const timePerFrame = 1 / FPS // in s
const timePerFrameMS = timePerFrame * 1000 // in ms


// ideally, disivible by SIZE (i.e. 32/64/...)
const framesPerMovement = 16
const framesPerNavigation = 32

export { FPS, timePerFrame, framesPerMovement, framesPerNavigation, timePerFrameMS }