import { DeltaConstraint } from '../DeltaConstraint'
import { SpriteSheet } from '../SpriteSheet'
import { JSONCoords } from '../XYCoords'

export interface EntityMetadata {
  type: string
}

export type EntitySprite = {
  sheet: SpriteSheet
  state?: string
  highlight?: string
  xOffset: number
  yOffset: number
}

export type EntityConfig<Metadata extends EntityMetadata> = {
  footprint: DeltaConstraint
  origin: JSONCoords
  spriteSheet?: SpriteSheet
  spriteState?: string
  spriteHighlight?: string
  spriteXOffset?: number
  spriteYOffset?: number
  metadata: Metadata
}
