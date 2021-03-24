import { Direction, Orientation } from "./model";
import * as types from '../../pcb/types';
import util from 'util';

export function log(item: any) {
  console.log(util.inspect(item, {showHidden: false, depth: null}))
}

export function isSamePoint(p1: types.Point, p2: types.Point) {
  return p1.x === p2.x && p1.y === p2.y;
}

export function removePoint(array: types.Point[], point: types.Point) {
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

function sanitizeWeight(weight: unknown): number {
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
  return null;
}

export function getDirection(p1: types.Point, p2: types.Point): Direction {
  if(p2.x < p1.x) return Direction.LEFT;
  if(p2.x > p1.x) return Direction.RIGHT;
  if(p2.y > p1.y) return Direction.DOWN;
  if(p2.y < p1.y) return Direction.UP;
  throw Error(`ERROR in getDirection => ${p1.x}, ${p1.y} and ${p2.x}, ${p2.y} are same`);
}

export function getOrientation(direction: Direction) {
  if(direction === Direction.LEFT || direction === Direction.RIGHT) 
   return Orientation.VERTICAL;
  if(direction === Direction.UP || direction === Direction.DOWN) 
    return Orientation.HORIZONTAL;
  throw Error('ERROR in getOrientation => wrong direction');
}