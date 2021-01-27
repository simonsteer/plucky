import { Entity } from "../Entity"
import { Game } from "../Game"

const LOOP_INTERVAL = 1000 / 60
const INTERVAL_TOLERANCE = 0.1

export default class Loop {
  game: Game
  private effects: (() => boolean)[] = []

  constructor(game: Game) {
    this.game = game
  }

  didStart = false

  id: number
  start() {
    let then = performance.now()

    const animateLoop = (now: number) => {
      this.id = requestAnimationFrame(animateLoop)
      const delta = now - then

      if (delta >= LOOP_INTERVAL - INTERVAL_TOLERANCE) {
        then = now - (delta % LOOP_INTERVAL)
        this.render(delta)
      }
    }

    this.didStart = true
    this.id = requestAnimationFrame(animateLoop)
  }

  private render = (timestamp: number) => {
    if (!this.didStart) this.didStart = true
    const scene = this.game.currentScene

    if (!scene) return

    const entities: Entity[] = []
    scene.entities.forEach(entity =>
      entities.splice(entity.renderLayer, 0, entity)
    )

    entities.map(entity => entity.update())
    this.effects = this.effects.filter(effect => effect())
    entities.map(entity => entity.render())
  }

  /**
   *
   * @param callback
   * Pass in a callback to perform side effects as the loop runs, (ex: animating a sprite's movement).
   * This callback should return a boolean, which indicates whether to keep being called or to stop its
   * execution the next time the loop runs (see `Loop.tween` for implementation example).
   */
  doWhile(callback: (timeElapsed: number) => boolean) {
    return new Promise<number>(resolve => {
      let startTime: number
      const callbackWithTimeElapsed = () => {
        if (startTime === undefined) {
          startTime = performance.now()
        }
        const timeElapsed = performance.now() - startTime
        const result = callback(timeElapsed)
        if (result === false) resolve(timeElapsed)
        return result
      }
      this.effects.push(callbackWithTimeElapsed)
    })
  }

  doFor(duration: number, callback: (timePassed: number) => void) {
    return this.doWhile(timeElapsed => {
      callback(timeElapsed)
      if (timeElapsed >= duration) return false
      return true
    })
  }

  doForWhile(
    duration: number,
    callback: (timePassed: number) => void | boolean
  ) {
    return this.doWhile(timeElapsed => {
      const result = callback(timeElapsed)
      if (timeElapsed >= duration || result === false) return false
      return true
    })
  }

  private tweenIndex = 0
  private activeTweens: { [id: string]: number } = {}
  async tween(
    {
      inputs,
      outputs,
      duration = 300,
      easing = n => n,
      id
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

    const tweenValues = (elapsed: number) => {
      // the tween was interrupted by a new tween with the same id
      if (this.activeTweens[id] !== tweenId) {
        return false
      }

      const progress = Math.min(1, elapsed / duration)
      const nextValues = deltas.map(
        (delta, index) => inputs[index] + easing(progress) * delta
      )
      const valueChangeResult = onValuesChanged(nextValues, progress)

      if (typeof valueChangeResult === "boolean") {
        // if onValuesChanged returned false, we are bailing out of the tween,
        // and exiting loop, so we delete the id from the activeTweens object to
        // prevent it from growing indefinitely
        if (!valueChangeResult) delete this.activeTweens[id]
        return valueChangeResult
      }

      // animation is complete
      if (progress === 1) {
        // no longer have to keep track of the given tween id, we delete the id
        // from the activeTweens object to prevent it from growing indefinitely
        delete this.activeTweens[id]
        return false
      }

      return true
    }

    await this.doForWhile(duration, tweenValues)
  }
}
