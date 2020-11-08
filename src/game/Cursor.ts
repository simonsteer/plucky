import { Entity, Game, SpriteSheet } from '../../lib'
import cursorSprite from '../assets/cursor.png'
import { Grid } from '../lib/Grid'
import { animateEntityMovement } from './utils'
import { getEntityFromCoords } from '../utils/events'

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
  entities = ([
    ['lower', 'lower'],
    ['upper', 'lower'],
    ['lower', 'upper'],
    ['upper', 'upper'],
  ] as const).map(
    (subtype, i) =>
      new Entity({
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

  constructor(grid: Grid) {
    this.grid = grid
    this.entities.forEach(entity => this.grid.add(entity))
  }

  get origin() {
    return this.entities[0].origin
  }

  show = () => {
    this.entities.forEach(entity => (entity.spriteOpacity = 1))
    return this
  }

  hide = () => {
    this.entities.forEach(entity => (entity.spriteOpacity = 0))
    return this
  }

  selectedEntity?: Entity
  select(selectedEntity: Entity) {
    if (!selectedEntity.spriteSheet) {
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
    this.entities.forEach(cursorEntity => {
      const [xBound, yBound] = cursorEntity.metadata.subtype as [string, string]
      const destination = { x: bounds.x[xBound], y: bounds.y[yBound] }
      animateEntityMovement(this.grid.game, cursorEntity, [destination], 5)
    })
  }

  reselect = () => {
    const entity = getEntityFromCoords(this.grid, this.origin)
    if (entity) {
      this.select(entity)
    }
  }
}
