import { DijkstraMap, DijkstraObject } from './types'

export default function toDeepMap(source: DijkstraObject) {
  const map: DijkstraMap = new Map()
  const keys = Object.keys(source)

  keys.forEach(key => {
    const val = source[key]
    if (typeof val === 'number') {
      return map.set(key, val)
    }
    return map.set(key, toDeepMap(val))
  })

  return map
}
