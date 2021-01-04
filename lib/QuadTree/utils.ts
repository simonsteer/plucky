import { Bounds } from "./types"

export const getDoBoundsOverlap = (rect1: Bounds, rect2: Bounds) => (
  rect1.x <= rect2.x + rect2.width &&
  rect1.x + rect1.width > rect2.x &&
  rect1.y <= rect2.y + rect2.height &&
  rect1.y + rect1.height > rect2.y
)

type CircleBounds = { x: number; y: number, radius: number }
export const getDoCirclesOverlap = (circle1: CircleBounds, circle2: CircleBounds) => {
  const dx = circle1.x - circle2.x
  const dy = circle1.y - circle2.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  return (distance < circle1.radius + circle2.radius)
}