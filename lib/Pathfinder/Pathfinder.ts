import { XYCoords, JSONCoords } from '../XYCoords'
import Queue from './PriorityQueue'
import removeDeepFromMap from './removeDeepFromMap'
import toDeepMap from './toDeepMap'
import { PathfinderMap, PathfinderObject } from './types'

/** Creates and manages a graph */
export default class Pathfinder {
  graph: PathfinderMap
  constructor(graph?: PathfinderMap | PathfinderObject) {
    if (graph instanceof Map) {
      this.graph = graph
    } else if (graph) {
      this.graph = toDeepMap(graph)
    } else {
      this.graph = new Map()
    }
  }

  addNode(name: string, neighbors: PathfinderMap | PathfinderObject) {
    const nodes = neighbors instanceof Map ? neighbors : toDeepMap(neighbors)
    this.graph.set(name, nodes)

    return this
  }

  removeNode(key: string) {
    this.graph = removeDeepFromMap(this.graph, key)
    return this
  }

  find(
    start: JSONCoords,
    goal: JSONCoords
  ): { path: null | JSONCoords[]; cost: number } {
    // Don't run when we don't have nodes set
    if (!this.graph.size) {
      console.log('nograph')
      return { path: null, cost: 0 }
    }

    const from = XYCoords.hash(start)
    const to = XYCoords.hash(goal)

    const explored = new Set<string>()
    const frontier = new Queue()
    const previous = new Map<string, string>()

    let path: JSONCoords[] = []
    let totalCost = 0

    // Add the starting point to the frontier, it will be the first node visited
    frontier.set(from, 0)

    // Run until we have visited every node in the frontier
    while (!frontier.empty) {
      // Get the node in the frontier with the lowest cost (`priority`)
      const node = frontier.next()!

      // When the node with the lowest cost in the frontier in our goal node,
      // we can compute the path and exit the loop
      if (node.key === to) {
        // Set the total cost to the current value
        totalCost = node.priority

        let nodeKey = node.key
        while (previous.has(nodeKey)) {
          path.push(XYCoords.parse(nodeKey))
          nodeKey = previous.get(nodeKey)!
        }

        break
      }

      // Add the current node to the explored set
      explored.add(node.key)

      // Loop all the neighboring nodes
      const neighbors = (this.graph.get(node.key) || new Map()) as Map<
        string,
        number
      >
      neighbors.forEach((cost, nNode) => {
        // If we already explored the node, or the node is to be avoided, skip it
        if (explored.has(nNode)) return

        // If the neighboring node is not yet in the frontier, we add it with
        // the correct cost
        if (!frontier.has(nNode)) {
          previous.set(nNode, node.key)
          frontier.set(nNode, node.priority + cost)
          return
        }

        const frontierPriority = frontier.get(nNode)!.priority
        const nodeCost = node.priority + cost

        // Otherwise we only update the cost of this node in the frontier when
        // it's below what's currently set
        if (nodeCost < frontierPriority) {
          previous.set(nNode, node.key)
          frontier.set(nNode, nodeCost)
        }
      })
    }

    // Return null when no path can be found
    if (!path.length) {
      return { path: null, cost: 0 }
    }

    // From now on, keep in mind that `path` is populated in reverse order,
    // from destination to origin

    // Add the origin waypoint at the end of the array
    path.push(start)

    // Reverse the path so the result will be
    // from `start` to `goal`
    path.reverse()

    // Return an object if we also want the cost
    return { path, cost: totalCost }
  }
}
