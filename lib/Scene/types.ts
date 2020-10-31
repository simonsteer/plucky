import { DeltaConstraint } from '../DeltaConstraint'
import { SpriteSheet } from '../SpriteSheet'
import { JSONCoords } from '../XYCoords'

export type EntityConfig<Metadata extends {} = {}> = {
  footprint: DeltaConstraint
  origin: JSONCoords
  sprite?: { sheet: SpriteSheet; frames: number[] }
  metadata: Metadata
}
