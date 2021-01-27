import { EventEmitter } from "events"
import { Scene } from "../Scene"
import { Loop } from "../Loop"
import { JSONCoords } from "../Point"

type GameEvents = {
  sceneMounted: (scene: Scene) => void
  sceneUnmounted: (scene: Scene) => void
  sceneClicked: (scene: Scene, { x, y }: JSONCoords) => void
  sceneMouseMove: (scene: Scene, { x, y }: JSONCoords) => void
}
type GameEvent<K extends keyof GameEvents> = (
  ...args: Parameters<GameEvents[K]>
) => void
export default class Game {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  viewportDimensions: { width: number; height: number }

  private events = new EventEmitter()
  private emit<K extends keyof GameEvents>(
    event: K,
    ...args: Parameters<GameEvent<K>>
  ) {
    this.events.emit(event, ...args)
  }
  on<K extends keyof GameEvents>(event: K, callback: GameEvent<K>) {
    this.events.on(event, callback)
  }
  off<K extends keyof GameEvents>(event: K, callback: GameEvent<K>) {
    this.events.off(event, callback)
  }

  constructor({
    canvasId,
    viewportHeight = 192,
    viewportWidth = 320
  }: {
    canvasId: string
    viewportWidth?: number
    viewportHeight?: number
  }) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null
    if (!canvas) {
      throw new Error(
        `No HTMLCanvasElement was found with the id "${canvasId}"`
      )
    }
    this.viewportDimensions = {
      height: viewportHeight,
      width: viewportWidth
    }
    canvas.height = this.viewportDimensions.height
    canvas.width = this.viewportDimensions.width
    this.init(canvas)
    this.loop = new Loop(this)
  }

  loop: Loop

  currentScene?: Scene

  loadScene = (scene: Scene) => {
    if (this.currentScene) {
      this.emit("sceneUnmounted", this.currentScene)
    }
    this.currentScene = scene
    this.emit("sceneMounted", this.currentScene)

    if (!this.loop.didStart) {
      this.loop.start()
    }
  }

  private handleClick = (e: MouseEvent) => {
    if (this.currentScene) {
      this.emit("sceneClicked", this.currentScene, {
        x: e.offsetX,
        y: e.offsetY
      })
    }
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (this.currentScene) {
      this.emit("sceneMouseMove", this.currentScene, {
        x: e.offsetX,
        y: e.offsetY
      })
    }
  }

  private init(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d")
    if (!context)
      throw new Error(
        "Unable to get 2d rendering context for HTMLCanvasElement"
      )

    this.canvas = canvas
    this.context = context
    this.canvas.addEventListener("click", this.handleClick)
    this.canvas.addEventListener("mousemove", this.handleMouseMove)
  }
}
