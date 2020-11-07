import { Deployment } from '.'
import { Grid } from '../Grid'
import { JSONCoords, XYCoords } from '../../lib/XYCoords'

export function getAreaCostForDeployment(
  deployment: Deployment,
  area: JSONCoords[]
) {
  return area.reduce((sum, { x, y }) => {
    const tile = deployment.grid.tiles[x]?.[y]
    if (!tile || ![undefined, deployment.id].includes(tile.deployment?.id))
      return Infinity

    const terrain = tile.metadata.terrain
    const terrainCost =
      deployment.unit[terrain.costOverride] || terrain.baseCost
    return sum + terrainCost
  }, 0)
}

export const animateDeploymentMovement = (
  deployment: Deployment,
  path: JSONCoords[]
) => {
  const { cellSize } = deployment.grid
  const targets = path.map(coordinates => {
    let { x, y } = XYCoords.deltas(coordinates, deployment.gridCoordinates)
    x = x * cellSize
    y = y * cellSize
    return { x, y }
  })

  deployment.evacuateTiles()

  let i = 0
  deployment.grid.game.loop.do(() => {
    // if there is no sprite to animate, exit the loop
    if (!deployment.spriteSheet) return false

    const trueIndex = Math.floor(i)

    const target = targets[trueIndex]
    const xMatches = deployment.spriteXOffset === target.x
    const yMatches = deployment.spriteYOffset === target.y

    if (!xMatches) {
      const movingRight = target.x > deployment.spriteXOffset
      deployment.spriteXOffset += movingRight ? 1 : -1
    }
    if (!yMatches) {
      const movingDown = target.y > deployment.spriteYOffset
      deployment.spriteYOffset += movingDown ? 1 : -1
    }
    if (xMatches && yMatches) {
      i += 0.5
    }

    const continueLoop = i !== path.length
    if (!continueLoop) {
      deployment.spriteXOffset = 0
      deployment.spriteYOffset = 0
      deployment.spriteState = 'default'
      deployment.origin.x = path[path.length - 1].x * cellSize
      deployment.origin.y = path[path.length - 1].y * cellSize
      deployment.occupyTiles()
    }

    return continueLoop
  })
}
