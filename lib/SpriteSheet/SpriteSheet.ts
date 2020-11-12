import { Game } from '../Game'
import { SpriteSheetConfig } from './types'

export default class SpriteSheet {
  image: HTMLImageElement
  numFrames: number
  frameWidth: number
  frameHeight: number
  loaded: boolean
  src: string
  states: SpriteSheetConfig['states']
  onloadHandlers: (() => void)[] = []

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
  private currentState: undefined | string
  render = ({
    game,
    x,
    y,
    instanceId,
    state = 'default',
  }: {
    game: Game
    x: number
    y: number
    instanceId: string
    state?: string
  }) => {
    if (!this.loaded) return
    if (!this.currentState) this.currentState = state
    if (state !== this.currentState) this.frameIndices[instanceId] = 0

    const frames = this.states[state]
    const spriteXOffset =
      frames[this.frameIndices[instanceId]] * this.frameWidth

    if (this.frameIndices[instanceId] < frames.length - 1) {
      this.frameIndices[instanceId]++
    } else {
      this.frameIndices[instanceId] = 0
    }

    game.context.drawImage(
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
