import { JSONCoords } from '../XYCoords'
import { Entity } from '../Entity'

export default class Scene {
  entities: Entity[] = []

  width: number
  height: number
  constructor({ width, height }: { width: number; height: number }) {
    this.width = width
    this.height = height
  }

  add(entity: Entity) {
    this.entities.push(entity)
    this.entities.sort((a, b) => a.renderLayer - b.renderLayer)
    return this
  }

  remove(entity: Entity) {
    this.entities = this.entities.filter(e => e !== entity)
    return this
  }

  map = <R extends any = Entity>(callback = (entity: Entity) => entity as R) =>
    this.entities.map(callback)

  filter = (callback: (entity: Entity) => boolean) =>
    this.entities.filter(callback)

  find = <R extends boolean>(callback: (entity: Entity) => R) =>
    this.find(callback)
}
