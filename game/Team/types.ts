import Team from './Team'

export type TeamRelationshipType =
  | 'friendly'
  | 'hostile'
  | 'neutral'
  | 'wildcard'

export type TeamConfig = Partial<{
  parent: Team
  hostile: Team[]
  friendly: Team[]
  neutral: Team[]
  wildcard: Team[]
}>
