import { Bounds, QuadTreeChild } from "./types"
import { getDoBoundsOverlap } from "./utils"

export default class QuadTree<T extends any> {
  children: QuadTreeChild<T>[] = []
  outliers: Set<QuadTreeChild<T>>
  nodes: QuadTree<T>[] = []
  bounds: Bounds
  depth: number
  maxDepth: number
  maxChildren: number
  parent: null | QuadTree<T>

  constructor(
    root: Bounds,
    {
      maxDepth = 4,
      maxChildren = 4,
      depth = 1,
      parent = null as null | QuadTree<T>
    } = {}
  ) {
    this.parent = parent
    if (this.parent === null) {
      this.outliers = new Set<QuadTreeChild<T>>()
    }
    this.bounds = root
    this.depth = depth
    this.maxDepth = maxDepth
    this.maxChildren = maxChildren
  }

  get root(): QuadTree<T> {
    return this.parent ? this.parent.root || this.parent : this
  }

  clear() {
    this.children = []
    this.root.outliers.clear()
    this.nodes = []
    return this
  }

  retrieve(query = this.bounds): QuadTreeChild<T>[] {
    if (this.nodes.length) {
      return [
        ...this.nodes.reduce((acc, node) => {
          if (getDoBoundsOverlap(node.bounds, query)) {
            node.retrieve(query).forEach(item => acc.add(item))
          }
          return acc
        }, new Set<QuadTreeChild<T>>())
      ]
    }
    return this.children.filter(child => getDoBoundsOverlap(child, query))
  }

  insert(...children: QuadTreeChild<T>[]) {
    children.forEach(this.insertChild)
    return this
  }

  private subdivide() {
    const quadDimensions = {
      width: this.bounds.width / 2,
      height: this.bounds.height / 2
    }

    const options = {
      depth: this.depth + 1,
      maxDepth: this.maxDepth,
      maxChildren: this.maxChildren,
      parent: this
    }

    this.nodes = [
      new QuadTree<T>(
        {
          x: this.bounds.x,
          y: this.bounds.y,
          ...quadDimensions
        },
        options
      ),
      new QuadTree<T>(
        {
          x: this.bounds.x + quadDimensions.width,
          y: this.bounds.y,
          ...quadDimensions
        },
        options
      ),
      new QuadTree<T>(
        {
          x: this.bounds.x + quadDimensions.width,
          y: this.bounds.y + quadDimensions.height,
          ...quadDimensions
        },
        options
      ),
      new QuadTree<T>(
        {
          x: this.bounds.x,
          y: this.bounds.y + quadDimensions.height,
          ...quadDimensions
        },
        options
      )
    ]
    this.children.forEach(child => this.insert(child))
    this.children = []
  }

  private insertChild = ({
    x,
    y,
    width = 0,
    height = 0,
    metadata
  }: Optional<QuadTreeChild<T>, "width" | "height">) => {
    const child = { x, y, width, height, metadata }

    // QuadTree has been subdivided
    if (this.nodes.length) {
      this.nodes.forEach(node => {
        if (getDoBoundsOverlap(node.bounds, child)) {
          node.insert(child)
        }
      })
      return
    }

    // QuadTree contains max children
    if (this.children.length === this.maxChildren) {
      // Max depth has not been reached
      if (this.depth !== this.maxDepth) {
        this.subdivide()
        this.insert(child)
      } else {
        // max depth reached
        this.root.outliers.add(child)
      }
      return
    }

    // QuadTree does not need subdividing, nor has been subdivided
    this.children.push(child)
  }
}
