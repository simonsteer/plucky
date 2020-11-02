import { DeltaConstraint } from '../DeltaConstraint'
import { Game } from '../Game'
import { Grid } from '../Grid'
import { Entity } from '../Scene'
import { JSONCoords } from '../XYCoords'
import { ZoneMetadata } from './types'

export default class Zone extends Entity<ZoneMetadata> {
  game: Game

  constructor(
    grid: Grid,
    origin: JSONCoords,
    footprint = new DeltaConstraint([{ x: 0, y: 0 }])
  ) {
    super({
      origin,
      footprint,
      metadata: { grid, type: 'zone' },
    })
  }

  get grid() {
    return this.metadata.grid
  }

  withinBounds = (coords: JSONCoords) =>
    this.footprint.applies(this.origin, coords)

  outOfBounds = (coords: JSONCoords) => !this.withinBounds(coords)

  area = () =>
    this.footprint.adjacent(this.origin).filter(this.grid.withinBounds)
}
