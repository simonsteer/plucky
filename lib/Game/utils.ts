import { Point } from "../Point"

export const getGridCoordinatesFromXY = (
  x: number,
  y: number,
  cellSize: number
) => new Point({ x: Math.floor(x / cellSize), y: Math.floor(y / cellSize) })
