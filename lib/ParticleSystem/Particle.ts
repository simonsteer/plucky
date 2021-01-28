import { JSONCoords, Point } from "../Point"

export default class Particle {
  lifespan: number
  timestamp: number
  mass: number
  weight: number
  velocity: Point
  acceleration: Point
  position: Point
  render: () => void

  constructor({
    lifespan,
    position,
    velocity,
    acceleration,
    mass,
    weight,
    render
  }: {
    lifespan: number
    position: JSONCoords
    velocity: JSONCoords
    acceleration: JSONCoords
    mass: number
    weight: number
    render: () => void
  }) {
    this.render = render
    this.lifespan = lifespan
    this.mass = mass
    this.weight = weight
    this.position = new Point(position)
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

  update() {
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)
  }

  applyForce(force: JSONCoords) {
    const forceVector = new Point(force)
    forceVector.divide(this.mass)
    this.acceleration.add(forceVector)
  }
}
