import { Game, JSONCoords, SpriteSheet } from '../../lib'
import textSprite from '../assets/text.png'
import { v4 as uuid } from 'uuid'

const textSpriteSheet = new SpriteSheet({
  src: textSprite,
  numFrames: 82,
  states: {
    default: [0],
    A: [0],
    a: [1],
    B: [2],
    b: [3],
    C: [4],
    c: [5],
    D: [6],
    d: [7],
    E: [8],
    e: [9],
    F: [10],
    f: [11],
    G: [12],
    g: [13],
    H: [14],
    h: [15],
    I: [16],
    i: [17],
    J: [18],
    j: [19],
    K: [20],
    k: [21],
    L: [22],
    l: [23],
    M: [24],
    m: [25],
    N: [26],
    n: [27],
    O: [28],
    o: [29],
    P: [30],
    p: [31],
    Q: [32],
    q: [33],
    R: [34],
    r: [35],
    S: [36],
    s: [37],
    T: [38],
    t: [39],
    U: [40],
    u: [41],
    V: [42],
    v: [43],
    W: [44],
    w: [45],
    X: [46],
    x: [47],
    Y: [48],
    y: [49],
    Z: [50],
    z: [51],
    '0': [52],
    '1': [53],
    '2': [54],
    '3': [55],
    '4': [56],
    '5': [57],
    '6': [58],
    '7': [59],
    '8': [60],
    '9': [61],
    '!': [62],
    '?': [63],
    '.': [64],
    ',': [65],
    ':': [66],
    ';': [67],
    '-': [68],
    '<': [69], // opening quote
    '>': [70], // closing quote
    "'": [71],
    '/': [72],
    '&': [73],
    '(': [74],
    ')': [75],
    '#': [76],
    '%': [77],
    '^': [78],
    '*': [79],
    '=': [80],
    '+': [81],
  },
})

export default class TextRenderer {
  id = uuid()
  game: Game
  constructor(game: Game) {
    this.game = game
  }

  render(text: string, at: JSONCoords) {
    const lines = text.split('\n')
    lines.forEach((line, lineIndex) =>
      line.split('').forEach((char, charIndex) => {
        if (char === ' ') {
          return
        }
        textSpriteSheet.render({
          game: this.game,
          x: at.x + charIndex * textSpriteSheet.frameWidth,
          y: at.y + lineIndex * textSpriteSheet.frameHeight,
          instanceId: this.id,
          state: char,
        })
      })
    )
  }
}
