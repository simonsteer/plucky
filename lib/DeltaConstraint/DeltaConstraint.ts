import { XYCoords, JSONCoords } from '../XYCoords'

export default class DeltaConstraint {
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

  getDimensions() {
    const xValues = this.deltas.map(c => c.x)
    const yValues = this.deltas.map(c => c.y)

    return {
      width: Math.max(...xValues) - Math.min(...xValues) + 1,
      height: Math.max(...yValues) - Math.min(...yValues) + 1,
    }
  }

  adjacent = (coords: JSONCoords) =>
    this.deltas.map(d => new XYCoords({ x: coords.x + d.x, y: coords.y + d.y }))

  applies = (coords_a: JSONCoords, coords_b: JSONCoords) => {
    const { x, y } = XYCoords.deltas(coords_a, coords_b)
    return !!this.lookupMap[x]?.[y]
  }

  private init(deltas: JSONCoords[]) {
    this.lookupMap = {}
    this.deltas = deltas
    this.deltas.forEach(({ x, y }) => {
      if (!this.lookupMap[x]) this.lookupMap[x] = {}
      this.lookupMap[x][y] = true
    })
  }
}
