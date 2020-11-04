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
        if (!entity.sprite) return

        const x = entity.origin.x * cellSize
        const y = entity.origin.y * cellSize

        const {
          sheet,
          state,
          highlight,
          xOffset = 0,
          yOffset = 0,
        } = entity.sprite

        sheet.render(this.game.context, x + xOffset, y + yOffset, state)
        if (highlight) {
          this.game.context.fillStyle = highlight
          this.game.context.fillRect(x, y, cellSize, cellSize)
        }
      })
    })

    window.requestAnimationFrame(this.run)
  }
}
