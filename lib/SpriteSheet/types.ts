import { SpriteSheet } from '.'

export type SpriteSheetConfig = {
  src: string
  onload?: (self: SpriteSheet) => void
  numFrames?: number
}
