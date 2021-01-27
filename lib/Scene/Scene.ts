import { Entity } from "../Entity"
import { Game } from "../Game"
import { v4 as uuid } from "uuid"
import { JSONCoords } from "../Point"

export default class Scene {
  id = uuid()
  entities: Entity[] = []
  game: Game
  cameraOrigin: JSONCoords
  width: number
  height: number

  constructor(game: Game, { width, height } = game.viewportDimensions) {
    this.game = game
    this.width = width
    this.height = height
  }

  load() {
    this.game.loadScene(this)
  }

  add(...entities: Entity[]) {
    this.entities.push(...entities)
    return this
  }

  remove(...entities: Entity[]) {
    const ids = entities.reduce((acc, entity) => {
      acc[entity.id] = true
      return acc
    }, {} as { [key: string]: true })

    this.entities = this.entities.filter(e => !(e.id in ids))
    return this
  }

  map = <R extends any = Entity>(
    callback = (entity: Entity, index: number) => entity as R
  ) => this.entities.map(callback)

  filter = (callback: (entity: Entity, index: number) => boolean) =>
    this.entities.filter(callback)

  forEach = (callback: (entity: Entity, index: number) => void) =>
    this.entities.forEach(callback)

  find = (callback: (entity: Entity, index: number) => boolean) =>
    this.entities.find(callback)
}
