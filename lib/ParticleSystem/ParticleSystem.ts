import { v4 as uuid } from "uuid"
import { minMax } from "../utils"
import { JSONCoords, Point } from "../Point"
import Particle from "./Particle"
import { Scene } from "../Scene"

export default class ParticleSystem {
  spawnInterval: number
  viscosity: number
  scene: Scene
  spawn: () => Particle
  particles: Particle[] = []
  paused = false
  origin: JSONCoords
  id: string

  constructor(
    scene: Scene,
    {
      spawn,
      spawnInterval = 0,
      viscosity = 0.9,
      origin,
      update,
      id
    }: {
      id?: string
      spawn: () => Particle
      spawnInterval?: number
      viscosity?: number
      origin: JSONCoords
      update?(): void
    }
  ) {
    if (update) {
      this.update = () => {
        update()
        this._update()
      }
    }
    this.id = id || uuid()
    this.origin = origin
    this.scene = scene
    this.spawn = spawn
    this.spawnInterval = spawnInterval
    this.viscosity = viscosity
  }

  applyRepeller(repeller: JSONCoords, power: number) {
    this.applyAttractor(repeller, -power)
  }

  // TODO: what might this look like if the attractor had shape/size?
  applyAttractor(attractor: JSONCoords, power: number) {
    this.particles.forEach(particle => {
      const direction = Point.subtract(attractor, particle.origin.raw)
      const distance = minMax(Point.magnitude(direction), 1, 100)
      const force = power / distance ** 2

      const attractionForce = Point.multiply(Point.normalize(direction), force)
      particle.applyForce(attractionForce)
    })
    return this
  }

  applyForce(force: JSONCoords) {
    this.particles.forEach(particle => particle.applyForce(force))
    return this
  }

  applyGravity(gravity: JSONCoords) {
    this.particles.forEach(particle => {
      const gravityForce = Point.multiply(gravity, particle.mass / 1000)
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

  render() {
    this.particles.forEach(particle => particle.render())
  }

  update() {
    this._update()
  }

  timestamp = performance.now()
  private _update() {
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

      const particle = this.spawn()
      particle.origin = new Point(this.origin)

      this.particles.push(particle)
    }
  }
}
