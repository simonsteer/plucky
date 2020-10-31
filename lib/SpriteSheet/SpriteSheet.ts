import { SpriteSheetConfig } from './types'

export default class SpriteSheet {
  image: HTMLImageElement
  numFrames: number
  width: number
  height: number
  loaded: boolean

  constructor({ src, numFrames = 1, onload = () => {} }: SpriteSheetConfig) {
    this.image = new Image()
    this.numFrames = numFrames
    this.image.onload = () => {
      this.height = this.image.naturalHeight
      this.width = this.image.naturalWidth / this.numFrames
      this.loaded = true
      onload(this)
    }
    this.image.src = src
  }

  private prevHash: string | undefined
  private frameOffset = 0

  render = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame = 0
  ) => {
    if (!this.loaded) return

    const spriteXOffset = frame * this.width

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
