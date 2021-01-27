import { JSONCoords } from "./types"

export default class Point {
  x: number
  y: number

  constructor({ x, y }: JSONCoords) {
    this.x = x
    this.y = y
  }

  static magnitude(point: JSONCoords) {
    return Math.sqrt(point.x * point.x + point.y * point.y)
  }
  magnitude() {
    return Point.magnitude(this.raw)
  }

  static normalize(point: JSONCoords) {
    const magnitude = Point.magnitude(point)
    if (magnitude > 0) {
      return Point.divide(point, magnitude)
    }
    return point
  }
  normalize() {
    const { x, y } = Point.normalize(this)
    this.x = x
    this.y = y
    return this
  }

  static add(pointA: JSONCoords, pointB: JSONCoords | number) {
    return {
      x: pointA.x + (typeof pointB === "number" ? pointB : pointB.x),
      y: pointA.y + (typeof pointB === "number" ? pointB : pointB.y)
    }
  }
  add(point: JSONCoords | number) {
    const { x, y } = Point.add(this, point)
    this.x = x
    this.y = y
    return this
  }

  static subtract(pointA: JSONCoords, pointB: JSONCoords | number) {
    return {
      x: pointA.x - (typeof pointB === "number" ? pointB : pointB.x),
      y: pointA.y - (typeof pointB === "number" ? pointB : pointB.y)
    }
  }
  subtract(point: JSONCoords | number) {
    const { x, y } = Point.subtract(this, point)
    this.x = x
    this.y = y
    return this
  }

  static multiply(pointA: JSONCoords, pointB: JSONCoords | number) {
    return {
      x: pointA.x * (typeof pointB === "number" ? pointB : pointB.x),
      y: pointA.y * (typeof pointB === "number" ? pointB : pointB.y)
    }
  }
  multiply(point: JSONCoords | number) {
    const { x, y } = Point.multiply(this, point)
    this.x = x
    this.y = y
    return this
  }

  static divide(pointA: JSONCoords, pointB: JSONCoords | number) {
    return {
      x: pointA.x / (typeof pointB === "number" ? pointB : pointB.x),
      y: pointA.y / (typeof pointB === "number" ? pointB : pointB.y)
    }
  }
  divide(point: JSONCoords | number) {
    const { x, y } = Point.divide(this, point)
    this.x = x
    this.y = y
    return this
  }

  static mod(pointA: JSONCoords, pointB: JSONCoords | number) {
    return {
      x: pointA.x % (typeof pointB === "number" ? pointB : pointB.x),
      y: pointA.y % (typeof pointB === "number" ? pointB : pointB.y)
    }
  }
  mod(point: JSONCoords | number) {
    const { x, y } = Point.mod(this, point)
    this.x = x
    this.y = y
    return this
  }

  static exp(pointA: JSONCoords, pointB: JSONCoords | number) {
    return {
      x: pointA.x ** (typeof pointB === "number" ? pointB : pointB.x),
      y: pointA.y ** (typeof pointB === "number" ? pointB : pointB.y)
    }
  }
  exp(point: JSONCoords | number) {
    const { x, y } = Point.exp(this, point)
    this.x = x
    this.y = y
    return this
  }

  static hash({ x, y }: JSONCoords) {
    return `${x},${y}`
  }
  get hash() {
    return Point.hash(this)
  }

  static parse(hash: string) {
    const [x, y] = hash.split(",").map(Number)
    return new Point({ x, y })
  }

  static match(pointA: JSONCoords, pointB: JSONCoords) {
    return (["x", "y"] as const).every(axis => pointA[axis] === pointB[axis])
  }
  match = (otherPoint: JSONCoords) => Point.match(this, otherPoint)

  static hashMany(...points: JSONCoords[]) {
    return points.map(Point.hash)
  }

  static parseMany(...hashes: string[]) {
    return hashes.map(Point.parse)
  }

  get raw() {
    return { x: this.x, y: this.y }
  }
}
