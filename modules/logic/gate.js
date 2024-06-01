// Interface between Player and Outside
export class Gate {
    static movePlayer(player, outside, deltas) {
        let targetX = player.x + deltas[0]
        let targetY = player.y + deltas[1]

        if (outside.collides(targetX, targetY)) {
            return
        }

        if (targetX < outside.width && targetY < outside.height && targetX >= 0 && targetY >= 0) {
            player.x = targetX
            player.y = targetY
        }
    }
}