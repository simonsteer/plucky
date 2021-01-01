import QuadTreeNode from './QuadTreeNode'
import { QuadTreeChild } from './types'

export default class QuadTreeBoundsNode<
  Data extends any = any
> extends QuadTreeNode<Data> {
  stuckChildren: QuadTreeChild<Data>[] = []
  nodes: QuadTreeBoundsNode[] = []

  constructor(...args: ConstructorParameters<typeof QuadTreeNode>) {
    super(...args)
    this.Klass = QuadTreeBoundsNode
  }

  insert = (item: QuadTreeChild<Data>) => {
    if (this.nodes.length) {
      const index = this.findIndex(item)
      const node = this.nodes[index]

      const withinXBounds =
        item.x >= node._bounds.x &&
        item.x + item.width <= node._bounds.x + node._bounds.width

      const withinYBounds =
        item.y >= node._bounds.y &&
        item.y + item.height <= node._bounds.y + node._bounds.height

      const withinBounds = withinXBounds && withinYBounds
      if (withinBounds) {
        this.nodes[index].insert(item)
        return
      }

      this.stuckChildren.push(item)
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

  getChildren = () => this.children.concat(this.stuckChildren)

  retrieve = (item: QuadTreeChild<Data>) => {
    const out: any[] = []

    if (this.nodes.length) {
      var index = this.findIndex(item)
      var node = this.nodes[index]

      if (
        item.x >= node._bounds.x &&
        item.x + item.width <= node._bounds.x + node._bounds.width &&
        item.y >= node._bounds.y &&
        item.y + item.height <= node._bounds.y + node._bounds.height
      ) {
        out.push(...this.nodes[index].retrieve(item))
      } else {
        //Part of the item are overlapping multiple child nodes. For each of the overlapping nodes, return all containing objects.

        if (item.x <= this.nodes[QuadTreeNode.TOP_RIGHT]._bounds.x) {
          if (item.y <= this.nodes[QuadTreeNode.BOTTOM_LEFT]._bounds.y) {
            out.push.apply(
              out,
              this.nodes[QuadTreeNode.TOP_LEFT].getAllContent()
            )
          }

          if (
            item.y + item.height >
            this.nodes[QuadTreeNode.BOTTOM_LEFT]._bounds.y
          ) {
            out.push(...this.nodes[QuadTreeNode.BOTTOM_LEFT].getAllContent())
          }
        }

        if (
          item.x + item.width >
          this.nodes[QuadTreeNode.TOP_RIGHT]._bounds.x
        ) {
          //position+width bigger than middle x
          if (item.y <= this.nodes[QuadTreeNode.BOTTOM_RIGHT]._bounds.y) {
            out.push.apply(
              out,
              this.nodes[QuadTreeNode.TOP_RIGHT].getAllContent()
            )
          }

          if (
            item.y + item.height >
            this.nodes[QuadTreeNode.BOTTOM_RIGHT]._bounds.y
          ) {
            out.push.apply(
              out,
              this.nodes[QuadTreeNode.BOTTOM_RIGHT].getAllContent()
            )
          }
        }
      }
    }

    out.push(...this.stuckChildren)
    out.push(...this.children)

    return out
  }

  getAllContent = () => {
    const out: any[] = []
    if (this.nodes.length) {
      for (let i = 0; i < this.nodes.length; i++) {
        out.push(...this.nodes[i].getAllContent())
      }
    }
    out.push(...this.stuckChildren)
    out.push(...this.children)
    return out
  }

  clear = () => {
    this.stuckChildren = []
    super.clear.call(this)
  }
}
