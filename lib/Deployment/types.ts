import { Grid } from '../Grid'
import { Unit } from '../Unit'

export type DeploymentData = {
  type: 'deployment'
  unit: Unit
  grid: Grid
}
