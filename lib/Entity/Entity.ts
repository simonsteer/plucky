import { v4 as uuid } from 'uuid'
import { Game } from '../Game'
import { EntityConfig } from './types'

export default class Entity {
  id = uuid()
  metadata: any
  game: Game
  renderLayer: number

  constructor(
    game: Game,
    { metadata = {}, renderLayer = 0, render, update } = {} as EntityConfig
  ) {
    this.game = game
    this.metadata = metadata
    this.renderLayer = renderLayer
    if (render) this.render = render
    if (update) this.update = update
  }

  render() { }
  update() { }
}
