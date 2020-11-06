import { DeltaConstraint } from '../DeltaConstraint'
import { SpriteSheet } from '../SpriteSheet'
import { XYCoords } from '../XYCoords'
import { EntityConfig, EntityMetadata, EntitySprite } from './types'

let id = 0

export default class Entity<Metadata extends EntityMetadata = EntityMetadata> {
  id: number
  footprint: DeltaConstraint
  origin: XYCoords
  metadata: Metadata

  spriteSheet?: SpriteSheet
  spriteState: string
  spriteHighlight?: string
  spriteXOffset: number
  spriteYOffset: number

  constructor({
    footprint,
    origin,
    spriteSheet,
    spriteHighlight,
    spriteState = 'default',
    spriteXOffset = 0,
    spriteYOffset = 0,
    metadata,
  }: EntityConfig<Metadata>) {
    id++
    this.id = id
    this.metadata = metadata
    this.footprint = footprint
    this.origin = new XYCoords(origin)
    this.spriteSheet = spriteSheet
    this.spriteHighlight = spriteHighlight
    this.spriteState = spriteState
    this.spriteXOffset = spriteXOffset
    this.spriteYOffset = spriteYOffset
  }

  area() {
    return this.footprint.adjacent(this.origin)
  }
}
