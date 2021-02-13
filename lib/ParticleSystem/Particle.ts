import { v4 as uuid } from "uuid"
import { Entity } from "../Entity"
import { JSONCoords, Point } from "../Point"

export interface ParticleConstructor extends Pick<Entity, "render"> {
  lifespan: number
  mass: number
  weight?: number
  velocity: JSONCoords
  acceleration: JSONCoords
}
export default class Particle {
  id: string
  timestamp: number
  origin: Point

  lifespan: number
  mass: number
  weight: number
  velocity: Point
  acceleration: Point

  constructor({
    render,
    acceleration,
    mass,
    weight = 1,
    lifespan,
    velocity
  }: ParticleConstructor) {
    if (render) this.render = render
    this.id = uuid()
    this.lifespan = lifespan
    this.mass = mass
    this.weight = weight
    this.velocity = new Point(velocity)
    this.acceleration = new Point(acceleration)
    this.timestamp = performance.now()
  }

  get density() {
    return this.mass / this.weight
  }

  get life() {
    return 1 - this.completion
  }

  get completion() {
    const elapsed = performance.now() - this.timestamp
    return Math.min(elapsed / this.lifespan, 1)
  }

  get dead() {
    return this.completion === 1
  }

  get alive() {
    return !this.dead
  }

  render() {}

  update() {
    this._update()
  }

  applyForce(force: JSONCoords) {
    const forceVector = new Point(force)
    forceVector.divide(this.mass)
    this.acceleration.add(forceVector)
  }

  private _update() {
    this.velocity.add(this.acceleration)
    this.origin.add(this.velocity)
  }
}
