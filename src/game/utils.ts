import { Entity, JSONCoords } from '../../lib'

const activeAnimations: { [key: number]: number } = {}
let animationIndex = 0

export const animateEntityMovement = ({
  entity,
  path,
  stepDuration = 75,
  easing = n => n,
}: {
  easing?: (n: number) => number
  stepDuration: number
  entity: Entity
  path: JSONCoords[]
}) => {
  animationIndex++
  const entityAnimation = animationIndex
  activeAnimations[entity.id] = entityAnimation

  let done = false
  const updateEntityCoords = (
    [x, y]: number[],
    progress: number,
    index: number
  ) => {
    entity.origin.x = x
    entity.origin.y = y

    if (
      activeAnimations[entity.id] !== entityAnimation ||
      (progress === 1 && index === path.length - 1)
    ) {
      done = true
    }
  }

  return new Promise<void>(async resolve => {
    for (let index = 0; index < path.length; index++) {
      const target = path[index]

      await entity.game.loop.tween(
        {
          inputs: [entity.origin.x, entity.origin.y],
          outputs: [target.x, target.y],
          duration: stepDuration,
          easing,
        },
        ([x, y], progress) => {
          updateEntityCoords([x, y], progress, index)
          if (done) resolve()
        }
      )
      if (done) {
        break
      }
    }
  })
}
