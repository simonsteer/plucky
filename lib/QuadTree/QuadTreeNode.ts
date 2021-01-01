import { Bounds, QuadTreeChild } from './types'
import { JSONCoords } from '../XYCoords/types'

export default class QuadTreeNode<Data extends any = any> {
  static TOP_LEFT = 0
  static TOP_RIGHT = 1
  static BOTTOM_LEFT = 2
  static BOTTOM_RIGHT = 3

  _bounds: Bounds
  _maxChildren: number
  _maxDepth: number
  _depth = 0
  children: QuadTreeChild<Data>[] = []
  nodes: QuadTreeNode<Data>[] = []
  Klass: typeof QuadTreeNode

  constructor(bounds: Bounds, depth?: number, maxDepth = 4, maxChildren = 4) {
    this._bounds = bounds
    if (maxChildren !== undefined) this._maxChildren = maxChildren
    if (maxDepth !== undefined) this._maxDepth = maxDepth
    if (depth !== undefined) this._depth = depth
    this.Klass = QuadTreeNode
  }

  retrieve = (item: Bounds): QuadTreeChild<Data>[] => {
    if (this.nodes.length) {
      const index = this.findIndex(item)
      return this.nodes[index].retrieve(item)
    }
    return this.children
  }

  insert = (item: QuadTreeChild<Data>) => {
    if (this.nodes.length) {
      const index = this.findIndex(item)
      this.nodes[index].insert(item)
      return
    }

    this.children.push(item)
    if (
      !(this._depth >= this._maxDepth) &&
      this.children.length > this._maxChildren
    ) {
      this.subdivide()
      for (let i = 0; i < this.children.length; i++) {
        this.insert(this.children[i])
      }
      this.children.length = 0
    }
  }

  subdivide = () => {
    const depth = this._depth + 1
    const width = this._bounds.width / 2
    const height = this._bounds.height / 2

    this.nodes[QuadTreeNode.TOP_LEFT] = new this.Klass(
      { x: this._bounds.x, y: this._bounds.y, width, height },
      depth,
      this._maxDepth,
      this._maxChildren
    )
    this.nodes[QuadTreeNode.TOP_RIGHT] = new this.Klass(
      { x: this._bounds.x + width, y: this._bounds.y, width, height },
      depth,
      this._maxDepth,
      this._maxChildren
    )
    this.nodes[QuadTreeNode.BOTTOM_LEFT] = new this.Klass(
      { x: this._bounds.x, y: this._bounds.y + height, width, height },
      depth,
      this._maxDepth,
      this._maxChildren
    )
    this.nodes[QuadTreeNode.BOTTOM_RIGHT] = new this.Klass(
      { x: this._bounds.x + width, y: this._bounds.y + height, width, height },
      depth,
      this._maxDepth,
      this._maxChildren
    )
  }

  clear = () => {
    this.children = []
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].clear()
    }
    this.nodes = []
  }

  findIndex = (coords: JSONCoords) => {
    const left = coords.x <= this._bounds.x + this._bounds.width / 2
    const top = coords.y <= this._bounds.y + this._bounds.height / 2

    if (left) {
      if (top) {
        return QuadTreeNode.TOP_LEFT
      }
      return QuadTreeNode.BOTTOM_LEFT
    } else {
      if (top) {
        return QuadTreeNode.TOP_RIGHT
      }
      return QuadTreeNode.BOTTOM_RIGHT
    }
  }
}
