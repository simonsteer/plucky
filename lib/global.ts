export type Optional<T extends {}, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>
