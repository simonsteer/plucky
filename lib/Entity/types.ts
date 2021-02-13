import { JSONCoords } from "../Point"

export interface Entity {
  id: string
  origin: JSONCoords
  render?: () => void
  update?: () => void
}
