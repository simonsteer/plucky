import { Entity, Game, JSONCoords, Scene, SpriteSheet } from "../../lib"
import guy from "./assets/overworld.png"
import forest from "./assets/vforest.png"

const forestSpriteSheet = new SpriteSheet({ src: forest })

const characterSpriteSheet = new SpriteSheet({
  src: guy,
  numFrames: 16,
  states: {
    default: [8],
    WalkUp: SpriteSheet.stretchFrames([0, 1, 2, 3], 8),
    FaceUp: [0],
    WalkRight: SpriteSheet.stretchFrames([4, 5, 6, 7], 8),
    FaceRight: [4],
    WalkDown: SpriteSheet.stretchFrames([8, 9, 10, 11], 8),
    FaceDown: [8],
    WalkLeft: SpriteSheet.stretchFrames([12, 13, 14, 15], 8),
    FaceLeft: [12]
  }
})
type CharacterSpriteSheetState = NonNullable<
  typeof characterSpriteSheet["currentState"]
>

const game = new Game({
  canvasId: "app",
  viewportWidth: 320,
  viewportHeight: 240
})
const scene = new Scene(game)
const background = new Entity(game, {
  render() {
    forestSpriteSheet.render({ game, x: 0, y: 0, instanceId: "vforest" })
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
  renderLayer: 1,
  metadata: {
    isMoving: false,
    direction: "ArrowDown" as DirectionKey,
    x: 64,
    y: 64,
    spriteState: "FaceDown" as CharacterSpriteSheetState,
    movementSpeed: 1,
    get coords(): JSONCoords {
      return {
        x: Math.floor(character.metadata.x / 16),
        y: Math.floor(character.metadata.y / 16)
      }
    }
  },
  render() {
    const { x, y } = character.metadata
    characterSpriteSheet.render({
      game,
      x,
      y: y - 16,
      instanceId: character.id,
      state: character.metadata.spriteState
    })
  },
  update() {
    if (character.metadata.isMoving) {
      switch (character.metadata.spriteState) {
        case "WalkUp":
          character.metadata.y -= character.metadata.movementSpeed
          break
        case "WalkDown":
          character.metadata.y += character.metadata.movementSpeed
          break
        case "WalkLeft":
          character.metadata.x -= character.metadata.movementSpeed
          break
        case "WalkRight":
          character.metadata.x += character.metadata.movementSpeed
          break
        default:
          break
      }
      if (character.metadata.x % 16 === 0 && character.metadata.y % 16 === 0) {
        character.metadata.isMoving = false
      }
      if (character.metadata.isMoving) {
        return
      }
    }

    const topKey = pressed[0]
    if (topKey) {
      character.metadata.isMoving = true
      character.metadata.direction = topKey
      character.metadata.spriteState = ("Walk" +
        topKey.slice(5)) as CharacterSpriteSheetState
    } else {
      character.metadata.spriteState = ("Face" +
        character.metadata.direction.slice(5)) as CharacterSpriteSheetState
    }
  }
})

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key in DIRECTIONS) {
    pressed = pressed.filter(key => key !== e.key)
    pressed.unshift(e.key as DirectionKey)
  }
}
const handleKeyUp = (e: KeyboardEvent) => {
  if (e.key in DIRECTIONS) {
    pressed = pressed.filter(key => key !== e.key)
  }
}
game.on("sceneMounted", () => {
  window.addEventListener("keydown", handleKeyDown)
  window.addEventListener("keyup", handleKeyUp)
})
game.on("sceneUnmounted", () => {
  window.removeEventListener("keydown", handleKeyDown)
  window.removeEventListener("keyup", handleKeyUp)
})

scene.add(background, character)
scene.cameraOrigin = { x: character.metadata.x, y: character.metadata.y }
game.loadScene(scene)
