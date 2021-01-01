import { Easing, Entity, SpriteSheet } from '../../lib'
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
    topLeft: [0],
    topRight: [1],
    bottomLeft: [2],
    bottomRight: [3],
  },
})

type CursorCornerConfig = {
  corner: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  shadowOffsetX: number
  shadowOffsetY: number
  x: number
  y: number
}

export default class Cursor extends Entity {
  grid: Grid
  configs: CursorCornerConfig[] = [
    { corner: 'topLeft', shadowOffsetX: 0, shadowOffsetY: 0, x: 0, y: 0 },
    { corner: 'topRight', shadowOffsetX: 1, shadowOffsetY: 0, x: 0, y: 0 },
    { corner: 'bottomLeft', shadowOffsetX: 0, shadowOffsetY: 1, x: 0, y: 0 },
    { corner: 'bottomRight', shadowOffsetX: 1, shadowOffsetY: 1, x: 0, y: 0 },
  ]

  constructor(grid: Grid) {
    super(grid.game, { origin: { x: 0, y: 0 }, renderLayer: 10 })
    this.grid = grid
    this.grid.add(this)
  }

  opacity = 0
  show() {
    this.opacity = 1
    return this
  }
  hide() {
    this.opacity = 0
    return this
  }

  render() {
    this.configs.forEach((config, index) => {
      game.context.globalAlpha = this.opacity
      cursorSpriteSheet.render({
        game,
        x: this.origin.x + config.x + config.shadowOffsetX,
        y: this.origin.y + config.y + config.shadowOffsetY,
        instanceId: `${this.id}-${index}`,
        state: config.corner,
      })
    })
  }

  selectedEntity?: GridEntity
  async select(selectedEntity: GridEntity) {
    if (!selectedEntity.spriteSheet) return

    this.selectedEntity = selectedEntity

    await Promise.all([
      animateEntityMovement({
        entity: this,
        path: [selectedEntity.origin],
        stepDuration: 75,
        easing: Easing.easeInSin,
      }),
      ...this.configs.map(this.animateCursorCorner),
    ])
  }

  async reselect() {
    const entity = getEntityFromCoords(this.grid, this.origin)
    if (entity) {
      await this.select(entity)
    }
  }

  private animateCursorCorner = (config: CursorCornerConfig) => {
    if (!this.selectedEntity?.spriteSheet) return

    let outputs = [0, 0]
    switch (config.corner) {
      case 'topRight':
        outputs = [
          this.selectedEntity.spriteSheet.frameWidth -
            cursorSpriteSheet.frameWidth,
          0,
        ]
        break
      case 'bottomLeft':
        outputs = [
          0,
          this.selectedEntity.spriteSheet.frameHeight -
            cursorSpriteSheet.frameHeight,
        ]
        break
      case 'bottomRight':
        outputs = [
          this.selectedEntity.spriteSheet.frameWidth -
            cursorSpriteSheet.frameWidth,
          this.selectedEntity.spriteSheet.frameHeight -
            cursorSpriteSheet.frameHeight,
        ]
        break
      default:
        break
    }

    return this.game.loop.tween(
      {
        inputs: [config.x, config.y],
        outputs,
        id: `${this.id}-${config.corner}`,
        duration: 75,
        easing: Easing.easeInSin,
      },
      ([x, y]) => {
        config.x = x
        config.y = y
      }
    )
  }
}
