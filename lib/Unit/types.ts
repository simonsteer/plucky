import { DeltaConstraint } from '../DeltaConstraint'
import { EntityConfig, EntityMetadata } from '../Scene/types'
import { Team } from '../Team'

export type UnitMovement = {
  footprint: DeltaConstraint
  steps: number
  pattern: DeltaConstraint
}

export type UnitConfig = {
  team: Team
  movement?: Partial<UnitMovement>
  sprite?: EntityConfig<EntityMetadata>['sprite']
}
