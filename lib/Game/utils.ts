import { XYCoords } from '../XYCoords'

export const getGridCoordinatesFromXY = (
  x: number,
  y: number,
  cellSize: number
) => new XYCoords({ x: Math.floor(x / cellSize), y: Math.floor(y / cellSize) })
