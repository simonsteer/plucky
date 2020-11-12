import { Game } from '../Game'

const LOOP_INTERVAL = 1000 / 60
const INTERVAL_TOLERANCE = 0.1

export default class Loop {
  previous: number | undefined
  game: Game
  private effects: (() => boolean)[] = []

  constructor(game: Game) {
    this.game = game
  }

  didStart = false

  do(callback: () => boolean) {
    this.effects.push(callback)
  }

  id: number
  run() {
    let then = performance.now()

    const animateLoop = (now: number) => {
      this.id = requestAnimationFrame(animateLoop)
      const delta = now - then

      if (delta >= LOOP_INTERVAL - INTERVAL_TOLERANCE) {
        then = now - (delta % LOOP_INTERVAL)
        this.animate(delta)
      }
    }
    this.id = requestAnimationFrame(animateLoop)
  }

  tween(
    {
      inputs,
      outputs,
      duration = 300,
      easing = n => n,
    }: {
      inputs: number[]
      outputs: number[]
      duration?: number
      easing?: (n: number) => number
    },
    onValuesChanged: (values: number[], progress: number) => void | boolean
  ) {
    const deltas = inputs.map((input, index) => {
      const output = outputs[index]
      return output - input
    })

    const startTime = performance.now()
    return new Promise<void>(resolve =>
      this.do(() => {
        const progress = Math.min(1, (performance.now() - startTime) / duration)
        const result = onValuesChanged(
          deltas.map(
            (delta, index) => inputs[index] + easing(progress) * delta
          ),
          progress
        )
        if (typeof result === 'boolean') {
          if (!result) resolve()
          return result
        }
        if (progress === 1) {
          resolve()
          return false
        }
        return true
      })
    )
  }

  private animate = (timestamp: number) => {
    if (!this.didStart) this.didStart = true
    const scene = this.game.currentScene

    if (!scene) {
      this.previous = undefined
      return
    }

    if (this.previous === undefined) {
      this.previous = timestamp
    }

    this.effects = this.effects.filter(effect => effect())
    scene.map(entity => {
      if (!entity.spriteSheet) return

      const x = entity.origin.x
      const y = entity.origin.y

      this.game.context.globalAlpha = entity.spriteOpacity
      entity.spriteSheet.render(
        this.game.context,
        x + entity.spriteXOffset,
        y + entity.spriteYOffset,
        entity.id,
        entity.spriteState
      )
      this.game.context.globalAlpha = 1

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
  }
}
