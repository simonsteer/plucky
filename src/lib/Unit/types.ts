import { DeltaConstraint, SpriteSheet } from '../../../lib'
import { Team } from '../Team'

export type UnitMovement = {
  footprint: DeltaConstraint
  steps: number
  pattern: DeltaConstraint
}

export type UnitConfig = {
  team: Team
  movement?: Partial<UnitMovement>
  sprite: SpriteSheet
}
