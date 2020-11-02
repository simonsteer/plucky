import { PathfinderMap, PathfinderObject } from './types'

export default function toDeepMap(source: PathfinderObject) {
  const map: PathfinderMap = new Map()
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
