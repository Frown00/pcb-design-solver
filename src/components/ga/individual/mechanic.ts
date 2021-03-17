import { Direction } from "./model";

export function randomDirection(exclude?: Direction[]): Direction {
  const directions = Object.values(Direction).filter(v => !exclude.includes(v));
  const index = Math.floor((Math.random() * directions.length));
  return directions[index];
}

export function moveInDirection(point: Point, direction: Direction, move: number): Point {
  const newPoint = { x: point.x, y: point.y };
  switch(direction) {
    case Direction.UP: newPoint.y -= move;break;
    case Direction.DOWN: newPoint.y += move;break;
    case Direction.LEFT: newPoint.x -= move;break;
    case Direction.RIGHT: newPoint.x += move;break;
  }
  return newPoint;
}