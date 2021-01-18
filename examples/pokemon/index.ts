import { Entity, Game, Scene } from "../../lib"

const game = new Game({
  canvasId: "app",
  viewportWidth: 320,
  viewportHeight: 240
})
const scene = new Scene(game)
const background = new Entity(game, {
  render() {
    game.context.fillStyle = "#a3a3a3"
    game.context.fillRect(
      0,
      0,
      game.viewportDimensions.width,
      game.viewportDimensions.height
    )
  }
})

const DIRECTIONS = {
  ArrowRight: "ArrowRight",
  ArrowLeft: "ArrowLeft",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown"
} as const

type DirectionKey = keyof typeof DIRECTIONS

let pressed: DirectionKey[] = []
window.addEventListener("keydown", e => {
  if (e.key in DIRECTIONS) {
    pressed = pressed.filter(key => key !== e.key)
    pressed.unshift(e.key as DirectionKey)
  }
})
window.addEventListener("keyup", e => {
  if (e.key in DIRECTIONS) {
    pressed = pressed.filter(key => key !== e.key)
  }
})

const character = new Entity(game, {
  metadata: {
    isMoving: false,
    direction: "ArrowDown" as DirectionKey,
    x: 0,
    y: 0
  },
  render() {
    game.context.fillStyle = "#000000"
    game.context.fillRect(character.metadata.x, character.metadata.y, 16, 16)
  },
  update() {
    const topKey = pressed[0]
    character.metadata.direction = topKey
    character.metadata.isMoving = !!topKey

    if (character.metadata.isMoving) {
      switch (character.metadata.direction) {
        case "ArrowDown":
          character.metadata.y += 3
          break
        case "ArrowLeft":
          character.metadata.x -= 3
          break
        case "ArrowRight":
          character.metadata.x += 3
          break
        case "ArrowUp":
          character.metadata.y -= 3
          break
      }
    }
  }
})

scene.add(background, character)
game.loadScene(scene)
