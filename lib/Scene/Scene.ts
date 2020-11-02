import { JSONCoords } from '../XYCoords'
import Entity from './Entity'
import { EntityMetadata } from './types'

export default class Scene<Metadata extends EntityMetadata> {
  entities = new Set<Entity<Metadata>>()

  width: number
  height: number
  constructor({ width, height }: { width: number; height: number }) {
    this.width = width
    this.height = height
  }

  mapEntities = <R extends any = Entity<EntityMetadata>>(
    callback = (entity: Entity<EntityMetadata>) => entity as R
  ) => [...this.entities].map(callback)

  filterEntities = <R extends boolean>(
    callback = (entity: Entity<EntityMetadata>) => true as R
  ) => [...this.entities].filter(callback)

  entitiesWithOrigin = (origin: JSONCoords) =>
    this.filterEntities(e => e.origin.match(origin))

  entitiesOccupying = (coordinate: JSONCoords) =>
    this.filterEntities(e => e.footprint.applies(e.origin, coordinate))
}
