import { SpriteSheetConfig } from './types'

export default class SpriteSheet {
  image: HTMLImageElement
  numFrames: number
  width: number
  height: number
  loaded: boolean
  src: string
  states: SpriteSheetConfig['states']

  constructor({
    src,
    numFrames = 1,
    onload = () => {},
    states,
  }: SpriteSheetConfig) {
    this.states = states
    this.image = new Image()
    this.numFrames = numFrames
    this.src = src
    this.image.onload = () => {
      this.height = this.image.naturalHeight
      this.width = this.image.naturalWidth / this.numFrames
      this.loaded = true
      onload()
    }
    this.image.src = this.src
  }

  private frameIndex = 0
  private currentState: undefined | string
  render = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    state = 'default'
  ) => {
    if (!this.loaded) return
    if (!this.currentState) this.currentState = state
    if (state !== this.currentState) this.frameIndex = 0

    const frames = this.states[state]
    const spriteXOffset = frames[this.frameIndex] * this.width

    if (frames.length > 1) {
      if (this.frameIndex < frames.length - 1) {
        this.frameIndex++
      } else {
        this.frameIndex = 0
      }
    }

    context.drawImage(
      this.image,
      spriteXOffset,
      0,
      this.width,
      this.height,
      x,
      y,
      this.width,
      this.height
    )
  }
}
