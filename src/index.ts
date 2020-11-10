import { Game } from '../lib'
import { handleSceneClicked, handleSceneMouseMove } from './utils/events'
import { Grid, GridConfig } from './lib/Grid'
import { forest, plains } from './game/terrain'
import { createFairy, createOgre } from './game/units'

const CELL_SIZE = 20

export const game = new Game({ canvasId: 'app', cellSize: CELL_SIZE })

const tiles = Array(10)
  .fill(null)
  .map((_, y) =>
    Array(10)
      .fill(null)
      .map((_, x) =>
        [3, 4, 5, 6].includes(x) && [3, 4, 5, 6].includes(y) ? forest : plains
      )
  ) as GridConfig['tiles']
const grid = new Grid({ game, tiles, cellSize: CELL_SIZE })

game.canvas.style.cursor = 'none'
game.loadScene(grid)
game.on(Game.Events.SceneClicked, handleSceneClicked)
game.on(Game.Events.SceneMouseMove, handleSceneMouseMove)

grid.deploy(createOgre(), 1, 1)
const fairy = grid.deploy(createFairy(), 4, 4)!

window['game'] = game
window['loop'] = game.loop
window['createOgre'] = createOgre
window['createFairy'] = createFairy
