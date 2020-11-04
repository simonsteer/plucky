import { DeltaConstraint } from '../DeltaConstraint'
import { SpriteSheet } from '../SpriteSheet'
import { XYCoords } from '../XYCoords'
import { EntityConfig, EntityMetadata, EntitySprite } from './types'

export default class Entity<Metadata extends EntityMetadata = EntityMetadata> {
  footprint: DeltaConstraint
  origin: XYCoords
  sprite?: EntitySprite
  metadata: Metadata

  constructor({ footprint, origin, sprite, metadata }: EntityConfig<Metadata>) {
    this.metadata = metadata
    this.footprint = footprint
    this.origin = new XYCoords(origin)
    if (sprite) this.sprite = { ...sprite, xOffset: 0, yOffset: 0 }
  }

  updateSprite(value: Partial<EntitySprite>) {
    if (!this.sprite && !('sheet' in value)) return

    this.sprite = {
      ...(this.sprite || {}),
      ...value,
    } as EntitySprite

    return this
  }

  area() {
    return this.footprint.adjacent(this.origin)
  }
}
