// Interface between Player and World
export class Gate {
    static movePlayer(player, world, deltas) {
        let targetX = player.x + deltas[0]
        let targetY = player.y + deltas[1]

        if (targetX < world.width && targetY < world.height && targetX >= 0 && targetY >= 0) {
            player.x = targetX
            player.y = targetY
        }
    }
}