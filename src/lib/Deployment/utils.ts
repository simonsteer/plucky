import { Deployment } from '.'
import { Grid } from '../Grid'
import { JSONCoords, XYCoords } from '../../../lib/XYCoords'

export function getAreaCostForDeployment(
  deployment: Deployment,
  area: JSONCoords[]
) {
  return area.reduce((sum, { x, y }) => {
    const tile = deployment.grid.tiles[x]?.[y]
    if (!tile) return Infinity

    const terrain = tile.metadata.terrain
    const terrainCost =
      deployment.unit[terrain.costOverride] || terrain.baseCost
    return sum + terrainCost
  }, 0)
}
