export interface EntityConfig<Metadata extends {}> {
  metadata?: Metadata
  renderLayer?: number
  render?: () => void
  update?: () => void
}
