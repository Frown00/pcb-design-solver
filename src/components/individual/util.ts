export function isSamePoint(p1: Point, p2: Point) {
  return p1.x === p2.x && p1.y === p2.y;
}

export function removePoint(array: Point[], point: Point) {
  return array.filter(p => !isSamePoint(p, point));
}