import {
  Game,
  Scene,
  Entity,
  ParticleSystem,
  Easing,
  Point,
  minMax,
  Particle
} from "../../lib"

const game = new Game({
  canvasId: "app",
  viewportWidth: 600,
  viewportHeight: 600
})

const mousePosition = { x: 0, y: 0 }
const handleMouseMove = (e: MouseEvent) => {
  mousePosition.x = e.clientX
  mousePosition.y = e.clientY
}

game.on("sceneMounted", () => {
  window.addEventListener("mousemove", handleMouseMove)
})
game.on("sceneUnmounted", () => {
  window.removeEventListener("mousemove", handleMouseMove)
})

const ps = new ParticleSystem(game, {
  interval: 0,
  spawn() {
    const particle = new Particle({
      lifespan: 1000,
      mass: minMax(Math.random() * 8, 3, 8),
      acceleration: { x: 0, y: 0 },
      velocity: {
        x: (-Math.random() + Math.random()) * 2,
        y: Math.random() * -2
      },
      position: mousePosition,
      render() {
        game.context.beginPath()
        game.context.arc(
          particle.position.x,
          particle.position.y,
          particle.mass,
          0,
          2 * Math.PI
        )
        const colorValue =
          (Point.magnitude(particle.position) /
            Point.magnitude({
              x: game.viewportDimensions.width,
              y: game.viewportDimensions.width
            })) *
          255

        game.context.fillStyle = `rgba(145,35,100,${particle.life})`
        game.context.fill()
      }
    })

    return particle
  },
  max: 200
})

game.loop.doWhile(() => {
  game.context.fillStyle = "rgb(200,200,255)"
  game.context.fillRect(
    0,
    0,
    game.viewportDimensions.width,
    game.viewportDimensions.height
  )
  ps.applyGravity({ x: 0, y: 0.001 })
  ps.update()
  ps.render()
  return true
})

const scene = new Scene(game)

game.loadScene(scene)
