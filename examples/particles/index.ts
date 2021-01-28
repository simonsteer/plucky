import { Game, Scene, ParticleSystem, minMax, Particle } from "../../lib"

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
  spawnInterval: 10,
  spawn() {
    const particle = new Particle({
      lifespan: 5000,
      weight: 5,
      mass: minMax(Math.random() * 8, 3, 8),
      acceleration: { x: 0, y: 0 },
      velocity: {
        x: -Math.random() + Math.random(),
        y: -Math.random() + Math.random()
      },
      position: {
        x: Math.floor(game.viewportDimensions.width / 2),
        y: Math.floor(game.viewportDimensions.height / 2)
      },
      render() {
        game.context.beginPath()
        game.context.arc(
          particle.position.x,
          particle.position.y,
          particle.mass,
          0,
          2 * Math.PI
        )
        game.context.fillStyle = `rgba(145,35,200,${particle.life})`
        game.context.fill()
      }
    })

    return particle
  }
})

game.loop.doWhile(() => {
  game.context.fillStyle = "rgb(200,200,255)"
  game.context.fillRect(
    0,
    0,
    game.viewportDimensions.width,
    game.viewportDimensions.height
  )
  ps.applyAttractor(
    {
      x: Math.floor(game.viewportDimensions.width / 2),
      y: Math.floor(game.viewportDimensions.height / 2) + 200
    },
    10
  )
  ps.applyAttractor(
    {
      x: Math.floor(game.viewportDimensions.width / 2),
      y: Math.floor(game.viewportDimensions.height / 2) - 200
    },
    10
  )
  ps.run()

  return true
})

const scene = new Scene(game)

game.loadScene(scene)
