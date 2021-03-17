import { Direction, Line, Orientation, Segment } from "./model";

export function isSamePoint(p1: Point, p2: Point) {
  return p1.x === p2.x && p1.y === p2.y;
}

export function removePoint(array: Point[], point: Point) {
  return array.filter(p => !isSamePoint(p, point));
}

export function randomWeighted(weights: number[]): number {
  const sanitizedWeights = weights.map(sanitizeWeight);
  const weightSum = sanitizedWeights.reduce((acc, w) => acc + w, 0);
  if(weightSum === 0) {
    throw new Error('Weight sum is equal zero');
  }
  let n = Math.random() * weightSum;
  let selected = null;
  for(let i = 0; i < sanitizedWeights.length && n > 0; i++) {
    if(sanitizedWeights[i] <= 0)
      continue;
    n -= sanitizedWeights[i];
    selected = i;
  }
  return selected;
}

export function sanitizeWeight(weight: unknown): number {
  // or any other validation/sanitization logic, like treating invalid value as 0
  if(weight === '') {
    throw new Error(`Weight must be numeric, got ${weight}`);
  }
  const n = Number(weight);
  if(!Number.isFinite(n) || n < 0) {
    throw new Error(`Weight must be finite positive, got ${weight}`);
  }
  return n;
}

export function getOppositeDirection(direction: Direction) {
  if(direction === Direction.LEFT) return Direction.RIGHT;
  if(direction === Direction.RIGHT) return Direction.LEFT;
  if(direction === Direction.UP) return Direction.DOWN;
  if(direction === Direction.DOWN) return Direction.UP;
}

export function getLine(position: Point, segment: Segment) {
  const direction = segment[0];
  const len = segment[1];
  const orientation = getOrientation(direction);
  let x = position.x;
  let y = position.y;
  if(direction === Direction.LEFT) {
    x -= len;
  }
  if(direction === Direction.UP) {
    y -= len;
  }
  const line: Line = { x, y, len, orientation };
  return line;
}

export function getOrientation(direction: Direction) {
  if(direction === Direction.LEFT || direction === Direction.RIGHT) 
   return Orientation.VERTICAL;
  if(direction === Direction.UP || direction === Direction.DOWN) 
    return Orientation.HORIZONTAL;
}