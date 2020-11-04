import { Pathfinder, PathfinderObject } from '../Pathfinder'
import { Unit } from '../Unit'
import { Grid } from '../Grid'
import { XYCoords, JSONCoords } from '../XYCoords'
import { getAreaCostForUnit } from './utils'
import { Entity } from '../Scene'
import { DeploymentMetadata } from './types'

export default class Deployment extends Entity<DeploymentMetadata> {
  private pathfinder: Pathfinder

  constructor(grid: Grid, unit: Unit, x: number, y: number, state = 'default') {
    super({
      origin: { x, y },
      footprint: unit.movement.footprint,
      metadata: { type: 'deployment', grid, unit },
      sprite: { sheet: unit.sprite, state },
    })
    this.pathfinder = new Pathfinder(this.createDijkstraGraph())
  }

  get unit() {
    return this.metadata.unit
  }
  get grid() {
    return this.metadata.grid
  }
  get game() {
    return this.grid.game
  }

  private get movementPool() {
    return this.unit.movement.steps * this.unit.movement.footprint.length
  }

  move = (path: JSONCoords[]) => {
    if (!path.length) return this

    const { cellSize } = this.grid.game.viewportDimensions
    const targets = path.map(coordinates => {
      let { x, y } = XYCoords.deltas(coordinates, this.origin)
      x = x * cellSize
      y = y * cellSize

      return { x, y }
    })

    let i = 0
    this.game.loop.do(() => {
      // if there is no sprite to animate, exit the loop
      if (!this.sprite) return false

      const { xOffset, yOffset } = this.sprite
      const target = targets[i]
      const xMatches = xOffset === target.x
      const yMatches = yOffset === target.y

      if (!xMatches) this.sprite.xOffset += target.x > xOffset ? 1 : -1
      if (!yMatches) this.sprite.yOffset += target.y > yOffset ? 1 : -1
      if (xMatches && yMatches) i++

      const continueLoop = i !== path.length
      if (!continueLoop) {
        this.origin.x = path[path.length - 1].x
        this.origin.y = path[path.length - 1].y
        this.sprite.xOffset = 0
        this.sprite.yOffset = 0
      }

      return continueLoop
    })

    return this
  }

  getPath = (to: JSONCoords, from = this.origin) =>
    this.pathfinder.find(from, to)

  getReachableCoordinates = (
    from = this.origin.raw,
    stepsLeft = this.movementPool
  ) =>
    this.unit.movement.pattern.adjacent(from).reduce((acc, target) => {
      const area = this.unit.movement.footprint.adjacent(target)
      const areaCost = getAreaCostForUnit(this.grid, area, this.unit)
      if (areaCost > stepsLeft) {
        return acc
      }

      acc.push(target.raw)
      if (stepsLeft - areaCost > 0) {
        acc.push(
          ...this.getReachableCoordinates(target.raw, stepsLeft - areaCost)
        )
      }

      return acc
    }, [] as JSONCoords[])

  private createDijkstraGraph() {
    const { pattern, footprint } = this.unit.movement

    const graph: PathfinderObject = {}

    this.grid.mapTiles(({ metadata: { terrain }, origin }) => {
      const fromArea = footprint.adjacent(origin)
      if (fromArea.some(this.grid.outOfBounds)) {
        return
      }

      const fromHash = XYCoords.hash(origin)

      let reachable = pattern.adjacent(origin)
      reachable = reachable.reduce((acc, destination) => {
        const destinationArea = footprint.adjacent(destination)
        if (destinationArea.some(this.grid.outOfBounds)) {
          return acc
        }

        const destinationCost = getAreaCostForUnit(
          this.grid,
          destinationArea,
          this.unit
        )
        if (destinationCost <= this.movementPool) {
          acc.push(destination)
        }

        return acc
      }, [] as XYCoords[])

      if (!graph[fromHash]) graph[fromHash] = {}
      reachable.forEach(reachableCoordinate => {
        const toHash = XYCoords.hash(reachableCoordinate)
        graph[fromHash][toHash] =
          this.unit[terrain.costOverride] || terrain.baseCost
      })
    })

    return graph
  }
}
