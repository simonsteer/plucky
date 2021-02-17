import { Game, Scene, Entity, QuadTree, getDoBoundsOverlap } from "../../lib"

const game = new Game({
  canvasId: "app",
  viewportWidth: 300,
  viewportHeight: 200
})
const scene = new Scene(game)

const background = {
  id: "bg",
  origin: { x: 0, y: 0 },
  render() {
    game.drawRect(
      0,
      0,
      game.viewportDimensions.width,
      game.viewportDimensions.height,
      "black"
    )
  }
}

const ground = {
  id: "ground",
  origin: {
    x: 0,
    y: game.viewportDimensions.height - 30
  },
  width: game.viewportDimensions.width,
  height: 30,
  render() {
    const {
      origin: { x, y },
      width,
      height
    } = ground
    game.drawRect(x, y, width, height, "green")
  }
}

const player = {
  id: "player",
  origin: {
    x: 10,
    y: game.viewportDimensions.height - ground.height - 40
  },
  width: 20,
  height: 40,
  hSpeed: 0,
  vSpeed: 0,
  airborn: false,
  leftPressed: false,
  rightPressed: false,
  upPressed: false,
  colliding: false,
  render() {
    game.drawRect(
      player.origin.x,
      player.origin.y,
      player.width,
      player.height,
      "purple"
    )
  },
  update() {
    const horizon = ground.origin.y
    player.origin.y += player.vSpeed
    player.origin.x += player.hSpeed

    const yLimit = horizon - player.height
    player.airborn = player.origin.y < yLimit
    player.origin.y = Math.min(player.origin.y, yLimit)
    if (player.airborn) {
      player.vSpeed += 1
    } else {
      player.vSpeed = 0
    }
  }
}

scene.add(background, ground, player)

const { width, height } = scene
const quadTree = new QuadTree<Entity>({ x: 0, y: 0, width, height })

game.loop.doWhile(() => {
  const playerBounds = {
    ...player.origin,
    width: player.width,
    height: player.height
  }
  const groundBounds = {
    ...ground.origin,
    width: ground.width,
    height: ground.height
  }
  const colliding = getDoBoundsOverlap(playerBounds, groundBounds)
  if (colliding) {
    player.colliding = true
    player.airborn = false
  }

  return true
})

game.loadScene(scene)

window.addEventListener("keyup", e => {
  switch (e.key) {
    case "ArrowUp":
      player.upPressed = false
      break
    case "ArrowLeft":
      player.leftPressed = false
      if (!player.rightPressed) {
        player.hSpeed = 0
      } else {
        player.hSpeed = 1
      }
      break
    case "ArrowRight":
      player.rightPressed = false
      if (!player.leftPressed) {
        player.hSpeed = 0
      } else {
        player.hSpeed = -1
      }
      break
    default:
      break
  }
})
window.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp":
      if (!player.upPressed && !player.airborn) {
        player.upPressed = true
        player.airborn = true
        player.vSpeed = -13
      }
      break
    case "ArrowLeft":
      if (!player.leftPressed) {
        player.leftPressed = true
        player.hSpeed = -2
      }
      break
    case "ArrowRight":
      if (!player.rightPressed) {
        player.rightPressed = true
        player.hSpeed = 2
      }
      break
    default:
      break
  }
})

window["game"] = game
