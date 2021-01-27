import { SpriteSheet } from "."

export type SpriteSheetConfig<
  States extends { [stateName: string]: number[] }
> = {
  src: string
  onload?: () => void
  numFrames?: number
  states?: States
}
