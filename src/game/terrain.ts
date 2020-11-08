import { SpriteSheet } from '../../lib'
import { Terrain } from '../lib/Terrain'
import terrainSprite from '../assets/test_sprite.png'

const terrainSpriteSheet = new SpriteSheet({
  src: terrainSprite,
  numFrames: 8,
  states: {
    default: [2],
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
