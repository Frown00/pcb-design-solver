import { Chromosom, Direction, Orientation } from "./model";
import * as types from '../../pcb/types';
import _ from "lodash";
import * as util from "./util";

export function moveInDirection(point: types.Point, direction: Direction, move: number): types.Point {
  const newPoint = { x: point.x, y: point.y };
  switch(direction) {
    case Direction.UP: newPoint.y -= move;break;
    case Direction.DOWN: newPoint.y += move;break;
    case Direction.LEFT: newPoint.x -= move;break;
    case Direction.RIGHT: newPoint.x += move;break;
  }
  return newPoint;
}

export function calcDistance(point1: types.Point, point2: types.Point) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

export function countDistances(
  directions: Direction[], 
  position: types.Point, 
  pointTo: types.Point,
  step: number
) {
  const distances = [];
  for(let i = 0; i < directions.length; i++) {
    const p = moveInDirection(position, directions[i], step);
    const d = calcDistance(p, pointTo);
    distances.push(d);
  }
  return distances;
}

export function chooseDirection(directions: Direction[], distances: number[]) {
  const sum = _.sum(distances);
  const weights = distances.map(d => (sum - d) + 1);
  const index = util.randomWeighted(weights);
  return directions[index];
}

export function findBlockedDirections(
  point: types.Point, 
  x: { min: number, max: number },
  y: { min: number, max: number }
) {
  const forbidden = [];
  if(point.x <= x.min) forbidden.push(Direction.LEFT);
  if(point.x >= x.max) forbidden.push(Direction.RIGHT);
  if(point.y <= y.min) forbidden.push(Direction.UP);
  if(point.y >= y.max) forbidden.push(Direction.DOWN);
  return forbidden; 
}

export function validDirections(params: {
  point: types.Point,
  lastDirection: Direction, 
  blackList: types.Point[],
  step: number,
  maxWidth: number,
  maxHeight: number
}): Direction[] {
  const { blackList, lastDirection, maxHeight, maxWidth, point, step} = params;
  const allDirections = Object.values(Direction);
  const forbidden: Direction[] = [];
  const opposite = util.getOppositeDirection(lastDirection);
  if(opposite)
    forbidden.push(opposite);
  const possible = allDirections.filter(d => d !== opposite);
  for(let i = 0; i < possible.length; i++) {
    const p = moveInDirection(point, possible[i], step);
    const isOnBlackList = blackList.find(b => b.x === p.x && b.y === p.y);
    const blocked = findBlockedDirections(
      p, 
      { min: -1, max: maxWidth }, 
      { min: -1, max: maxHeight }
    );
    if(isOnBlackList) {
      forbidden.push(possible[i]);
    }
    if(blocked.length > 0) {
      forbidden.push(...blocked);
    }
  }
  const allPossible = allDirections.filter(d => !forbidden.includes(d));
  if(allPossible.length === 0) {
    allPossible.push(opposite);
  }
  return allPossible;
}

export function countIntersections(genotype: Chromosom[]) {
  let points: types.Point[] = [];
  for(let i = 0; i < genotype.length; i++) {
    const chromosom = genotype[i];
    let position = { ...chromosom.start };
    points.push(chromosom.start);
    for(let j = 0; j < chromosom.path.length; j++) {
      const segment = chromosom.path[j];
      if(!util.isSamePoint(position, segment)) {
        const direction = util.getDirection(position, segment);
        const orientation = util.getOrientation(direction);
        const length = orientation === Orientation.HORIZONTAL ? 
          Math.abs(position.y - segment.y) : Math.abs(position.x - segment.x);
        for(let m = 0; m < length; m++) {
          position = moveInDirection(position, direction, 1);
          points.push({ ...position });
        }
      }
    }
  }
  let intersections = 0;
  while(points.length > 0) {
    const same = points.filter(p => p.x === points[0].x && p.y === points[0].y);
    if(same.length > 1) {
      intersections++;
    }
    points = util.removePoint(points, same[0]);
  }
  return intersections;
}

export function isLinesIntersect(
  line1: { p1: types.Point, p2: types.Point }, 
  line2: {p1: types.Point, p2: types.Point }
) {
  return isIntersecting(line1.p1, line1.p2, line2.p1, line2.p2);
};

// returns true iff the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
function isIntersecting(p1: types.Point, p2: types.Point, p3: types.Point, p4: types.Point) {
  function CCW(p1: types.Point, p2: types.Point, p3: types.Point) {
      return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
  }
  return (CCW(p1, p3, p4) != CCW(p2, p3, p4)) && (CCW(p1, p2, p3) != CCW(p1, p2, p4));
}