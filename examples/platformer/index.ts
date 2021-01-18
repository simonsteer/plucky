import { Game, Scene, Entity, QuadTree, getDoBoundsOverlap } from "../../lib"

const game = new Game({ canvasId: 'app', viewportWidth: 300, viewportHeight: 200 })
const scene = new Scene(game)

const background = new Entity(game, {
  renderLayer: 0,
  render() {
    game.context.fillStyle = 'black'
    game.context.fillRect(
      0,
      0,
      game.viewportDimensions.width,
      game.viewportDimensions.height
    )
  }
})

const ground = new Entity(game, {
  renderLayer: 1,
  metadata: {
    x: 0,
    y: game.viewportDimensions.height - 30,
    width: game.viewportDimensions.width,
    height: 30,
  },
  render() {
    game.context.fillStyle = 'green'
    const { x, y, width, height } = ground.metadata
    game.context.fillRect(x, y, width, height)
  }
})

const player = new Entity(game, {
  renderLayer: 2,
  metadata: {
    x: 10,
    y: game.viewportDimensions.height - ground.metadata.height - 40,
    width: 20,
    height: 40,
    hSpeed: 0,
    vSpeed: 0,
    airborn: false,
    leftPressed: false,
    rightPressed: false,
    upPressed: false,
    colliding: false,
  },
  render() {
    game.context.fillStyle = 'purple'
    game.context.fillRect(
      player.metadata.x,
      player.metadata.y,
      player.metadata.width,
      player.metadata.height
    )
  },
  update() {
    const horizon = ground.metadata.y
    player.metadata.y = Math.min(player.metadata.vSpeed + player.metadata.y, horizon - player.metadata.height)
    player.metadata.x += player.metadata.hSpeed

    if (player.metadata.airborn) {
      if (player.metadata.colliding) {
        player.metadata.airborn = false
        player.metadata.colliding = false
        player.metadata.vSpeed = 0
      } else {
        player.metadata.vSpeed += 1
      }
    }
  }
})

scene.add(background, ground, player)

const { width, height } = scene
const quadTree = new QuadTree<Entity>({ x: 0, y: 0, width, height })

game.loop.doWhile(() => {
  quadTree.clear()
  quadTree.insert(
    { ...ground.metadata, metadata: ground },
    { ...player.metadata, metadata: player }
  )
  quadTree.retrieve(player.metadata).forEach(({ metadata: entity, ...child }) => {
    if (entity.id === player.id) {
      return
    }
    const colliding = getDoBoundsOverlap(player.metadata, child)
    console.log(colliding)
    if (colliding) {
      player.metadata.colliding = true
    }
  })

  return true
})

game.loadScene(scene)


window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      player.metadata.upPressed = false
      break
    case 'ArrowLeft':
      player.metadata.leftPressed = false
      if (!player.metadata.rightPressed) {
        player.metadata.hSpeed = 0
      } else {
        player.metadata.hSpeed = 1
      }
      break
    case 'ArrowRight':
      player.metadata.rightPressed = false
      if (!player.metadata.leftPressed) {
        player.metadata.hSpeed = 0
      } else {
        player.metadata.hSpeed = -1
      }
      break
    default: break
  }
})
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      if (!player.metadata.upPressed && !player.metadata.airborn) {
        player.metadata.upPressed = true
        player.metadata.airborn = true
        player.metadata.vSpeed = -10
      }
      break
    case 'ArrowLeft':
      if (!player.metadata.leftPressed) {
        player.metadata.leftPressed = true
        player.metadata.hSpeed = -1
      }
      break
    case 'ArrowRight':
      if (!player.metadata.rightPressed) {
        player.metadata.rightPressed = true
        player.metadata.hSpeed = 1
      }
      break
    default: break
  }
})