import { EventEmitter } from 'events'
import { getCoordinatesFromClick, link } from './utils'
import { Grid } from '../Grid'
import { Team } from '../Team'
import { Zone } from '../Zone'
import { Terrain } from '../Terrain'
import { Unit } from '../Unit'
import { EntityMetadata, Scene } from '../Scene'
import { Loop } from '../Loop'

export default class Game extends EventEmitter {
  Grid: typeof Grid
  Team: typeof Team
  Terrain: typeof Terrain
  Unit: typeof Unit
  Zone: typeof Zone

  static Events = {
    UnitDeployed: Symbol(),
    DeploymentWithdrawn: Symbol(),
    DeploymentMovement: Symbol(),
    BattleStart: Symbol(),
    BattleTurnStart: Symbol(),
    BattleTurnEnd: Symbol(),
    BattleEnd: Symbol(),
    SceneClicked: Symbol(),
    SceneMouseMove: Symbol(),
  }

  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  viewportDimensions: { width: number; height: number; cellSize: number }

  constructor({
    canvasId,
    cellSize = 24,
    viewportHeight = 10,
    viewportWidth = 10,
  }: {
    canvasId: string
    cellSize?: number
    viewportWidth?: number
    viewportHeight?: number
  }) {
    super()
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null
    if (!canvas)
      throw new Error(
        `No HTMLCanvasElement was found with the id "${canvasId}"`
      )
    this.viewportDimensions = {
      height: viewportHeight * cellSize,
      width: viewportWidth * cellSize,
      cellSize,
    }
    this.init(canvas)
    this.Grid = link(this, Grid)
    this.Team = link(this, Team)
    this.Terrain = link(this, Terrain)
    this.Unit = link(this, Unit)
    this.Zone = link(this, Zone)
    this.loop = new Loop(this)
  }

  private loop: Loop

  currentScene?: Scene<EntityMetadata>

  loadScene = (scene: Scene<EntityMetadata>) => {
    this.currentScene = scene
    if (!this.loop.didStart) {
      this.loop.run()
    }
  }

  private handleClick = (e: MouseEvent) => {
    if (!this.currentScene) return
    const coordinates = getCoordinatesFromClick(
      e.offsetX,
      e.offsetY,
      this.viewportDimensions.cellSize
    )

    const entities = this.currentScene.filterEntities(e =>
      e.origin.match(coordinates)
    )
    if (entities.length) {
      this.emit(Game.Events.SceneClicked, this.currentScene, { entities })
    }
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.currentScene) return
    const coordinates = getCoordinatesFromClick(
      e.offsetX,
      e.offsetY,
      this.viewportDimensions.cellSize
    )

    const entities = this.currentScene.filterEntities(e =>
      e.origin.match(coordinates)
    )
    if (entities.length) {
      this.emit(Game.Events.SceneMouseMove, this.currentScene, { entities })
    }
  }

  private init(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d')
    if (!context)
      throw new Error(
        'Unable to get 2d rendering context for HTMLCanvasElement'
      )

    this.canvas = canvas
    this.context = context
    this.canvas.addEventListener('click', this.handleClick)
    this.canvas.addEventListener('mousemove', this.handleMouseMove)
  }
}
