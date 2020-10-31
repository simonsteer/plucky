import { Game } from '../Game'
import { Grid } from '../Grid'
import { Unit } from '../Unit'
import { TeamRelationshipType, TeamConfig } from './types'

export default class Team {
  game: Game

  parent?: Team
  hostile = new Set<Team>()
  friendly = new Set<Team>()
  children = new Set<Team>()

  private _units = new Set<Unit>()

  constructor(
    {
      parent,
      hostile = [],
      friendly = [],
      neutral = [],
      wildcard = [],
    } = {} as TeamConfig
  ) {
    this.changeRelationship(this, 'friendly')

    if (parent) {
      this.setParent(parent)
      this.changeRelationship(parent, 'friendly')
    }

    hostile.forEach(team => this.changeRelationship(team, 'hostile'))
    friendly.forEach(team => this.changeRelationship(team, 'friendly'))
    wildcard.forEach(team => this.changeRelationship(team, 'wildcard'))
    neutral.forEach(team => this.changeRelationship(team, 'neutral'))
  }

  units() {
    return [...this._units]
  }

  deployments(grid: Grid) {
    return grid.deployments().filter(d => d.unit.team === this)
  }

  enlistUnit = (unit: Unit) => {
    unit.team?._units.delete(unit)
    unit.team = this
    this._units.add(unit)
    return this
  }

  orphan() {
    this.parent?.children.delete(this)
    this.parent = undefined
    return this
  }

  setParent = (parent: Team) => {
    this.parent?.children.delete(this)
    parent.children.add(this)
    this.parent = parent
    return this
  }

  changeRelationship = (team: Team, relationship: TeamRelationshipType) => {
    switch (relationship) {
      case 'friendly':
        this.changeRelationship(team, 'neutral')
        this.friendly.add(team)
        team.friendly.add(this)
        break
      case 'hostile':
        this.changeRelationship(team, 'neutral')
        this.hostile.add(team)
        team.hostile.add(this)
        break
      case 'neutral':
        this.hostile.delete(team)
        this.friendly.delete(team)
        team.hostile.delete(this)
        team.friendly.delete(this)
        break
      case 'wildcard':
        this.hostile.add(team)
        this.friendly.add(team)
        team.hostile.add(this)
        team.friendly.add(this)
        break
      default:
        break
    }
    return this
  }

  progenitor = (): Team => this.parent?.progenitor() || this

  descendants = (): Team[] =>
    [...this.children].reduce((acc, child) => {
      acc.push(child, ...child.descendants())
      return acc
    }, [] as Team[])

  is = (team: Team, relationship: TeamRelationshipType) => {
    switch (relationship) {
      case 'neutral':
        return !this.is(team, 'friendly') && !this.is(team, 'hostile')
      case 'wildcard':
        return this.is(team, 'friendly') && this.is(team, 'hostile')
      case 'hostile':
        return this.hostile.has(team) || !!this.parent?.is(team, 'hostile')
      case 'friendly':
        return this.friendly.has(team) || !!this.parent?.is(team, 'friendly')
      default:
        break
    }
  }

  clone = (overrides = {} as TeamConfig) =>
    new Team({
      parent: this.parent,
      hostile: [...this.hostile],
      friendly: [...this.friendly],
      ...overrides,
    })
}
