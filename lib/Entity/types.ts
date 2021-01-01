import { JSONCoords } from '../XYCoords'

export interface EntityConfig {
  metadata?: any
  renderLayer?: number
  origin: JSONCoords
  render?: () => void
}
