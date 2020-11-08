import { DeltaConstraint, SpriteSheet } from '../../../lib'
import { Grid } from '../Grid'
import { Team } from '../Team'
import { UnitConfig } from './types'

export default class Unit {
  movement: {
    footprint: DeltaConstraint
    pattern: DeltaConstraint
    steps: number
  }
  team: Team
  sprite: SpriteSheet

  constructor({
    team,
    movement: {
      footprint = new DeltaConstraint([{ x: 0, y: 0 }]),
      pattern = new DeltaConstraint([
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: 1 },
      ]),
      steps = 1,
    } = {},
    sprite,
  }: UnitConfig) {
    this.sprite = sprite
    team.enlistUnit(this)
    this.movement = { footprint, pattern, steps }
  }

  canDeploy = (grid: Grid, x: number, y: number) => {
    const originWithinBounds = grid.withinBounds({ x, y })
    const footprintWithinBounds = this.movement.footprint
      .adjacent({ x, y })
      .every(grid.withinBounds)

    return originWithinBounds && footprintWithinBounds
  }
}