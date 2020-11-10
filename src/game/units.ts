import { DeltaConstraint, SpriteSheet } from '../../lib'
import { Unit } from '../lib/Unit'
import { fairies, ogres } from './teams'
import { forest } from './terrain'
import fairySprite from '../assets/fairy.png'
import ogreSprite from '../assets/ogre.png'

const stretch = (t: number[], f: number) =>
  t.reduce((acc, frame) => {
    acc.push(...Array(f).fill(frame))
    return acc
  }, [] as number[])

const fairySpriteSheet = new SpriteSheet({
  src: fairySprite,
  numFrames: 3,
  states: { default: stretch([0, 1, 2, 1], 12) },
})

export function createFairy() {
  const fairy = new Unit({
    team: fairies,
    movement: {
      steps: 5,
      pattern: new DeltaConstraint([
        { x: -1, y: 1 },
        { x: -1, y: -1 },
        { x: 1, y: 1 },
        { x: 1, y: -1 },
      ]),
    },
    sprite: fairySpriteSheet,
  })
  fairy[forest.costOverride] = 1
  return fairy
}

const ogreSpriteSheet = new SpriteSheet({
  src: ogreSprite,
  numFrames: 3,
  states: { default: stretch([0, 1, 2, 1], 12) },
})

export function createOgre() {
  return new Unit({
    team: ogres,
    movement: {
      steps: 7,
      footprint: new DeltaConstraint([
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ]),
    },
    sprite: ogreSpriteSheet,
  })
}
