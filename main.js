import { renderGrassAnimation, renderDialogue, renderPreviousBackground, setFont, renderBackgrounds, renderPlayer, renderBush, renderMapForeground, renderRegularMovement } from "./modules/graphics/renderer.js";
import { addInputDetection, getActiveKey, keyIsInvalid } from "./modules/inputDetection.js";
import { enforceFps } from "./modules/time/timeHandler.js";
import { Player } from "./modules/logic/main-game/player.js";
import { MovementHandler } from "./modules/logic/main-game/movementHandler.js";
import { MenuNavigator } from "./modules/logic/menus/navigator.js";
import { StateManager } from "./modules/logic/state/stateManager.js";
import { Outside } from "./modules/logic/main-game/space.js";
import { encounterOccurs } from "./modules/logic/main-game/pokemonEncounter.js";
import { State } from "./modules/logic/state/state.js";
import { Action } from "./modules/constants/action.js";
import { Direction } from "./modules/logic/main-game/direction.js";
import { interactables } from "./modules/constants/interactables.js";
import { framesPerClosingField, framesPerMovement, framesPerNavigation } from "./modules/constants/timeConstants.js";
import { Lock } from "./modules/time/lock.js"
import { Dialogue } from "./modules/logic/dialogue/dialogue.js";
import { GrassAnimation, PlayerAnimation } from "./modules/graphics/animation.js";
import { PlayerVisual } from "./modules/graphics/playerVisual.js";
import { BushManager } from "./modules/logic/main-game/bushManager.js";

let outside = new Outside()
let player = new Player(8, 8)
let playerAnimation = new PlayerAnimation()
let playerVisual = new PlayerVisual(player);
let stateManager = new StateManager()
let menuNavigator;
let dialogue = new Dialogue()
let bushManager = new BushManager()
let grassAnimation = new GrassAnimation()

let lock = new Lock()

async function gameLoop(timestamp) {
    tryUpdateIntermediateState()

    let acted = act(timestamp) // will perform locking mechanisms

    handleGameRendering()
    handleDialogueRendering(acted)

    await enforceFps(timestamp) // needs to be last function in loop (other than recursive call)
    window.requestAnimationFrame(gameLoop)
};

// rendering player/bush/leaves is quite intertwined, hence needs to be handled together
function handleGameRendering() {
    if (!stateManager.isInGameState()) return
    if (lock.isUnlocked() && bushManager.isIdle()) return

    // Prepare movement part //
    if (lock.isLocked()) prepareMovementRendering() // i.e. movement is occuring and needs to be rendered

    // Prepare grass animation part //
    bushManager.tryUpdate()
    bushManager.tryRemove()

    // Render everything //
    // case: there are no past grass animations occuring
    let playerKeyFrame = lock.isLocked() ? playerAnimation.getKeyframe(lock.getTick()) : playerAnimation.lastKeyframe
    let bushShouldBeRendered = outside.isBush(player.x, player.y)
    if (bushManager.isIdle()) {
        renderRegularMovement(playerVisual, playerKeyFrame, bushShouldBeRendered)

        return
    }

    // case: there is no new movement but still old grass animations to be rendered
    let grassKeyframes = grassAnimation.getKeyframes(bushManager.getTicks())
    let relativeGrassCoordinates = bushManager.getRelativeCoordinates(player.x, player.y)
    let grassShifts = playerVisual.getRemainingShifts()

    if (lock.isUnlocked()) {
        renderPreviousBackground(playerAnimation.lastKeyframe, playerVisual, bushShouldBeRendered) // clear old grass frames by drawing previous map background over them
        renderGrassAnimation(grassKeyframes, relativeGrassCoordinates, grassShifts)
        renderMapForeground(playerVisual.x, playerVisual.y)

        return
    }

    // case: player is moving and there are old (/new) grass animations
    bushShouldBeRendered = bushShouldBeRendered && (!Direction.north(player.direction) || lock.isLastTick()) // adjust bush rendering to movement

    renderBackgrounds(playerVisual.x, playerVisual.y)
    if (Direction.isVertical(player.direction)) renderGrassAnimation(grassKeyframes, relativeGrassCoordinates, grassShifts) // vary grass fg/bg rendering based on type of movement
    renderPlayer(playerKeyFrame)
    renderBush(playerVisual, bushShouldBeRendered)
    if (Direction.isHorizontal(player.direction)) renderGrassAnimation(grassKeyframes, relativeGrassCoordinates, grassShifts)
    renderMapForeground(playerVisual.x, playerVisual.y)
}

function tryUpdateIntermediateState() {
    if (lock.isLocked()) return

    if (stateManager.isAwaitingEncounter()) {
        stateManager.setState(State.Encounter)
        return
    }

    if (stateManager.isInClosingFieldState()) {
        stateManager.setState(State.Game)
    }
}

function act(timestamp) {
    if (lock.isLocked()) {
        lock.tick(timestamp)
        return false
    }

    let activeKey = getActiveKey()
    if (keyIsInvalid(activeKey)) return false

    let navigated = tryMenu(activeKey, timestamp)
    let interacted = tryInteraction(activeKey, timestamp)
    let moved = tryMovement(activeKey, timestamp) // TODO: consider changing tryMovement to work even with activeKey = null
    
    if (moved) {
        tryPokemonEncounter()
        tryBush()
    }

    let acted = navigated || interacted || moved
    return acted
}

function tryBush() {    
    if (!player.collided() && outside.isBush(player.x, player.y)) {
        bushManager.add(player.x, player.y)
    }
}

function tryInteraction(activeKey, timestamp) {
    if (stateManager.isInGameState() && activeKey == Action.A) { // case: start
        let deltas = Direction.toDeltas(player.direction)
        let targetX = player.x + deltas[0]
        let targetY = player.y + deltas[1]
        let coordinate = "" + targetX + targetY // TODO: consider changing approach

        if (!interactables.has(coordinate)) return false

        let target = interactables.get(coordinate)
        
        dialogue.setText(target.text)

        stateManager.setState(State.Interaction)
        lock.lock(framesPerNavigation, timestamp)
        return true
    } 
    
    if (stateManager.isInInteractionState() && (activeKey == Action.A || activeKey == Action.B)) { // case: continues
        if (dialogue.isLastBlock()) {
            stateManager.setState(State.ClosingField)
            lock.lock(framesPerClosingField, timestamp)
        } else {
            dialogue.nextBlock()
            lock.lock(framesPerNavigation, timestamp)
        }

        return true
    }

    return false
}

function handleBushRendering(acted) {
    if (!stateManager.isInGameState() || bushManager.isIdle()) return // TODO: probably reset bushes once you return from other state

    bushManager.update()
    let removed = bushManager.tryRemove()

    if (!acted && lock.isUnlocked()) renderPreviousBackground(playerAnimation.lastKeyframe, playerVisual, outside.isBush(player.x, player.y))
    if (!removed) renderGrassAnimation(grassAnimation.getKeyframes(bushManager.getTicks()), bushManager.getRelativeCoordinates(player.x, player.y), playerVisual.getRemainingShifts(), Direction.isVertical(player.direction), playerAnimation.lastKeyframe)
    
    console.log(JSON.stringify(bushManager.getRelativeCoordinates(player.x, player.y)))
}

function handleDialogueRendering(acted) {
    if (stateManager.isInClosingFieldState()) {
        renderPreviousBackground(playerAnimation.lastKeyframe, playerVisual, outside.isBush(player.x, player.y))
        renderMapForeground(playerVisual.x, playerVisual.y)

        return
    }

    if (!stateManager.isInInteractionState()) return
    if (stateManager.isInInteractionState && !acted) return

    renderDialogue(dialogue.getCurrentBlock(), dialogue.isLastBlock())
}

function prepareMovementRendering() {
    let movementBegins = lock.isFirstTick()
    let movementEnds = lock.isLastTick()

    if (movementBegins) playerVisual.setPosition(player)
    
    if (!movementEnds && !player.collided()) playerVisual.shiftVisual(player.direction)
    else if (movementEnds) playerVisual.ensurePositionIsNext()
}

function tryMenu(activeKey, timestamp) {
    if (lock.isLocked()) return false
    if (!stateManager.isInGameState() && !stateManager.isInMenuState()) return false // only states where menu can be interacted with

    // case: menu is closed
    if (menuNavigator.isClosed()) {
        let wasOpened = menuNavigator.tryOpen(activeKey)
        if (wasOpened) stateManager.setState(State.Menu)
        
        return wasOpened
    }

    // case: menu is open
    let navigated = menuNavigator.update(activeKey) // case: user initiated navigation in menu

    if (menuNavigator.isClosed()) { // case: user closed menu
        stateManager.setState(State.ClosingField)
        lock.lock(framesPerClosingField, timestamp)
        return true
    } 

    if (navigated) lock.lock(framesPerNavigation, timestamp)

    return navigated
}

function tryPokemonEncounter() {
    let playerIsInBush = outside.isBush(player.x, player.y)
    if (!playerIsInBush || player.collided()) return

    if (encounterOccurs()) { // TODO: also determine which pokemon is encountered
        stateManager.setState(State.AwaitingEncounter)
    }
}

function tryMovement(activeKey, timestamp) {
    if (lock.isLocked()) return false
    if (!stateManager.isInGameState()) return false

    let moved = MovementHandler.tryMovement(player, outside, activeKey) // will update player location and direction
    if (moved) {
        playerAnimation.setKeyframeCycle(player.direction)
        playerAnimation.toggleStep()
        lock.lock(framesPerMovement, timestamp)
    }

    return moved
}

window.onload = function() {
    addInputDetection()
    setFont()
    renderRegularMovement(playerVisual, playerAnimation.lastKeyframe) // initial render

    menuNavigator = new MenuNavigator()
    window.requestAnimationFrame(gameLoop)
}