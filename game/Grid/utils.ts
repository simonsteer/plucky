import { GridConfig } from './types'

export function getGridDimensions(tileRows: GridConfig['tiles']) {
  const [firstRow, ...restRows] = tileRows

  const gridWidth = firstRow.length
  const isValid = restRows.every(row => row.length === gridWidth)

  if (!isValid) {
    return { width: 0, height: 0 }
  }

  return {
    width: gridWidth,
    height: tileRows.length,
  }
}
