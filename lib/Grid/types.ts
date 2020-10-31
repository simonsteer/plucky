import { Terrain } from '../Terrain'

export type TileData = {
  type: 'tile'
  terrain: Terrain
}

export type GridConfig = {
  tiles: { terrain: Terrain }[][]
}
