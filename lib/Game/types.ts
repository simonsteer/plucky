import { DeploymentMetadata } from '../Deployment'
import { TileMetadata } from '../Tile'
import { Entity } from '../Scene'
import { ZoneMetadata } from '../Zone'

export type GameEntity =
  | Entity<DeploymentMetadata>
  | Entity<TileMetadata>
  | Entity<ZoneMetadata>
