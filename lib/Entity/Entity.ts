import { SpriteSheet } from '../SpriteSheet'
import { XYCoords } from '../XYCoords'
import { EntityConfig } from './types'

let id = 0

export default class Entity {
  id: number
  origin: XYCoords
  metadata: any

  renderLayer: number
  spriteSheet?: SpriteSheet
  spriteState: string
  spriteHighlight?: string
  spriteXOffset: number
  spriteYOffset: number

  constructor({
    origin,
    spriteSheet,
    spriteHighlight,
    spriteState = 'default',
    spriteXOffset = 0,
    spriteYOffset = 0,
    metadata,
    renderLayer = 0,
  }: EntityConfig) {
    id++
    this.id = id
    this.metadata = metadata
    this.origin = new XYCoords(origin)
    this.spriteSheet = spriteSheet
    this.spriteHighlight = spriteHighlight
    this.spriteState = spriteState
    this.spriteXOffset = spriteXOffset
    this.spriteYOffset = spriteYOffset
    this.renderLayer = renderLayer
  }
}
