import { SpriteSheetConfig } from './types'

export default class SpriteSheet {
  image: HTMLImageElement
  numFrames: number
  frameWidth: number
  frameHeight: number
  loaded: boolean
  src: string
  states: SpriteSheetConfig['states']
  onload?: () => void

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
    this.onload = onload
    this.image.onload = () => {
      this.frameHeight = this.image.naturalHeight
      this.frameWidth = this.image.naturalWidth / this.numFrames
      this.loaded = true
    }
    this.image.src = this.src
  }

  private frameIndices: { [id: number]: number } = {}
  private currentState: undefined | string
  render = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    entityId: number,
    state = 'default'
  ) => {
    if (!this.loaded) return
    if (!this.currentState) this.currentState = state
    if (state !== this.currentState) this.frameIndices[entityId] = 0

    const frames = this.states[state]
    const spriteXOffset = frames[this.frameIndices[entityId]] * this.frameWidth

    if (this.frameIndices[entityId] < frames.length - 1) {
      this.frameIndices[entityId]++
    } else {
      this.frameIndices[entityId] = 0
    }

    context.drawImage(
      this.image,
      spriteXOffset,
      0,
      this.frameWidth,
      this.frameHeight,
      x,
      y,
      this.frameWidth,
      this.frameHeight
    )
  }
}
