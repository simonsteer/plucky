import { Entity, Game, getDoBoundsOverlap, getDoCirclesOverlap, QuadTree, QuadTreeChild, Scene } from '../lib'
import { handleSceneClicked, handleSceneMouseMove } from './utils/events'
import { Grid, GridConfig } from './lib/Grid'
import { forest, plains } from './game/terrain'
import { createFairy, createOgre } from './game/units'
import TextRenderer from './game/TextFactory'

// const CELL_SIZE = 20

// export const game = new Game({
//   canvasId: 'app',
//   viewportHeight: CELL_SIZE * 10,
//   viewportWidth: CELL_SIZE * 10,
// })

// const tiles = Array(10)
//   .fill(null)
//   .map((_, y) =>
//     Array(10)
//       .fill(null)
//       .map((_, x) =>
//         [3, 4, 5, 6].includes(x) && [3, 4, 5, 6].includes(y) ? forest : plains
//       )
//   ) as GridConfig['tiles']
// const grid = new Grid({ game, tiles, cellSize: CELL_SIZE })

// game.canvas.style.cursor = 'none'
// game.loadScene(grid)
// game.on(Game.Events.SceneClicked, handleSceneClicked)
// game.on(Game.Events.SceneMouseMove, handleSceneMouseMove)

// grid.deploy(createOgre(), 1, 1)
// const fairy = grid.deploy(createFairy(), 4, 4)!

// window['game'] = game
// window['loop'] = game.loop
// window['createOgre'] = createOgre
// window['createFairy'] = createFairy

// const textRenderer = new TextRenderer(grid)

// window['textRenderer'] = textRenderer

const game = new Game({ canvasId: 'app' })
const scene = new Scene(game)

// background
scene.add(new Entity(game, {
  render() {
    game.context.fillStyle = '#d5f7de'
    game.context.fillRect(0, 0, scene.width, scene.height)
  }
}))

const createball = () => {
  const size = Math.max(7, Math.floor(Math.random() * 21))

  const ball = new Entity(game, {
    metadata: {
      bounds: {
        x: Math.max(0, Math.floor(Math.random() * (scene.width - size))),
        y: Math.max(0, Math.floor(Math.random() * (scene.height - size))),
        width: size,
        height: size
      },
      movement: {
        horizontal: Math.random() >= 0.5 ? 'right' : 'left',
        vertical: Math.random() >= 0.5 ? 'top' : 'bottom',
        speed: Math.max(0.2, Math.floor(Math.random() * 0.7)),
      },
      colliding: false,
    },
    update() {
      const { speed } = ball.metadata.movement

      if (ball.metadata.vertical === 'bottom') {
        if (ball.metadata.bounds.y + ball.metadata.bounds.height + speed <= scene.height) {
          ball.metadata.bounds.y += speed
        } else {
          ball.metadata.bounds.y = scene.height - ball.metadata.bounds.height
          ball.metadata.vertical = 'top'
        }
      } else {
        if (ball.metadata.bounds.y >= speed) {
          ball.metadata.bounds.y -= speed
        } else {
          ball.metadata.bounds.y = 0
          ball.metadata.vertical = 'bottom'
        }
      }
      if (ball.metadata.horizontal === 'right') {
        if (ball.metadata.bounds.x + ball.metadata.bounds.width + speed <= scene.width) {
          ball.metadata.bounds.x += speed
        } else {
          ball.metadata.bounds.x = scene.width - ball.metadata.bounds.width
          ball.metadata.horizontal = 'left'
        }
      } else {
        if (ball.metadata.bounds.x >= speed) {
          ball.metadata.bounds.x -= speed
        } else {
          ball.metadata.bounds.x = 0
          ball.metadata.horizontal = 'right'
        }
      }
    },
    render() {
      const { x, y, width } = ball.metadata.bounds
      const radius = width / 2
      game.context.beginPath()
      game.context.arc(x + radius, y + radius, radius, 0, 2 * Math.PI)
      game.context.fillStyle = ball.metadata.colliding ? 'rgba(255,100,100,0.4)' : 'rgba(19,118,194,1)'
      game.context.fill()
    },
  })
  return ball
}

const balls = Array(100).fill(undefined).map(createball)
balls.forEach(ball => scene.add(ball))

game.loadScene(scene)

// init tree
const tree = new QuadTree<Entity>({ x: 0, y: 0, width: scene.width, height: scene.height })

const useQuadTreeCollisionDetection = () => {
  // clear previous ball positions, add updated ones
  tree.clear()
  balls.forEach(ball => {
    ball.metadata.colliding = false
    tree.insert({
      ...ball.metadata.bounds,
      metadata: ball,
    })
  })
  // query tree for collisions
  balls.forEach(ball => {
    const children = tree.retrieve(ball.metadata.bounds)
    children.forEach(child => {
      if (child.metadata.id === ball.id) {
        return
      }

      const radius = ball.metadata.bounds.width / 2

      const colliding = getDoCirclesOverlap({
        x: ball.metadata.bounds.x + radius,
        y: ball.metadata.bounds.y + radius,
        radius
      }, {
        x: child.metadata.metadata.bounds.x + radius,
        y: child.metadata.metadata.bounds.y + radius,
        radius
      })
      ball.metadata.colliding = ball.metadata.colliding || colliding
      child.metadata.metadata.colliding = child.metadata.metadata.colliding || colliding
    })
  })
}

game.loop.doUntil(() => {
  useQuadTreeCollisionDetection()
  return true
})