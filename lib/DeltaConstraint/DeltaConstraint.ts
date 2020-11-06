import { memoize } from '../utils'
import { XYCoords, JSONCoords } from '../XYCoords'

export default class DeltaConstraint {
  private timestamp = 0

  private lookupMap: {
    [key: string]: {
      [key: string]: true
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
      typeof incomingDeltas === 'function'
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
        height: Math.max(...yValues) - Math.min(...yValues) + 1,
      }
    },
    () => `${this.timestamp}`
  )

  adjacent = memoize(
    (coords: JSONCoords) =>
      this.deltas.map(
        d => new XYCoords({ x: coords.x + d.x, y: coords.y + d.y })
      ),
    coords => [XYCoords.hash(coords), this.timestamp].join()
  )

  applies = memoize(
    (coords_a: JSONCoords, coords_b: JSONCoords) => {
      const { x, y } = XYCoords.deltas(coords_a, coords_b)
      return !!this.lookupMap[x]?.[y]
    },
    (a, b) => [XYCoords.hash(a), XYCoords.hash(b), this.timestamp].join()
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
