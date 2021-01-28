import { minMax } from "../utils"
import { Game } from "../Game"
import { JSONCoords, Point } from "../Point"
import Particle from "./Particle"

export default class ParticleSystem {
  spawnInterval: number
  viscosity: number
  game: Game
  spawn: () => Particle
  particles: Particle[] = []
  paused = false

  constructor(
    game: Game,
    {
      spawn,
      spawnInterval = 0,
      viscosity = 0.9
    }: { spawn: () => Particle; spawnInterval?: number; viscosity?: number }
  ) {
    this.game = game
    this.spawn = spawn
    this.spawnInterval = spawnInterval
    this.viscosity = viscosity
  }

  mapParticles<R extends any>(
    callback: (particle: Particle, index: number) => R
  ) {
    return this.particles.map(callback)
  }

  applyRepeller(repeller: JSONCoords, power: number) {
    this.applyAttractor(repeller, -power)
  }

  // TODO: what might this look like if the attractor had shape/size?
  applyAttractor(attractor: JSONCoords, power: number) {
    this.mapParticles(particle => {
      const direction = Point.subtract(attractor, particle.position.raw)
      const distance = minMax(Point.magnitude(direction), 1, 100)
      const force = power / distance ** 2

      const attractionForce = Point.multiply(Point.normalize(direction), force)
      particle.applyForce(attractionForce)
    })
    return this
  }

  applyForce(force: JSONCoords) {
    this.mapParticles(particle => particle.applyForce(force))
    return this
  }

  applyGravity(gravity: JSONCoords) {
    this.mapParticles(particle => {
      const gravityForce = Point.multiply(gravity, particle.mass)
      particle.applyForce(gravityForce)
    })
    return this
  }

  run() {
    this.update()
    this.render()
  }

  pause() {
    this.paused = true
    return this
  }

  continue() {
    this.paused = false
    return this
  }

  timestamp = performance.now()
  update() {
    if (this.paused) return

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i]
      particle.update()
      if (particle.dead) {
        this.particles.splice(i, 1)
      }
    }

    const elapsed = performance.now() - this.timestamp
    if (elapsed >= this.spawnInterval) {
      this.timestamp = performance.now()
      this.particles.push(this.spawn())
    }
  }

  render() {
    this.mapParticles(particle => particle.render())
  }
}
