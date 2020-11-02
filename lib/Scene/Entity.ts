import { DeltaConstraint } from '../DeltaConstraint'
import { XYCoords } from '../XYCoords'
import { EntityConfig, EntityMetadata } from './types'

export default class Entity<Metadata extends EntityMetadata> {
  footprint: DeltaConstraint
  origin: XYCoords
  sprite?: EntityConfig<Metadata>['sprite'] & { frameIndex: number }
  metadata: EntityConfig<Metadata>['metadata']

  constructor({ footprint, origin, sprite, metadata }: EntityConfig<Metadata>) {
    this.metadata = metadata
    this.footprint = footprint
    this.origin = new XYCoords(origin)
    if (sprite) this.sprite = { ...sprite, frameIndex: 0 }
  }

  area() {
    return this.footprint.adjacent(this.origin)
  }
}
