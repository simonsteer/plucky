import { Grid } from '../Grid'
import { Unit } from '../Unit'

export type DeploymentMetadata = {
  type: 'deployment'
  unit: Unit
  grid: Grid
}
