import { DeltaConstraint } from '../DeltaConstraint'
import { SpriteSheet } from '../SpriteSheet'
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
