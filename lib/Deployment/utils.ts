import { Deployment } from '.'
import { Grid } from '../Grid'
import { Unit } from '../Unit'
import { JSONCoords, XYCoords } from '../XYCoords'

export function getAreaCostForUnit(grid: Grid, area: JSONCoords[], unit: Unit) {
  return area.reduce((sum, { x, y }) => {
    const tile = grid.tiles[x]?.[y]
    if (!tile) return Infinity

    const terrain = tile.metadata.terrain
    const terrainCost = unit[terrain.costOverride] || terrain.baseCost
    return sum + terrainCost
  }, 0)
}

export const animateDeploymentMovement = (
  deployment: Deployment,
  path: JSONCoords[]
) => {
  const { cellSize } = deployment.grid.game.viewportDimensions
  const targets = path.map(coordinates => {
    let { x, y } = XYCoords.deltas(coordinates, deployment.origin)
    x = x * cellSize
    y = y * cellSize
    return { x, y }
  })

  let i = 0

  deployment.game.loop.do(() => {
    // if there is no sprite to animate, exit the loop
    if (!deployment.spriteSheet) return false

    const trueIndex = Math.floor(i)

    const target = targets[trueIndex]
    const xMatches = deployment.spriteXOffset === target.x
    const yMatches = deployment.spriteYOffset === target.y

    if (!xMatches) {
      const movingRight = target.x > deployment.spriteXOffset
      deployment.spriteXOffset += movingRight ? 0.5 : -0.5
    }
    if (!yMatches) {
      const movingDown = target.y > deployment.spriteYOffset
      deployment.spriteYOffset += movingDown ? 0.5 : -0.5
    }
    if (xMatches && yMatches) {
      i += 0.5
    }

    const continueLoop = i !== path.length
    if (!continueLoop) {
      deployment.spriteXOffset = 0
      deployment.spriteYOffset = 0
      deployment.spriteState = 'default'
      deployment.origin.x = path[path.length - 1].x
      deployment.origin.y = path[path.length - 1].y
    }

    return continueLoop
  })
}
