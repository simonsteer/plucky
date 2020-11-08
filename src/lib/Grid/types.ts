import { Game } from '../../../lib'
import { Terrain } from '../Terrain'

export type GridConfig = {
  game: Game
  tiles: Terrain[][]
  cellSize: number
}
