import { TileMetadata } from './types'
import { Entity } from '../Scene'
import { JSONCoords } from '../XYCoords'
import { DeltaConstraint } from '../DeltaConstraint'
import { Terrain } from '../Terrain'

export default class Tile extends Entity<TileMetadata> {
  constructor({
    coordinates,
    terrain,
  }: {
    coordinates: JSONCoords
    terrain: Terrain
  }) {
    super({
      origin: coordinates,
      footprint: new DeltaConstraint([{ x: 0, y: 0 }]),
      metadata: { type: 'tile', terrain },
      spriteSheet: terrain.spriteSheet,
      spriteState: terrain.spriteState,
    })
  }
}
