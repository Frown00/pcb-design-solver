import { BOX_SIZE } from "../../config/constant";
import { PCB } from "../pcb/PCB";
import { randomDirection } from "./mechanic";
import { isSamePoint, removePoint } from "./util";

export enum Direction {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right"
}

type Segment = [Direction, Length];
type Chromosom = { start: Point, end: Point, path: Segment[] };

export class Individual {
  private genotype: Chromosom[];
  private fitness: number;
  private intersections: number;

  constructor() {
    this.genotype = [];
  }

  getFitness() {
    return this.fitness;
  }

  generateRandom() {
    const maxWidth = PCB.circuitBoard.getWidth();
    const maxHeight = PCB.circuitBoard.getHeight();
    const connections = PCB.circuitBoard.getConnections();
    for(let i = 0; i < connections.length; i++) {
      const conn = connections[i];
      const pointA = conn[0];
      const pointB = conn[1];
      const chromosom: Chromosom = {
        start: pointA,
        end: pointB,
        path: []
      }
      let currentPoint = { ...pointA };
      let direction = randomDirection([]);
      while(true) {
        if(isSamePoint(currentPoint, pointB)) break;
        const forbidden = this.getForbiddenDirections(
          currentPoint, 
          { min: 0, max: maxWidth - 1}, 
          { min: 0, max: maxHeight - 1 }
        );
        forbidden.push(getOppositeDirection(direction));
        direction = randomDirection(forbidden);
        currentPoint = this.moveInDirection(currentPoint, direction, 1);
        let lastDirection = null;
        if(chromosom.path.length > 0) {
          lastDirection = chromosom.path[chromosom.path.length - 1][0];
        }
        if(lastDirection === direction) {
          chromosom.path[chromosom.path.length - 1][1] += 1;
        } else {
          chromosom.path.push([direction, 1]);
        }
      }
      this.genotype.push(chromosom);
    }
    return this;
  }

  countFitness() {
    let pathLength = 0;
    let segmentsCount = 0;
    this.intersections = this.countIntersections();
    for(let i = 0; i < this.genotype.length; i++) {
      const chromosom = this.genotype[i];
      segmentsCount += chromosom.path.length;
      for(let j = 0; j < chromosom.path.length; j++) {
        const segment = chromosom.path[j];
        const len = segment[1];
        pathLength += len;
      }
    }
    // console.log('PATH LENGTH: ', pathLength);
    // console.log('SEGMENT COUNT: ', segmentsCount);
    // console.log('INTERSECTIONS: ', intersections);
    this.fitness = pathLength + segmentsCount * 2 + this.intersections * 100;
    return this.fitness;
  }

  private moveInDirection(point: Point, direction: Direction, move: number): Point {
    const newPoint = { x: point.x, y: point.y };
    switch(direction) {
      case Direction.UP: newPoint.y -= move;break;
      case Direction.DOWN: newPoint.y += move;break;
      case Direction.LEFT: newPoint.x -= move;break;
      case Direction.RIGHT: newPoint.x += move;break;
    }
    return newPoint;
  }

  private getForbiddenDirections(
    point: Point, 
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

  private countIntersections() {
    let points: Point[] = [];
    for(let i = 0; i < this.genotype.length; i++) {
      const chromosom = this.genotype[i];
      let position = { ...chromosom.start };
      points.push(chromosom.start);
      for(let j = 0; j < chromosom.path.length; j++) {
        const segment = chromosom.path[j];
        const direction = segment[0];
        const len = segment[1];
        for(let m = 0; m < len; m++) {
          position = this.moveInDirection(position, direction, 1);
          points.push({ ...position });
        }
      }
    }
    let intersections = 0;
    while(points.length > 0) {
      const same = points.filter(p => p.x === points[0].x && p.y === points[0].y);
      if(same.length > 1) {
        intersections++;
      }
      points = removePoint(points, same[0]);
    }
    return intersections;
  }

  vizualize() {
    console.log('GENOTYPE:', this.genotype);
    const container = document.querySelector('#circuit-board');
    const board = document.querySelector('.board');
    const text = document.createElement('p');
    text.innerText = `Fitness: ${this.fitness}\nIntersections: ${this.intersections}`;
    container.appendChild(text);
    for(let i = 0; i < this.genotype.length; i++) {
      let position = { ...this.genotype[i].start };
      for(let j = 0; j < this.genotype[i].path.length; j++) {
        const segment = this.genotype[i].path[j];
        const line = getLine(position, segment);
        if(line.orientation === Orientation.VERTICAL) {
          const lineHTML = addVerticalLine(BOX_SIZE, line);
          board.appendChild(lineHTML);
        } 
        else {
          const lineHTML = addHorizontalLine(BOX_SIZE, line);
          board.appendChild(lineHTML);
        }
        position = this.moveInDirection(position, segment[0], segment[1]);
      }
    }
  }
}

function getOppositeDirection(direction: Direction) {
  if(direction === Direction.LEFT) return Direction.RIGHT;
  if(direction === Direction.RIGHT) return Direction.LEFT;
  if(direction === Direction.UP) return Direction.DOWN;
  if(direction === Direction.DOWN) return Direction.UP;
}

function getLine(position: Point, segment: Segment) {
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

function getOrientation(direction: Direction) {
  if(direction === Direction.LEFT || direction === Direction.RIGHT) 
   return Orientation.VERTICAL;
  if(direction === Direction.UP || direction === Direction.DOWN) 
    return Orientation.HORIZONTAL;
}

enum Orientation {
  HORIZONTAL,
  VERTICAL
}
type Line = { x: number, y: number, len: number, orientation: Orientation };

function addVerticalLine(boxSize: number, line: Line) {
  const lineElem = document.createElement('div');
  lineElem.classList.add('line');
  lineElem.style.left = (boxSize * line.x + boxSize / 2 - 1).toString() + 'px';
  lineElem.style.top = (boxSize * line.y + boxSize / 2 - 1).toString() + 'px';
  lineElem.style.width = (boxSize * line.len).toString() + 'px';
  return lineElem;
}

function addHorizontalLine(boxSize: number, line: Line) {
  const lineElem = document.createElement('div');
  lineElem.classList.add('line');
  lineElem.style.left = (boxSize * line.x - ((1+ line.len) * (boxSize / 2)) + boxSize - 1).toString() + 'px';
  lineElem.style.top = (boxSize * line.y + ((1+line.len)* (boxSize / 2)) - 1).toString() + 'px';
  lineElem.style.width = (boxSize * line.len).toString() + 'px';
  lineElem.style.transform = 'rotate(90deg)';
  return lineElem;
}