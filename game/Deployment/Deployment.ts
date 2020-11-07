import {
  DeltaConstraint,
  memoize,
  Pathfinder,
  PathfinderObject,
} from '../../lib'
import { Unit } from '../Unit'
import { Grid } from '../Grid'
import { XYCoords, JSONCoords } from '../../lib/XYCoords'
import { getAreaCostForDeployment, animateDeploymentMovement } from './utils'
import GridEntity from '../GridEntity'
import { getGridCoordinatesFromXY } from '../../lib/Game/utils'
import { Tile } from '../Tile'

export default class Deployment extends GridEntity {
  private pathfinder: Pathfinder

  constructor({
    grid,
    unit,
    x,
    y,
    state = 'default',
    footprint,
  }: {
    grid: Grid
    unit: Unit
    x: number
    y: number
    state?: string
    footprint: DeltaConstraint
  }) {
    super({
      grid,
      footprint,
      origin: { x, y },
      metadata: { type: 'deployment', grid, unit },
      spriteSheet: unit.sprite,
      spriteState: state,
      renderLayer: 1,
    })
    this.pathfinder = new Pathfinder(this.createDijkstraGraph())
  }

  get unit() {
    return this.metadata.unit as Unit
  }

  private get movementPool() {
    return this.unit.movement.steps * this.unit.movement.footprint.length
  }

  move = (path: JSONCoords[]) => {
    if (!path.length) return this
    animateDeploymentMovement(this, path)
    return this
  }

  getPath = (to: JSONCoords, from = this.gridCoordinates) => {
    const avoid = this.grid
      .filterTiles(tile => {
        const footprint = this.footprint.adjacent(tile.gridCoordinates)

        return (
          footprint.every(this.grid.withinBounds) &&
          footprint.some(({ x, y }) => {
            const { deployment } = this.grid.tiles[x][y]
            return !!deployment && deployment.id !== this.id
          })
        )
      })
      .map(tile => tile.gridCoordinates.hash)

    return this.pathfinder.find(from, to, avoid)
  }

  getReachableCoordinates = (
    from = this.gridCoordinates.raw,
    stepsLeft = this.movementPool
  ) =>
    this.unit.movement.pattern.adjacent(from).reduce((acc, target) => {
      const area = this.unit.movement.footprint.adjacent(target)
      const areaCost = getAreaCostForDeployment(this, area)
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

    this.grid.mapTiles(({ metadata: { terrain }, gridCoordinates }) => {
      const fromArea = footprint.adjacent(gridCoordinates)
      if (fromArea.some(this.grid.outOfBounds)) {
        return
      }

      const fromHash = XYCoords.hash(gridCoordinates)

      let reachable = pattern.adjacent(gridCoordinates)
      reachable = reachable.reduce((acc, destination) => {
        const destinationArea = footprint.adjacent(destination)
        if (destinationArea.some(this.grid.outOfBounds)) {
          return acc
        }

        const destinationCost = getAreaCostForDeployment(this, destinationArea)
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

  evacuateTiles = () => {
    const area = this.area()
    this.grid
      .filterTiles(tile => area.some(tile.gridCoordinates.match))
      .forEach(tile => (tile.deployment = undefined))
    return this
  }

  occupyTiles = () => {
    const area = this.area()
    this.grid
      .filterTiles(tile => area.some(tile.gridCoordinates.match))
      .forEach(tile => (tile.deployment = this))
    return this
  }
}
