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
      metadata,
      renderLayer,
      origin: { x: x * grid.cellSize, y: y * grid.cellSize },
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
      this.origin.x,
      this.origin.y,
      this.grid.cellSize
    )
  }

  updateGridCoordinates({ x, y }: JSONCoords) {
    this.origin.x = x * this.grid.cellSize
    this.origin.y = y * this.grid.cellSize

    return this
  }

  area = memoize(
    (fromCoords?: JSONCoords) =>
      this.footprint.adjacent(
        getGridCoordinatesFromXY(
          (fromCoords || this.origin).x,
          (fromCoords || this.origin).y,
          this.grid.cellSize
        )
      ),
    (fromCoords = this.origin.raw) =>
      [XYCoords.hash(fromCoords), this.footprint.timestamp].join()
  )

  render() {
    if (!this.spriteSheet) return

    const x = this.origin.x
    const y = this.origin.y

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
