const c1 = 1.70158
const c2 = c1 * 1.525
const c3 = c1 + 1
const c4 = (2 * Math.PI) / 3
const c5 = (2 * Math.PI) / 4.5

export default class Easing {
  static bounceOut(x: number): number {
    const n1 = 7.5625
    const d1 = 2.75

    if (x < 1 / d1) {
      return n1 * x * x
    } else if (x < 2 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75
    } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375
    } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375
    }
  }
  static easeInQuad(x: number) {
    return x * x
  }
  static easeOutQuad(x: number) {
    return 1 - (1 - x) * (1 - x)
  }
  static easeInOutQuad(x: number) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
  }
  static easeInCubic(x: number) {
    return x * x * x
  }
  static easeOutCubic(x: number) {
    return 1 - Math.pow(1 - x, 3)
  }
  static easeInOutCubic(x: number) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
  }
  static easeInQuart(x: number) {
    return x * x * x * x
  }
  static easeOutQuart(x: number) {
    return 1 - Math.pow(1 - x, 4)
  }
  static easeInOutQuart(x: number) {
    return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2
  }
  static easeInQuint(x: number) {
    return x * x * x * x * x
  }
  static easeOutQuint(x: number) {
    return 1 - Math.pow(1 - x, 5)
  }
  static easeInOutQuint(x: number) {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2
  }
  static easeInSin(x: number) {
    return 1 - Math.cos((x * Math.PI) / 2)
  }
  static easeOutSin(x: number) {
    return Math.sin((x * Math.PI) / 2)
  }
  static easeInOutSin(x: number) {
    return -(Math.cos(Math.PI * x) - 1) / 2
  }
  static easeInExp(x: number) {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10)
  }
  static easeOutExp(x: number) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
  }
  static easeInOutExp(x: number) {
    return x === 0
      ? 0
      : x === 1
      ? 1
      : x < 0.5
      ? Math.pow(2, 20 * x - 10) / 2
      : (2 - Math.pow(2, -20 * x + 10)) / 2
  }
  static easeInCirc(x: number) {
    return 1 - Math.sqrt(1 - Math.pow(x, 2))
  }
  static easeOutCirc(x: number) {
    return Math.sqrt(1 - Math.pow(x - 1, 2))
  }
  static easeInOutCirc(x: number) {
    return x < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2
  }
  static easeInBack(x: number) {
    return c3 * x * x * x - c1 * x * x
  }
  static easeOutBack(x: number) {
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
  }
  static easeInOutBack(x: number) {
    return x < 0.5
      ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
      : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2
  }
  static easeInElastic(x: number) {
    return x === 0
      ? 0
      : x === 1
      ? 1
      : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4)
  }
  static easeOutElastic(x: number) {
    return x === 0
      ? 0
      : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1
  }
  static easeInOutElastic(x: number) {
    return x === 0
      ? 0
      : x === 1
      ? 1
      : x < 0.5
      ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
      : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1
  }
  static easeInBounce(x: number) {
    return 1 - Easing.bounceOut(1 - x)
  }
  static easeInOutBounce(x: number) {
    return x < 0.5
      ? (1 - Easing.bounceOut(1 - 2 * x)) / 2
      : (1 + Easing.bounceOut(2 * x - 1)) / 2
  }
}
