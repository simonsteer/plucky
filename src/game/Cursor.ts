import { DeltaConstraint, Easing, Entity, SpriteSheet } from '../../lib'
import cursorSprite from '../assets/cursor.png'
import { Grid } from '../lib/Grid'
import { animateEntityMovement } from './utils'
import { getEntityFromCoords } from '../utils/events'
import { game } from '..'
import GridEntity from '../lib/GridEntity'

const cursorSpriteSheet = new SpriteSheet({
  src: cursorSprite,
  numFrames: 4,
  states: {
    default: [0],
    lowerlower: [0],
    upperlower: [1],
    upperupper: [3],
    lowerupper: [2],
  },
})

export default class Cursor {
  grid: Grid
  entities: GridEntity[]

  constructor(grid: Grid) {
    this.grid = grid
    this.entities = ([
      ['lower', 'lower'],
      ['upper', 'lower'],
      ['lower', 'upper'],
      ['upper', 'upper'],
    ] as const).map(
      (subtype, i) =>
        new GridEntity(game, {
          grid,
          footprint: new DeltaConstraint([{ x: 0, y: 0 }]),
          origin: { x: 0, y: 0 },
          spriteSheet: cursorSpriteSheet,
          spriteState: subtype.join(''),
          spriteXOffset: [1, 3].includes(i) ? 1 : 0,
          spriteYOffset: [2, 3].includes(i) ? 1 : 0,
          metadata: { type: 'cursor', subtype },
          renderLayer: 2,
          spriteOpacity: 0,
        })
    )
    this.entities.forEach(entity => this.grid.add(entity))
  }

  get origin() {
    return this.entities[0].origin
  }

  opacity = 0
  show() {
    this.entities.forEach(entity => (entity.spriteOpacity = 1))
    return this
  }
  hide() {
    this.entities.forEach(entity => (entity.spriteOpacity = 0))
    return this
  }

  selectedEntity?: Entity
  async select(selectedEntity: GridEntity) {
    // return a promise if we need to wait for selection animation to finish
    return new Promise(resolve => {
      if (!selectedEntity.spriteSheet) {
        // if there's nothing to animate, resolve the promise
        resolve()
        return
      }

      const bounds = {
        x: {
          lower: selectedEntity.origin.x,
          upper:
            selectedEntity.origin.x +
            selectedEntity.spriteSheet!.frameWidth -
            cursorSpriteSheet.frameWidth,
        },
        y: {
          lower: selectedEntity.origin.y,
          upper:
            selectedEntity.origin.y +
            selectedEntity.spriteSheet!.frameHeight -
            cursorSpriteSheet.frameHeight,
        },
      }

      this.selectedEntity = selectedEntity

      this.entities.forEach((cursorEntity, index) => {
        const [xBound, yBound] = cursorEntity.metadata.subtype as [
          string,
          string
        ]
        const destination = { x: bounds.x[xBound], y: bounds.y[yBound] }
        animateEntityMovement({
          entity: cursorEntity,
          path: [destination],
          stepDuration: 75,
          easing: Easing.easeInSin,
        }).then(() => {
          // when all cursors have finished animating, we can resolve the promise
          if (index === 3) resolve()
        })
      })
    })
  }

  reselect() {
    const entity = getEntityFromCoords(this.grid, this.origin)
    if (entity) {
      this.select(entity)
    }
  }
}
