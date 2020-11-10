import {
  DeltaConstraint,
  Entity,
  EntityConfig,
  Game,
  JSONCoords,
  memoize,
  XYCoords,
} from '../../lib'
import { getGridCoordinatesFromXY } from '../../lib/Game/utils'
import { Grid } from './Grid'

export default class GridEntity extends Entity {
  grid: Grid
  footprint: DeltaConstraint

  constructor(
    game: Game,
    {
      grid,
      footprint,
      origin: { x, y },
      ...params
    }: EntityConfig & { grid: Grid; footprint: DeltaConstraint }
  ) {
    super(game, {
      origin: { x: x * grid.cellSize, y: y * grid.cellSize },
      ...params,
    })
    this.grid = grid
    this.footprint = footprint
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
    (fromCoords = this.origin) =>
      this.footprint.adjacent(
        getGridCoordinatesFromXY(fromCoords.x, fromCoords.y, this.grid.cellSize)
      ),
    (fromCoords = this.origin) =>
      [XYCoords.hash(fromCoords), this.footprint.timestamp].join()
  )
}
