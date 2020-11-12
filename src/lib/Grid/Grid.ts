import { Deployment } from '../Deployment'
import { Scene, JSONCoords, Game } from '../../../lib'
import { Tile } from '../Tile'
import { Unit } from '../Unit'
import { GridConfig } from './types'
import { getGridDimensions } from './utils'
import Cursor from '../../game/Cursor'
import Cursor2 from '../../game/Cursor2'

export default class Grid extends Scene {
  tiles: {
    [x: number]: {
      [y: number]: Tile
    }
  } = {}
  cellSize: number
  selectedDeployment?: { tiles: Tile[]; deployment: Deployment }
  timestamp: number
  cursor: Cursor2

  constructor({ game, tiles, cellSize }: GridConfig) {
    super(game, getGridDimensions(tiles))
    this.cursor = new Cursor2(this)
    this.cellSize = cellSize
    tiles.forEach((row, y) =>
      row.forEach((terrain, x) => {
        const tile = new Tile({
          grid: this,
          terrain,
          coordinates: { x, y },
        })
        if (!this.tiles[x]) this.tiles[x] = {}
        this.tiles[x][y] = tile
        this.add(tile)
      })
    )
    this.initCursor()
  }

  private initCursor = () => {
    const tile = this.tiles[0][0]
    const selectFirstTile = async () => {
      await this.cursor.select(tile)
      this.cursor.show()
    }
    if (tile.spriteSheet && !tile.spriteSheet.loaded) {
      tile.spriteSheet.onload(selectFirstTile)
      return
    }

    selectFirstTile()
  }

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

  deploy = (unit: Unit, x: number, y: number, state = 'default') => {
    if (
      unit.canDeploy(this, x, y) &&
      !this.deployments().some(d => d.unit === unit)
    ) {
      const deployment = new Deployment(this.game, {
        grid: this,
        unit,
        x,
        y,
        state,
        footprint: unit.movement.footprint,
      })
      deployment.occupyTiles()
      this.timestamp++
      this.add(deployment)
      return deployment
    }
    return null
  }

  withdraw = (unit: Unit) => {
    const deployment = this.deployments().find(d => d.unit === unit)
    if (!deployment) return this

    deployment.evacuateTiles()
    this.timestamp++
    this.remove(deployment)

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

  mapTiles<R extends any>(callback: (tile: Tile) => R): R[] {
    return this.filter(entity => entity instanceof Tile).map(callback)
  }
  filterTiles<R extends boolean>(callback: (tile: Tile) => R) {
    return this.filter(
      entity => entity instanceof Tile && callback(entity)
    ) as Tile[]
  }

  findDeployment = (query: (deployment: Deployment) => boolean) =>
    this.find(entity => entity instanceof Deployment && query(entity)) as
      | Deployment
      | undefined
}
