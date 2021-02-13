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
const background: Entity = {
  origin: { x: 0, y: 0 },
  id: "bg",
  render() {
    forestSpriteSheet.render({ game, x: 0, y: 0, instanceId: "vforest" })
  }
}

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

const character = {
  id: "player",
  origin: {
    x: 64,
    y: 64
  },
  isMoving: false,
  direction: "ArrowDown" as DirectionKey,
  spriteState: "FaceDown" as CharacterSpriteSheetState,
  movementSpeed: 1,
  get coords(): JSONCoords {
    return {
      x: Math.floor(character.origin.x / 16),
      y: Math.floor(character.origin.y / 16)
    }
  },
  render() {
    const { x, y } = character.origin
    characterSpriteSheet.render({
      game,
      x,
      y: y - 16,
      instanceId: character.id,
      state: character.spriteState
    })
  },
  update() {
    if (character.isMoving) {
      switch (character.spriteState) {
        case "WalkUp":
          character.origin.y -= character.movementSpeed
          break
        case "WalkDown":
          character.origin.y += character.movementSpeed
          break
        case "WalkLeft":
          character.origin.x -= character.movementSpeed
          break
        case "WalkRight":
          character.origin.x += character.movementSpeed
          break
        default:
          break
      }
      if (character.origin.x % 16 === 0 && character.origin.y % 16 === 0) {
        character.isMoving = false
      }
      if (character.isMoving) {
        return
      }
    }

    const topKey = pressed[0]
    if (topKey) {
      character.isMoving = true
      character.direction = topKey
      character.spriteState = ("Walk" +
        topKey.slice(5)) as CharacterSpriteSheetState
    } else {
      character.spriteState = ("Face" +
        character.direction.slice(5)) as CharacterSpriteSheetState
    }
  }
}

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
scene.cameraOrigin = character.origin
game.loadScene(scene)
