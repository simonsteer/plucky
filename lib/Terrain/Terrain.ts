import { Game } from '../Game'
import { SpriteSheet } from '../SpriteSheet'

export default class Terrain {
  game: Game

  fillStyle: string
  baseCost: number
  spriteState: string
  spriteSheet: SpriteSheet

  readonly costOverride = Symbol()

  constructor({
    baseCost = 1,
    spriteState = 'default',
    spriteSheet,
  }: {
    baseCost?: number
    spriteState?: string
    spriteSheet: SpriteSheet
  }) {
    this.baseCost = baseCost
    this.spriteState = spriteState
    this.spriteSheet = spriteSheet
  }
}
