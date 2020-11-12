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
        this.render(delta)
      }
    }
    this.id = requestAnimationFrame(animateLoop)
  }

  private tweenIndex = 0
  private activeTweens: { [id: string]: number } = {}
  tween(
    {
      inputs,
      outputs,
      duration = 300,
      easing = n => n,
      id,
    }: {
      inputs: number[]
      outputs: number[]
      duration?: number
      easing?: (n: number) => number
      id: string
    },
    onValuesChanged: (values: number[], progress: number) => void | boolean
  ) {
    const deltas = inputs.map((input, index) => {
      const output = outputs[index]
      return output - input
    })

    this.tweenIndex++
    const tweenId = this.tweenIndex
    this.activeTweens[id] = tweenId

    const startTime = performance.now()
    return new Promise<void>(resolve =>
      this.do(() => {
        // the tween was interrupted by a new tween with the same id
        if (this.activeTweens[id] !== tweenId) {
          resolve()
          return false
        }

        const progress = Math.min(1, (performance.now() - startTime) / duration)
        const result = onValuesChanged(
          deltas.map(
            (delta, index) => inputs[index] + easing(progress) * delta
          ),
          progress
        )

        if (typeof result === 'boolean') {
          if (result === false) resolve()
          return result
        }

        if (progress === 1) {
          // animation is done, we no longer have to keep track
          // of the id of the active tween
          delete this.activeTweens[id]
          resolve()
          return false
        }

        return true
      })
    )
  }

  private render = (timestamp: number) => {
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
    scene.map(entity => entity.render())
  }
}
