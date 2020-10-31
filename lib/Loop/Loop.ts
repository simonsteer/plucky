import { Game } from '../Game'
import { GameEntity } from '../Game/types'

const FPS = 60

export default class Loop {
  start: number | undefined
  game: Game

  constructor(game: Game) {
    this.game = game
  }

  didStart = false

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

    const { tile, deployment, zone } = scene.mapEntities().reduce(
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

      layer.forEach((entity: GameEntity) => {
        if (!entity.sprite) return

        const x = entity.origin.x * cellSize
        const y = entity.origin.y * cellSize

        const { sheet, frames } = entity.sprite
        const frameToRender = frames[entity.sprite.frameIndex]

        sheet.render(this.game.context, x, y, frameToRender)
        if (frames.length) {
          if (entity.sprite.frameIndex === frames.length - 1) {
            entity.sprite.frameIndex = 0
          } else {
            entity.sprite.frameIndex++
          }
        }
      })
    })

    window.requestAnimationFrame(this.run)
  }
}
