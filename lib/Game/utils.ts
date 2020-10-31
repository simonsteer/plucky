import Game from './Game'

export function link<R extends any>(game: Game, to: R): R {
  return new Proxy(to as any, {
    construct(Klass, args) {
      const instance = new Klass(...args)
      instance.game = game
      return instance
    },
  })
}

export const getCoordinatesFromClick = (
  eventX: number,
  eventY: number,
  cellSize: number
) => {
  const x = Math.floor(eventX / cellSize)
  const y = Math.floor(eventY / cellSize)
  return { x, y }
}
