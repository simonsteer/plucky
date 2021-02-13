import { Game, Scene, ParticleSystem, minMax, Particle, Point } from "../../lib"

const game = new Game({
  canvasId: "app",
  viewportWidth: 300,
  viewportHeight: 600
})

const scene = new Scene(game)

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

const background = {
  origin: { x: 0, y: 0 },
  id: "background",
  render() {
    game.context.fillStyle = "rgb(200,200,255)"
    game.context.fillRect(
      0,
      0,
      game.viewportDimensions.width,
      game.viewportDimensions.height
    )
  }
}

const ps = new ParticleSystem(scene, {
  id: "particles",
  origin: {
    x: Math.floor(game.viewportDimensions.width / 2),
    y: Math.floor(game.viewportDimensions.height / 8)
  },
  spawnInterval: 10,
  update() {
    ps.applyGravity({ y: 10, x: 0 })
  },
  spawn() {
    const particle = new Particle({
      lifespan: 2000,
      mass: Math.round(3 + Math.random() * 5),
      acceleration: { x: 0, y: 0 },
      velocity: {
        x: -Math.random() + Math.random(),
        y: -Math.random() + Math.random()
      },
      render() {
        game.context.beginPath()
        game.context.arc(
          particle.origin.x,
          particle.origin.y,
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

scene.add(background, ps)

game.loadScene(scene)
