import { Game } from '../Game'
import { GameEntity } from '../Game/types'

export default class Loop {
  start: number | undefined
  game: Game
  private effects: (() => boolean)[] = []

  constructor(game: Game) {
    this.game = game
  }

  didStart = false

  do(callback: () => boolean) {
    this.effects.push(callback)
  }

  run = (timestamp = Date.now()) => {
    if (!this.didStart) this.didStart = true
    const scene = this.game.currentScene

    if (!scene) {
      this.start = undefined
      window.requestAnimationFrame(this.run)
      return
    }

    if (!this.start) {
      this.start = timestamp
    }

    const { tile, deployment, zone } = scene.map().reduce(
      (acc, entity: GameEntity) => {
        acc[entity.metadata.type].push(entity)
        return acc
      },
      {
        tile: [] as GameEntity[],
        deployment: [] as GameEntity[],
        zone: [] as GameEntity[],
      }
    )

    ;[tile, deployment, zone].forEach(layer => {
      const { cellSize } = this.game.viewportDimensions

      this.effects = this.effects.filter(effect => effect())
      layer.forEach((entity: GameEntity) => {
        if (!entity.spriteSheet) return

        const x = entity.origin.x * cellSize
        const y = entity.origin.y * cellSize

        entity.spriteSheet.render(
          this.game.context,
          x + entity.spriteXOffset,
          y + entity.spriteYOffset,
          entity.id,
          entity.spriteState
        )
        if (entity.spriteHighlight) {
          this.game.context.fillStyle = entity.spriteHighlight
          this.game.context.fillRect(x, y, cellSize, cellSize)
        }
      })
    })

    window.requestAnimationFrame(this.run)
  }
}
