import { Chromosom, Direction } from "./model";
import * as types from '../../pcb/types';
import _ from "lodash";
import * as util from "./util";

export function randomDirection(exclude?: Direction[]): Direction {
  const directions = Object.values(Direction).filter(v => !exclude.includes(v));
  const index = Math.floor((Math.random() * directions.length));
  return directions[index];
}

export function randomLength(
  point: types.Point, 
  direction: Direction, 
  maxWidth: number, 
  maxHeight: number
) {
  const directionMax = {
    [Direction.LEFT]: point.x,
    [Direction.RIGHT]: maxWidth - point.x,
    [Direction.UP]: point.y,
    [Direction.DOWN]: maxHeight - point.y
  }
  const max = directionMax[direction];
  return _.random(1, max);
}

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

export function selectValidDirections(forbidden: Direction[]) {
  const directions = Object.values(Direction);
  return directions.filter(d => !forbidden.includes(d));
}

export function countDistances(pointsFrom: types.Point[], pointTo: types.Point) {
  const distances = [];
  for(let i = 0 ; i < pointsFrom.length; i++) {
    const d = calcDistance(pointsFrom[i], pointTo);
    distances.push(d);
  }
  return distances;
}

export function chooseDirection(directions: Direction[], distances: number[]) {
  const chanceForWorseOne = 1;
  const max = Math.max(...distances) + chanceForWorseOne;
  const weights = distances.map(d => max - d);
  const index = util.randomWeighted(weights);
  return directions[index];
}

export function findForbiddenDirections(
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

export function countIntersections(genotype: Chromosom[]) {
  let points: types.Point[] = [];
  for(let i = 0; i < genotype.length; i++) {
    const chromosom = genotype[i];
    let position = { ...chromosom.start };
    points.push(chromosom.start);
    for(let j = 0; j < chromosom.path.length; j++) {
      const segment = chromosom.path[j];
      // const direction = segment[0];
      // const len = segment[1];
      // for(let m = 0; m < len; m++) {
      //   position = moveInDirection(position, direction, 1);
      //   points.push({ ...position });
      // }
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
