import { Game, Scene, ParticleSystem, minMax, Particle, Point } from "../../lib"

const game = new Game({
  canvasId: "app",
  viewportWidth: 300,
  viewportHeight: 600
})

const scene = new Scene(game)

const background = {
  origin: { x: 0, y: 0 },
  id: "background",
  render() {
    game.drawRect(
      0,
      0,
      game.viewportDimensions.width,
      game.viewportDimensions.height,
      "rgb(200,200,255)"
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
        game.drawCirc(
          particle.origin.x,
          particle.origin.y,
          10,
          `rgba(145,35,200,${particle.life})`
        )
      }
    })

    return particle
  }
})

scene.add(background, ps)

game.loadScene(scene)
