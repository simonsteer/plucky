import { Game } from "../Game"
import { SpriteSheetConfig } from "./types"

export default class SpriteSheet<
  States extends { [stateName: string]: number[] } = {}
> {
  image: HTMLImageElement
  numFrames: number
  frameWidth: number
  frameHeight: number
  loaded: boolean
  src: string
  states: States & { default: number[] }
  onloadHandlers: (() => void)[] = []

  constructor({
    src,
    numFrames = 1,
    onload = () => {},
    states = {} as States
  }: SpriteSheetConfig<States>) {
    this.states = { default: [0], ...states }
    this.image = new Image()
    this.numFrames = numFrames
    this.src = src
    this.onload(onload)
    this.image.onload = () => {
      this.frameHeight = this.image.naturalHeight
      this.frameWidth = this.image.naturalWidth / this.numFrames
      this.loaded = true
      this.onloadHandlers.forEach(handler => handler())
    }
    this.image.src = this.src
  }

  onload = (callback: () => void) => this.onloadHandlers.push(callback)

  private frameIndices: { [id: string]: number } = {}
  private currentState: undefined | keyof States
  render = ({
    game,
    x,
    y,
    instanceId,
    state = "default",
    rotate
  }: {
    game: Game
    x: number
    y: number
    instanceId: string
    state?: keyof States
    rotate?: number
  }) => {
    if (!this.loaded) return
    if (state !== this.currentState) {
      this.currentState = state
      this.frameIndices[instanceId] = 0
    }

    const frames = this.states[state]
    const spriteXOffset =
      frames[this.frameIndices[instanceId]] * this.frameWidth

    if (this.frameIndices[instanceId] < frames.length - 1) {
      this.frameIndices[instanceId]++
    } else {
      this.frameIndices[instanceId] = 0
    }

    game.context.setTransform(
      game.context
        .getTransform()
        .translate(x + this.frameWidth / 2, y + this.frameHeight / 2)
        .rotate(0, 0, rotate ?? 0)
        .translate(-this.frameWidth / 2, -this.frameHeight / 2)
    )

    game.context.drawImage(
      this.image,
      spriteXOffset,
      0,
      this.frameWidth,
      this.frameHeight,
      0,
      0,
      this.frameWidth,
      this.frameHeight
    )

    game.context.resetTransform()
  }

  static stretchFrames = (frames: number[], factor: number) => {
    const stretchedFrames: number[] = []
    frames.forEach(frame => {
      for (let i = 0; i < factor; i++) {
        stretchedFrames.push(frame)
      }
    })
    return stretchedFrames
  }
}
