import { JSONCoords } from './types'

export default class XYCoords {
  x: number
  y: number

  constructor({ x, y }: JSONCoords) {
    this.x = x
    this.y = y
  }

  static deltas(coordsA: JSONCoords, coordsB: JSONCoords) {
    return {
      x: coordsA.x - coordsB.x,
      y: coordsA.y - coordsB.y,
    }
  }

  static hash({ x, y }: JSONCoords) {
    return `${x},${y}`
  }

  static parse(hash: string) {
    const [x, y] = hash.split(',').map(Number)
    return new XYCoords({ x, y })
  }

  static match(coords_a: JSONCoords, coords_b: JSONCoords) {
    return (['x', 'y'] as const).every(
      axis => coords_a[axis] === coords_b[axis]
    )
  }

  static hashMany(...coords: JSONCoords[]) {
    return coords.map(XYCoords.hash)
  }

  static parseMany(...hashes: string[]) {
    return hashes.map(XYCoords.parse)
  }

  match = (other_coords: JSONCoords) => XYCoords.match(this, other_coords)

  get raw() {
    return { x: this.x, y: this.y }
  }

  get hash() {
    return XYCoords.hash(this)
  }

  deltas(coordinates: JSONCoords) {
    return XYCoords.deltas(this, coordinates)
  }
}
