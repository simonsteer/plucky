import { SpriteSheet } from '.'

export type SpriteSheetConfig = {
  src: string
  onload?: () => void
  numFrames?: number
  states: {
    default: number[]
    [key: string]: number[]
  }
}
