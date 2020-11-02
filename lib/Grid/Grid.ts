import { DeltaConstraint } from '../DeltaConstraint'
import { Deployment, DeploymentMetadata } from '../Deployment'
import { Game } from '../Game'
import { Entity, Scene } from '../Scene'
import { Tile, TileMetadata } from '../Tile'
import { Unit } from '../Unit'
import { JSONCoords } from '../XYCoords'
import { GridConfig } from './types'
import { getGridDimensions } from './utils'

export default class Grid extends Scene<TileMetadata | DeploymentMetadata> {
  game: Game

  constructor({ tiles }: GridConfig) {
    super(getGridDimensions(tiles))

    tiles.forEach((row, rowIndex) =>
      row.forEach((terrain, columnIndex) =>
        this.entities.add(
          new Tile({
            terrain,
            coordinates: { x: columnIndex, y: rowIndex },
          })
        )
      )
    )
  }

  deployments() {
    return this.filterEntities(
      e => e.metadata.type === 'deployment'
    ) as Deployment[]
  }

  teams() {
    return this.deployments().map(d => d.unit.team)
  }

  tiles() {
    return this.filterEntities(e => e.metadata.type === 'tile') as Entity<
      TileMetadata
    >[]
  }

  units() {
    return this.deployments().map(d => d.unit)
  }

  outOfBounds = (c: JSONCoords) => !this.withinBounds(c)

  withinBounds = ({ x, y }: JSONCoords) =>
    x >= 0 && x < this.width && y >= 0 && y < this.height

  mapTiles<R extends any>(callback: (tile: Entity<TileMetadata>) => R): R[] {
    return this.tiles().map(callback)
  }

  deploy = (unit: Unit, x: number, y: number) => {
    if (
      unit.canDeploy(this, x, y) &&
      !this.deployments().some(d => d.unit === unit)
    ) {
      const deployment = new Deployment(this, unit, x, y)
      this.entities.add(deployment)
      this.game.emit(Game.Events.UnitDeployed, deployment)
    }
    return this
  }

  withdraw = (unit: Unit) => {
    const deployment = this.deployments().find(d => d.unit === unit)
    if (!deployment) return this

    this.entities.delete(deployment)
    this.game.emit(Game.Events.DeploymentWithdrawn, deployment)

    return this
  }
}
