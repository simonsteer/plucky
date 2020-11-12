import { Deployment } from '../lib/Deployment'
import { Grid } from '../lib/Grid'
import GridEntity from '../lib/GridEntity'
import { Tile } from '../lib/Tile'
import { Entity, JSONCoords, Scene, XYCoords } from '../../lib'
import { getGridCoordinatesFromXY } from '../../lib/Game/utils'
import { cursorTo } from 'readline'

export const handleSceneClicked = (scene: Scene, coordinates: JSONCoords) => {
  if (scene instanceof Grid) {
    handleGridClicked(scene, coordinates)
  }
}

export const handleSceneMouseMove = (scene: Scene, coordinates: JSONCoords) => {
  if (scene instanceof Grid) {
    handleGridMouseOver(scene, coordinates)
  }
}

export function handleGridMouseOver(grid: Grid, { x, y }: JSONCoords) {
  const entityToSelect = getEntityFromCoords(grid, { x, y })
  if (entityToSelect && entityToSelect !== grid.cursor.selectedEntity)
    grid.cursor.select(entityToSelect)
}

function handleGridClicked(grid: Grid, { x, y }: JSONCoords) {
  const cursorSelection = grid.cursor.selectedEntity
  if (cursorSelection instanceof Deployment) {
    handleDeploymentClicked(grid, cursorSelection)
    return
  }
  if (cursorSelection instanceof Tile) {
    handleTileClicked(grid, cursorSelection)
    return
  }
}

function handleDeploymentClicked(grid: Grid, deployment: Deployment) {
  if (grid.selectedDeployment?.deployment === deployment) {
    grid.deselectDeployment()
    return
  }
  grid.selectDeployment(deployment)
}

function handleTileClicked(grid: Grid, tile: Tile) {
  if (grid.selectedDeployment?.tiles.some(t => t === tile)) {
    const { deployment } = grid.selectedDeployment
    const { path } = deployment.getPath({ to: tile.gridCoordinates })
    if (path) deployment.move(path)
  }
  grid.deselectDeployment()
  grid.cursor.reselect()
}

export const getEntityFromCoords = (grid: Grid, coords: JSONCoords) => {
  const { x, y } = getGridCoordinatesFromXY(coords.x, coords.y, grid.cellSize)
  const tile = grid.tiles[x]?.[y]
  if (!tile) return undefined
  if (grid.selectedDeployment && tile.spriteHighlight) return tile
  return tile.deployment || tile
}
