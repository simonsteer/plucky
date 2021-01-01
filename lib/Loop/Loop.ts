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

  /**
   *
   * @param callback
   * Pass in a callback to perform side effects as the loop runs, (ex: animating a sprite's movement).
   * This callback should return a boolean, which indicates whether to keep being called or to stop its
   * execution the next time the loop runs (see `Loop.tween` for implementation example).
   */
  do(callback: () => boolean) {
    this.effects.push(callback)
  }

  stop() {}

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

    // Increment the tweens that have occurred and map the advanced
    // index to the provided id using our activeTweens object. We use
    // this mapping to keep track of tweens via their ids
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

        const nextValues = deltas.map(
          (delta, index) => inputs[index] + easing(progress) * delta
        )
        const valueChangeResult = onValuesChanged(nextValues, progress)

        if (typeof valueChangeResult === 'boolean') {
          // if onValuesChanged returned false, we are bailing out of the tween,
          // and exiting loop, so we can resolve our promise and delete the id
          // from the activeTweens object to prevent it from growing indefinitely
          if (!valueChangeResult) {
            delete this.activeTweens[id]
            resolve()
          }
          return valueChangeResult
        }

        // animation is complete
        if (progress === 1) {
          // no longer have to keep track of the given tween id, we delete the id
          // from the activeTweens object to prevent it from growing indefinitely
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
