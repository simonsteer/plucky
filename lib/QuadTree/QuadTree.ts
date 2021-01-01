import QuadTreeBoundsNode from './QuadTreeBoundsNode'
import QuadTreeNode from './QuadTreeNode'
import { Bounds, QuadTreeChild } from './types'

export default class QuadTree<Data extends any = any> {
  root: QuadTreeNode

  constructor({
    bounds,
    contentType = 'bounds',
    maxDepth = 4,
    maxChildren = 4,
  }: {
    bounds: Bounds
    contentType?: 'bounds' | 'points'
    maxDepth?: number
    maxChildren?: number
  }) {
    if (contentType === 'bounds') {
      this.root = new QuadTreeBoundsNode(bounds, 0, maxDepth, maxChildren)
    } else {
      this.root = new QuadTreeNode(bounds, 0, maxDepth, maxChildren)
    }
  }

  insert = (item: QuadTreeChild<Data> | QuadTreeChild<Data>[]) => {
    if (Array.isArray(item)) {
      for (let i = 0; i < item.length; i++) {
        this.root.insert(item[i])
      }
      return
    }
    this.root.insert(item)
  }

  clear = () => this.root.clear()

  retrieve = (item: Bounds) => [...this.root.retrieve(item)]
}
