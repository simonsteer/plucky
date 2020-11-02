import { DeltaConstraint } from '../DeltaConstraint'
import { SpriteSheet } from '../SpriteSheet'
import { JSONCoords } from '../XYCoords'

export interface EntityMetadata {
  type: string
}

export type EntityConfig<Metadata extends EntityMetadata> = {
  footprint: DeltaConstraint
  origin: JSONCoords
  sprite?: { sheet: SpriteSheet; frames: number[] }
  metadata: Metadata
}
