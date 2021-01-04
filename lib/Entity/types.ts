import { JSONCoords } from '../XYCoords'

export interface EntityConfig {
  metadata?: any
  renderLayer?: number
  render?: () => void
  update?: () => void
}
