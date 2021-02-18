import { memoize } from "../utils"
import { Point, JSONCoords } from "../Point"

export default class DeltaConstraint {
  timestamp = 0

  private lookupMap: {
    [x: string]: {
      [y: string]: true
    }
  } = {}
  private deltas: JSONCoords[] = []

  constructor(deltas: JSONCoords[]) {
    this.init(deltas)
  }

  update(
    incomingDeltas:
      | JSONCoords[]
      | ((currentDeltas: JSONCoords[]) => JSONCoords[])
  ) {
    const newDeltas =
      typeof incomingDeltas === "function"
        ? incomingDeltas(this.deltas)
        : incomingDeltas

    this.init(newDeltas)
  }

  get length() {
    return this.deltas.length
  }

  dimensions = memoize(
    () => {
      const xValues = this.deltas.map(c => c.x)
      const yValues = this.deltas.map(c => c.y)

      return {
        width: Math.max(...xValues) - Math.min(...xValues) + 1,
        height: Math.max(...yValues) - Math.min(...yValues) + 1
      }
    },
    () => `${this.timestamp}`,
    1
  )

  adjacent = memoize(
    (coords: JSONCoords) =>
      this.deltas.map(d => new Point({ x: coords.x + d.x, y: coords.y + d.y })),
    coords => [Point.hash(coords), this.timestamp].join()
  )

  applies = memoize(
    (coordsA: JSONCoords, coordsB: JSONCoords) => {
      const { x, y } = Point.subtract(coordsA, coordsB)
      return !!this.lookupMap[x]?.[y]
    },
    (a, b) => [Point.hash(a), Point.hash(b), this.timestamp].join()
  )

  private init(deltas: JSONCoords[]) {
    this.timestamp++

    this.lookupMap = {}
    this.deltas = deltas
    this.deltas.forEach(({ x, y }) => {
      if (!this.lookupMap[x]) this.lookupMap[x] = {}
      this.lookupMap[x][y] = true
    })
  }
}
