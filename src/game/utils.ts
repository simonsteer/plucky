import { Entity, Game, JSONCoords } from '../../lib'

const activeAnimations: { [key: number]: number } = {}
let animationIndex = 0

export const animateEntityMovement = (
  game: Game,
  entity: Entity,
  path: JSONCoords[],
  speed = 2
) => {
  animationIndex++
  const entityAnimation = animationIndex
  activeAnimations[entity.id] = entityAnimation

  return new Promise<void>(resolve => {
    let index = 0
    game.loop.do(() => {
      if (activeAnimations[entity.id] !== entityAnimation) {
        resolve()
        return false
      }

      const target = path[index]

      if (entity.origin.x !== target.x) {
        const movingRight = target.x > entity.origin.x
        entity.origin.x = entity.origin.x + (movingRight ? speed : -speed)
        if (movingRight && entity.origin.x > target.x) {
          entity.origin.x = target.x
        }
        if (!movingRight && entity.origin.x < target.x) {
          entity.origin.x = target.x
        }
      }
      if (entity.origin.y !== target.y) {
        const movingDown = target.y > entity.origin.y
        entity.origin.y = entity.origin.y + (movingDown ? speed : -speed)
        if (movingDown && entity.origin.y > target.y) {
          entity.origin.y = target.y
        }
        if (!movingDown && entity.origin.y < target.y) {
          entity.origin.y = target.y
        }
      }
      if (entity.origin.x === target.x && entity.origin.y === target.y) {
        index += 1
      }

      const continueLoop = index !== path.length
      if (!continueLoop) {
        entity.origin.x = path[path.length - 1].x
        entity.origin.y = path[path.length - 1].y
        delete activeAnimations[entity.id]
        resolve()
      }

      return continueLoop
    })
  })
}
