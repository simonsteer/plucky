import { Game } from '../Game'
import { SpriteSheet } from '../SpriteSheet'
import { XYCoords } from '../XYCoords'
import { EntityConfig } from './types'

let id = 0
/*
SPRITE ROTATION

ctx.rotate(90 * Math.PI/180); // rotate by 90 degrees
ctx.drawImage(img,100,100); //draw it
ctx.fill();

*/
export default class Entity {
  id: number
  origin: XYCoords
  metadata: any
  game: Game

  renderLayer: number
  spriteSheet?: SpriteSheet
  spriteState: string
  spriteHighlight?: string
  spriteXOffset: number
  spriteYOffset: number
  spriteOpacity: number

  constructor(
    game: Game,
    {
      origin,
      spriteSheet,
      spriteHighlight,
      spriteState = 'default',
      spriteXOffset = 0,
      spriteYOffset = 0,
      spriteOpacity = 1,
      metadata,
      renderLayer = 0,
    }: EntityConfig
  ) {
    id++
    this.id = id
    this.game = game
    this.metadata = metadata
    this.origin = new XYCoords(origin)
    this.spriteSheet = spriteSheet
    this.spriteHighlight = spriteHighlight
    this.spriteState = spriteState
    this.spriteXOffset = spriteXOffset
    this.spriteYOffset = spriteYOffset
    this.renderLayer = renderLayer
    this.spriteOpacity = spriteOpacity
  }
}
