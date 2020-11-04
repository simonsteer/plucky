import { Grid } from '../Grid'
import { Unit } from '../Unit'
import { JSONCoords } from '../XYCoords'

export function getAreaCostForUnit(grid: Grid, area: JSONCoords[], unit: Unit) {
  return area.reduce((sum, { x, y }) => {
    const tile = grid.tiles[x]?.[y]
    if (!tile) return Infinity

    const terrain = tile.metadata.terrain
    const terrainCost = unit[terrain.costOverride] || terrain.baseCost
    return sum + terrainCost
  }, 0)
}
