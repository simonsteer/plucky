import { minMax } from "../utils"
import { Game } from "../Game"
import { JSONCoords, Point } from "../Point"
import Particle from "./Particle"

export default class ParticleSystem {
  interval: number
  game: Game
  spawn: () => Particle
  particles: Particle[] = []
  max: number
  min: number
  paused = false

  constructor(
    game: Game,
    {
      spawn,
      max,
      min = 0,
      interval = 0
    }: { spawn: () => Particle; max: number; min?: number; interval?: number }
  ) {
    this.game = game
    this.spawn = spawn
    this.interval = interval
    this.max = max
    this.min = min
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
      const direction = new Point(attractor).subtract(particle.position)
      const distance = minMax(direction.magnitude(), 1, 100)
      const force = power / distance ** 2

      const attractForce = direction.normalize().multiply(force)
      particle.applyForce(attractForce)
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

    if (performance.now() - this.timestamp < this.interval) {
      return
    }
    this.timestamp = performance.now()

    if (this.particles.length < this.max) {
      this.particles.push(this.spawn())
    }
  }

  render() {
    this.mapParticles(particle => particle.render())
  }
}
