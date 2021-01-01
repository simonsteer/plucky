import { JSONCoords } from '../XYCoords'

export type Bounds = {
  x: number
  y: number
  width: number
  height: number
}

export type QuadTreeChild<Data extends any = any> = Bounds & {
  data: Data
}
