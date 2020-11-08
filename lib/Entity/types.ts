import { SpriteSheet } from '../SpriteSheet'
import { JSONCoords } from '../XYCoords'

export type EntitySprite = {
  sheet: SpriteSheet
  state?: string
  highlight?: string
  xOffset: number
  yOffset: number
}

export type EntityConfig = {
  origin: JSONCoords
  spriteSheet?: SpriteSheet
  spriteState?: string
  spriteHighlight?: string
  spriteXOffset?: number
  spriteYOffset?: number
  spriteOpacity?: number
  metadata: any
  renderLayer?: number
}
