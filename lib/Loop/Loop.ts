import { Game } from '../Game'

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

    this.effects = this.effects.filter(effect => effect())
    scene.map(entity => {
      if (!entity.spriteSheet) return

      const x = entity.origin.x
      const y = entity.origin.y

      entity.spriteSheet.render(
        this.game.context,
        x + entity.spriteXOffset,
        y + entity.spriteYOffset,
        entity.id,
        entity.spriteState
      )
      if (entity.spriteHighlight) {
        this.game.context.fillStyle = entity.spriteHighlight
        this.game.context.fillRect(
          x,
          y,
          entity.spriteSheet.frameWidth,
          entity.spriteSheet.frameHeight
        )
      }
    })

    window.requestAnimationFrame(this.run)
  }
}
