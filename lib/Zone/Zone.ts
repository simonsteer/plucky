import { DeltaConstraint } from '../DeltaConstraint'
import { Game } from '../Game'
import { Grid } from '../Grid'
import { Entity } from '../Scene'
import { JSONCoords } from '../XYCoords'
import { ZoneData } from './types'

export default class Zone extends Entity<ZoneData> {
  game: Game

  constructor(
    grid: Grid,
    origin: JSONCoords,
    footprint = new DeltaConstraint([{ x: 0, y: 0 }])
  ) {
    super({
      origin,
      footprint,
      fillStyle: 'rgba(255,100,100,0.2)',
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

  move = (delta: JSONCoords) => {
    this.origin.y += delta.y
    this.origin.x += delta.x

    return this
  }
}
