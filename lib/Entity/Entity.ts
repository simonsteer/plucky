import { v4 as uuid } from "uuid"
import { Game } from "../Game"
import { EntityConfig } from "./types"

export default class Entity<Metadata extends {} = {}> {
  id = uuid()
  metadata: Metadata
  game: Game
  renderLayer: number

  constructor(
    game: Game,
    {
      metadata = {} as Metadata,
      renderLayer = 0,
      render,
      update
    } = {} as EntityConfig<Metadata>
  ) {
    this.game = game
    this.metadata = metadata
    this.renderLayer = renderLayer
    if (render) this.render = render
    if (update) this.update = update
  }

  render() {}
  update() {}
}
