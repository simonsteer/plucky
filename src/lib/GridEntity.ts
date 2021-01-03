import {
  DeltaConstraint,
  Entity,
  EntityConfig,
  Game,
  JSONCoords,
  memoize,
  SpriteSheet,
  XYCoords,
} from '../../lib'
import { getGridCoordinatesFromXY } from '../../lib/Game/utils'
import { Grid } from './Grid'

interface GridConfig extends EntityConfig {
  grid: Grid
  footprint: DeltaConstraint
  origin: JSONCoords
  spriteSheet?: SpriteSheet
  spriteState?: string
  spriteHighlight?: string
  spriteXOffset?: number
  spriteYOffset?: number
  spriteOpacity?: number
}

export default class GridEntity extends Entity {
  grid: Grid
  footprint: DeltaConstraint
  spriteSheet?: SpriteSheet
  spriteState: string
  spriteHighlight?: string
  spriteXOffset: number
  spriteYOffset: number
  spriteOpacity: number
  spriteRotate?: number

  constructor(
    game: Game,
    {
      grid,
      footprint,
      origin: { x, y },
      metadata,
      renderLayer,
      spriteSheet,
      spriteHighlight,
      spriteState = 'default',
      spriteXOffset = 0,
      spriteYOffset = 0,
      spriteOpacity = 1,
    }: GridConfig
  ) {
    super(game, {
      metadata: { ...metadata, origin: new XYCoords({x: x * grid.cellSize, y: y * grid.cellSize}) },
      renderLayer,
    })
    this.grid = grid
    this.footprint = footprint
    this.spriteSheet = spriteSheet
    this.spriteHighlight = spriteHighlight
    this.spriteState = spriteState
    this.spriteXOffset = spriteXOffset
    this.spriteYOffset = spriteYOffset
    this.spriteOpacity = spriteOpacity
  }

  get gridCoordinates() {
    return getGridCoordinatesFromXY(
      this.metadata.origin.x,
      this.metadata.origin.y,
      this.grid.cellSize
    )
  }

  updateGridCoordinates({ x, y }: JSONCoords) {
    this.metadata.origin.x = x * this.grid.cellSize
    this.metadata.origin.y = y * this.grid.cellSize

    return this
  }

  area = memoize(
    (fromCoords = this.metadata.origin as JSONCoords) =>
      this.footprint.adjacent(
        getGridCoordinatesFromXY(
          (fromCoords).x,
          (fromCoords).y,
          this.grid.cellSize
        )
      ),
    (fromCoords = this.metadata.origin) =>
      [XYCoords.hash(fromCoords), this.footprint.timestamp].join()
  )

  render() {
    if (!this.spriteSheet) return

    const x = this.metadata.origin.x
    const y = this.metadata.origin.y

    this.spriteSheet.render({
      game: this.game,
      x: x + this.spriteXOffset,
      y: y + this.spriteYOffset,
      instanceId: this.id,
      state: this.spriteState,
      rotate: this.spriteRotate,
    })

    if (this.spriteHighlight) {
      this.game.context.fillStyle = this.spriteHighlight
      this.game.context.fillRect(
        x,
        y,
        this.spriteSheet.frameWidth,
        this.spriteSheet.frameHeight
      )
    }
  }
}
