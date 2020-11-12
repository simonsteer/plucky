import { Entity } from '../Entity'
import { Game } from '../Game'
import { v4 as uuid } from 'uuid'

export default class Scene {
  id = uuid()
  entities: Entity[] = []
  game: Game

  width: number
  height: number
  constructor(
    game: Game,
    { width, height }: { width: number; height: number }
  ) {
    this.game = game
    this.width = width
    this.height = height
  }

  load() {
    this.game.loadScene(this)
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
    this.entities.find(callback)
}
