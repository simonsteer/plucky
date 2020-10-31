import { DeploymentData } from '../Deployment'
import { TileData } from '../Grid'
import { Entity } from '../Scene'
import { ZoneData } from '../Zone'

export type GameEntity =
  | Entity<DeploymentData>
  | Entity<TileData>
  | Entity<ZoneData>
