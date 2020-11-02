import { Pathfinder, PathfinderObject } from '../Pathfinder'
import { Unit } from '../Unit'
import { Grid } from '../Grid'
import { XYCoords, JSONCoords } from '../XYCoords'
import { getAreaCostForUnit } from './utils'
import { Game } from '../Game'
import { Entity } from '../Scene'
import { DeploymentMetadata } from './types'

export default class Deployment extends Entity<DeploymentMetadata> {
  private pathfinder: Pathfinder

  constructor(grid: Grid, unit: Unit, x: number, y: number) {
    super({
      origin: { x, y },
      footprint: unit.movement.footprint,
      metadata: { type: 'deployment', grid, unit },
      sprite: unit.sprite,
    })
    this.pathfinder = new Pathfinder(this.createDijkstraGraph())
  }

  get unit() {
    return this.metadata.unit
  }

  get grid() {
    return this.metadata.grid
  }

  private get movementPool() {
    return this.unit.movement.steps * this.unit.movement.footprint.length
  }

  move = (path: JSONCoords[]) => {
    if (!path.length) return this

    const { x, y } = path[path.length - 1]
    this.origin.x = x
    this.origin.y = y

    this.unit.game.emit(Game.Events.DeploymentMovement, path)

    return this
  }

  getPath = (to: JSONCoords, from = this.origin) =>
    this.pathfinder.find(from, to)

  getReachableCoordinates = (
    from = this.origin,
    stepsLeft = this.movementPool
  ) =>
    this.unit.movement.pattern.adjacent(from).reduce((acc, target) => {
      const area = this.unit.movement.footprint.adjacent(target)
      if (area.some(this.grid.outOfBounds)) {
        return acc
      }

      const areaCost = getAreaCostForUnit(this.grid, area, this.unit)
      if (areaCost > stepsLeft) {
        return acc
      }

      acc.push(target.raw)
      if (stepsLeft - areaCost > 0) {
        acc.push(...this.getReachableCoordinates(target, stepsLeft - areaCost))
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
        if (destinationCost > this.movementPool) {
          return acc
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
