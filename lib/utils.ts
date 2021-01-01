type Func = (...args: any) => any

export function memoize<F extends Func>(
  fn: F,
  hashingMethod: (...args: Parameters<F>) => string,
  cacheSize = 100
): F {
  const relevancy: string[] = []
  const cache = new Map<string, ReturnType<F>>()

  return new Proxy(fn, {
    apply(target, _, args) {
      const hash = hashingMethod(...args)

      let data = cache.get(hash)
      if (data) {
        const index = relevancy.indexOf(hash)
        relevancy.splice(index, 1)
      } else {
        if (cache.size === cacheSize) {
          const leastRelevant = relevancy[relevancy.length - 1]
          cache.delete(leastRelevant)
          relevancy.splice(cacheSize - 1)
        }
        data = target(...args)
        cache.set(hash, data as ReturnType<F>)
      }

      relevancy.unshift(hash)
      return data
    },
  })
}
