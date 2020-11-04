import { JSONCoords } from '../XYCoords'
import Entity from './Entity'
import { EntityMetadata } from './types'

export default class Scene<Metadata extends EntityMetadata = EntityMetadata> {
  entities = new Set<Entity<Metadata>>()

  width: number
  height: number
  constructor({ width, height }: { width: number; height: number }) {
    this.width = width
    this.height = height
  }

  map = <R extends any = Entity<EntityMetadata>>(
    callback = (entity: Entity<EntityMetadata>) => entity as R
  ) => [...this.entities].map(callback)

  filter = <R extends boolean>(
    callback = (entity: Entity<EntityMetadata>) => true as R
  ) => [...this.entities].filter(callback)

  find = <R extends boolean>(callback: (entity: Entity<EntityMetadata>) => R) =>
    this.find(callback)

  entitiesOccupying = (coordinate: JSONCoords) =>
    this.filter(e => e.footprint.applies(e.origin, coordinate))
}
