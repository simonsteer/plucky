import { XYCoords } from '../XYCoords'
import { EntityConfig } from './types'

export default class Entity<Metadata extends {} = {}> {
  footprint: EntityConfig<Metadata>['footprint']
  origin: EntityConfig<Metadata>['origin']
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
