import { Grid } from '../Grid'
import { Unit } from '../Unit'
import { JSONCoords } from '../XYCoords'

export function getAreaCostForUnit(grid: Grid, area: JSONCoords[], unit: Unit) {
  return grid
    .tiles()
    .filter(tile => area.some(coordinates => tile.origin.match(coordinates)))
    .reduce((sum, tile) => {
      const terrain = tile.metadata.terrain
      const terrainCost = unit[terrain.costOverride] || terrain.baseCost
      return sum + terrainCost
    }, 0)
}
