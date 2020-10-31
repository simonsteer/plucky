import { XYCoords } from '../XYCoords'

export function mergeDeltas(
  strategy: keyof typeof MERGE_STRATEGIES,
  ...coords: { x: number; y: number }[][]
) {
  return MERGE_STRATEGIES[strategy](...coords)
}

const MERGE_STRATEGIES = {
  difference(...deltaSets: { x: number; y: number }[][]) {
    const difference = new Set<string>()
    const sets = deltaSets.map(
      collection => new Set(XYCoords.hashMany(...collection))
    )
    sets.forEach((set, index) => {
      const otherSets = sets.filter((_, otherIndex) => index !== otherIndex)
      ;[...set]
        .filter(value => !otherSets.some(otherSet => otherSet.has(value)))
        .forEach(value => difference.add(value))
    })
    return XYCoords.parseMany(...difference)
  },
  intersect(...deltaSets: { x: number; y: number }[][]) {
    const [firstCollection, ...restCollections] = deltaSets.map(set =>
      XYCoords.hashMany(...set)
    )
    if (!restCollections.length) {
      return XYCoords.parseMany(...firstCollection) || []
    }

    const sets = restCollections.map(collection => new Set(collection))
    return [...firstCollection]
      .filter(item => sets.every(set => set.has(item)))
      .map(hash => XYCoords.parse(hash))
  },
  union(...deltaSets: { x: number; y: number }[][]) {
    const union = new Set<string>()
    deltaSets.forEach(collection =>
      XYCoords.hashMany(...collection).forEach(item => union.add(item))
    )
    return [...union].map(hash => XYCoords.parse(hash))
  },
  exclude(...[firstSet, ...restSets]: { x: number; y: number }[][]) {
    const included = new Set<string>(XYCoords.hashMany(...firstSet))
    restSets.forEach(collection =>
      XYCoords.hashMany(...collection).forEach(hash => included.delete(hash))
    )
    return [...included].map(hash => XYCoords.parse(hash))
  },
}
