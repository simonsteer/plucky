import {
  DeltaConstraint,
  Game,
  Pathfinder,
  PathfinderObject,
} from '../../../lib'
import { Unit } from '../Unit'
import { Grid } from '../Grid'
import { XYCoords, JSONCoords } from '../../../lib/XYCoords'
import { getAreaCostForDeployment } from './utils'
import GridEntity from '../GridEntity'
import { animateEntityMovement } from '../../game/utils'

export default class Deployment extends GridEntity {
  private pathfinder: Pathfinder

  constructor(
    game: Game,
    {
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
    }
  ) {
    super(game, {
      grid,
      footprint,
      origin: { x, y },
      metadata: { type: 'deployment', grid, unit },
      spriteSheet: unit.sprite,
      spriteState: state,
      renderLayer: 1,
    })
    this.pathfinder = new Pathfinder(this.createDijkstraGraph())
    this.occupyTiles()
  }

  get unit() {
    return this.metadata.unit as Unit
  }

  private get movementPool() {
    return this.unit.movement.steps * this.unit.movement.footprint.length
  }

  move = async (path: JSONCoords[]) => {
    if (!path.length) return this

    this.evacuateTiles()
    await animateEntityMovement({
      entity: this,
      path: path.map(c => ({
        x: c.x * this.grid.cellSize,
        y: c.y * this.grid.cellSize,
      })),
      stepDuration: 200,
    })
    this.occupyTiles()

    this.grid.cursor.reselect()
    return this
  }

  getPath = ({
    from = this.gridCoordinates.raw,
    to,
    unrestricted = false,
  }: {
    to: JSONCoords
    from?: JSONCoords
    unrestricted?: boolean
  }) => {
    const reachable = this.getReachableCoordinates()
    const avoid = unrestricted
      ? []
      : this.grid
          .filterTiles(tile => !reachable.some(tile.gridCoordinates.match))
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
      if (
        areaCost > stepsLeft ||
        area.some(({ x, y }) => {
          const { deployment } = this.grid.tiles[x]?.[y] || {}
          return !!deployment && deployment.id !== this.id
        })
      ) {
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
