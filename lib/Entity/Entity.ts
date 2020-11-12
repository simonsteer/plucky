import { v4 as uuid } from 'uuid'
import { Game } from '../Game'
import { XYCoords } from '../XYCoords'
import { EntityConfig } from './types'

export default class Entity {
  id = uuid()
  metadata: any
  game: Game
  renderLayer: number
  origin: XYCoords

  constructor(
    game: Game,
    { metadata = {}, renderLayer = 0, origin }: EntityConfig
  ) {
    this.game = game
    this.metadata = metadata
    this.renderLayer = renderLayer
    this.origin = new XYCoords(origin)
  }

  render() {}
}
