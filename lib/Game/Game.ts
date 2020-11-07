import { EventEmitter } from 'events'
import { getGridCoordinatesFromXY } from './utils'
import { Scene } from '../Scene'
import { Loop } from '../Loop'

export default class Game extends EventEmitter {
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
    this.loop = new Loop(this)
  }

  loop: Loop

  currentScene?: Scene

  loadScene = (scene: Scene) => {
    this.currentScene = scene
    if (!this.loop.didStart) {
      this.loop.run()
    }
  }

  private handleClick = (e: MouseEvent) => {
    if (this.currentScene) {
      const coordinates = { x: e.offsetX, y: e.offsetY }
      this.emit(Game.Events.SceneClicked, this.currentScene, coordinates)
    }
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (this.currentScene) {
      const coordinates = { x: e.offsetX, y: e.offsetY }
      this.emit(Game.Events.SceneMouseMove, this.currentScene, coordinates)
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
