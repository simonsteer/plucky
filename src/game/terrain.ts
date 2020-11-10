import { SpriteSheet } from '../../lib'
import { Terrain } from '../lib/Terrain'
import terrainSprite from '../assets/terrain.png'

const terrainSpriteSheet = new SpriteSheet({
  src: terrainSprite,
  numFrames: 3,
  states: {
    default: [0],
    forest: [1],
  },
})

export const plains = new Terrain({
  spriteSheet: terrainSpriteSheet,
})

export const forest = new Terrain({
  baseCost: 2,
  spriteSheet: terrainSpriteSheet,
  spriteState: 'forest',
})
