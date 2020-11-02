import { Game } from '../Game'
import { EntityConfig } from '../Scene/types'

export default class Terrain {
  game: Game

  fillStyle: string
  baseCost: number
  sprite: EntityConfig['sprite']

  readonly costOverride = Symbol()

  constructor({
    baseCost = 1,
    sprite,
  }: {
    baseCost?: number
    sprite: EntityConfig['sprite']
  }) {
    this.baseCost = baseCost
    this.sprite = sprite
  }
}
