import { Game } from '../Game'
import { Grid } from '../Grid'
import { Team } from '../Team'

const PRE_START_INDEX = -1

export default class Battle {
  teams: Team[]
  grid: Grid
  private activeTeamIndex = -1
  private ended = false

  constructor({ grid, teams = grid.teams() }: { grid: Grid; teams?: Team[] }) {
    this.grid = grid
    this.teams = teams
  }

  get activeTeam(): Team | null {
    return this.teams[this.activeTeamIndex % this.teams.length] || null
  }

  get didStart() {
    return this.activeTeamIndex !== PRE_START_INDEX
  }

  get didEnd() {
    return this.ended
  }

  start() {
    if (this.activeTeamIndex === PRE_START_INDEX) {
      this.activeTeamIndex++
      this.grid.game.emit(Game.Events.BattleStart, this)
      this.advance()
    } else {
      console.error('.start() can only be called once per Battle instance')
    }
    return this
  }

  advance() {
    if (this.activeTeamIndex === PRE_START_INDEX) {
      console.error('Call .start() to begin the Battle')
      return
    }

    if (!this.didEnd && this.activeTeamIndex > 0) {
      this.grid.game.emit(Game.Events.BattleTurnEnd, this)
    }
    // this check is here twice in case a callback fired
    // by the game's EventEmitter calls Battle.end()
    if (this.didEnd) return

    let attempts = 0
    while (
      !this.activeTeam?.deployments(this.grid).length &&
      attempts <= this.teams.length
    ) {
      this.activeTeamIndex++
      attempts++
    }

    this.grid.game.emit(Game.Events.BattleTurnStart, this)
  }

  end() {
    this.ended = true
    this.grid.game.emit(Game.Events.BattleEnd, this)
  }
}
