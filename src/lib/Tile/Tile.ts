import { game } from '../..'
import { JSONCoords, DeltaConstraint } from '../../../lib'
import { Deployment } from '../Deployment'
import { Grid } from '../Grid'
import GridEntity from '../GridEntity'
import { Terrain } from '../Terrain'

export default class Tile extends GridEntity {
  deployment?: Deployment

  constructor({
    grid,
    coordinates,
    terrain,
  }: {
    grid: Grid
    coordinates: JSONCoords
    terrain: Terrain
  }) {
    super(game, {
      grid,
      origin: coordinates,
      footprint: new DeltaConstraint([{ x: 0, y: 0 }]),
      metadata: { type: 'tile', terrain },
      spriteSheet: terrain.spriteSheet,
      spriteState: terrain.spriteState,
      renderLayer: 0,
    })
  }
}
