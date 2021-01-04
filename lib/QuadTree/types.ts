export type Bounds = {
  x: number,
  y: number
  width: number
  height: number
}

export type QuadTreeChild<T extends any> = Bounds & { metadata: T }