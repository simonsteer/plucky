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
  tiles: {
    [x: number]: {
      [y: number]: Tile
    }
  } = {}

  selectedDeployment?: { tiles: Tile[]; deployment: Deployment }

  selectDeployment(deployment: Deployment) {
    this.selectedDeployment?.tiles.forEach(
      tile => (tile.spriteHighlight = undefined)
    )
    this.selectedDeployment = {
      deployment,
      tiles: deployment.getReachableCoordinates().map(({ x, y }) => {
        const tile = this.tiles[x][y]
        tile.spriteHighlight = 'rgba(255,0,0,0.5)'
        return tile
      }),
    }
  }

  deselectDeployment() {
    this.selectedDeployment?.tiles.forEach(t => (t.spriteHighlight = undefined))
    this.selectedDeployment = undefined
  }

  constructor({ tiles }: GridConfig) {
    super(getGridDimensions(tiles))
    tiles.forEach((row, y) =>
      row.forEach((terrain, x) => {
        const tile = new Tile({
          terrain,
          coordinates: { x, y },
        })
        if (!this.tiles[x]) this.tiles[x] = {}
        this.tiles[x][y] = tile
        this.entities.add(tile)
      })
    )
  }

  deploy = (unit: Unit, x: number, y: number, state = 'default') => {
    if (
      unit.canDeploy(this, x, y) &&
      !this.deployments().some(d => d.unit === unit)
    ) {
      const deployment = new Deployment(this, unit, x, y, state)
      this.entities.add(deployment)
      this.game.emit(Game.Events.UnitDeployed, deployment)
      return deployment
    }
    return null
  }

  withdraw = (unit: Unit) => {
    const deployment = this.deployments().find(d => d.unit === unit)
    if (!deployment) return this

    this.entities.delete(deployment)
    this.game.emit(Game.Events.DeploymentWithdrawn, deployment)

    return this
  }

  deployments() {
    return this.filter(e => e.metadata.type === 'deployment') as Deployment[]
  }
  teams() {
    return [...new Set(this.deployments().map(d => d.unit.team))]
  }
  units() {
    return this.deployments().map(d => d.unit)
  }

  outOfBounds = (c: JSONCoords) => !this.withinBounds(c)
  withinBounds = ({ x, y }: JSONCoords) =>
    x >= 0 && x < this.width && y >= 0 && y < this.height

  mapTiles<R extends any>(callback: (tile: Entity<TileMetadata>) => R): R[] {
    return this.filter(entity => entity instanceof Tile).map(callback)
  }
  filterTiles<R extends boolean>(callback: (tile: Entity<TileMetadata>) => R) {
    return this.filter(
      entity => entity instanceof Tile && callback(entity)
    ) as Tile[]
  }
}
