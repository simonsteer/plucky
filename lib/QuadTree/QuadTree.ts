import { Bounds, QuadTreeChild } from './types'
import { getDoBoundsOverlap } from './utils'

export default class QuadTree<T extends any> {
  children: QuadTreeChild<T>[] = []
  outliers: QuadTreeChild<T>[] = []
  nodes: QuadTree<T>[] = []
  root: Bounds
  maxDepth: number
  maxChildren: number

  constructor(root: Bounds, maxDepth = 4, maxChildren = 4) {
    this.root = root
    this.maxDepth = maxDepth
    this.maxChildren = maxChildren
  }

  clear() {
    this.children = []
    this.outliers = []
    this.nodes = []
  }

  retrieve(query = this.root): QuadTreeChild<T>[] {
    if (this.nodes.length) {
      return this.nodes.reduce((acc, node) => {
        if (getDoBoundsOverlap(node.root, query)) {
          acc.push(...node.retrieve(query))
        }
        return acc
      }, [] as QuadTreeChild<T>[])
    }
    return [...this.children, ...this.outliers].filter(
      child => getDoBoundsOverlap(child, query)
    )
  }

  insert(child: QuadTreeChild<T>) {
    // QuadTree has been subdivided
    if (this.nodes.length) {
      const nodes = this.nodes.filter(node => getDoBoundsOverlap(node.root, child))
      if (nodes.length) {
        if (nodes.length > 1) {
          this.outliers.push(child)
          return
        }
        nodes[0].insert(child)
      }
      return
    }

    // QuadTree needs to be subdivided prior to insertion
    if (this.children.length === 4) {
      this.subdivide()
      this.insert(child)
      return
    }

    // QuadTree does not need subdividing, nor has been subdivided
    this.children.push(child)
  }

  subdivide() {
    const quadDimensions = {
      width: this.root.width / 2,
      height: this.root.height / 2
    }

    this.nodes = [
      new QuadTree<T>({
        x: this.root.x,
        y: this.root.y,
        ...quadDimensions
      }),
      new QuadTree<T>({
        x: this.root.x + quadDimensions.width,
        y: this.root.y,
        ...quadDimensions
      }),
      new QuadTree<T>({
        x: this.root.x + quadDimensions.width,
        y: this.root.y + quadDimensions.height,
        ...quadDimensions
      }),
      new QuadTree<T>({
        x: this.root.x,
        y: this.root.y + quadDimensions.height,
        ...quadDimensions
      }),
    ]
    this.children.forEach(child => this.insert(child))
    this.children = []
  }
}
