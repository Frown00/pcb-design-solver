import { Dir } from "fs";
import { BOX_SIZE } from "../../config/constant";
import { PCB } from "../pcb/PCB";
import { randomDirection } from "./mechanic";
import { isSamePoint } from "./util";

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

  constructor() {
    this.genotype = [];
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
        this.moveInDirection(currentPoint, direction);
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

  private moveInDirection(point: Point, direction: Direction) {
    switch(direction) {
      case Direction.UP: point.y -= 1;break;
      case Direction.DOWN: point.y += 1;break;
      case Direction.LEFT: point.x -= 1;break;
      case Direction.RIGHT: point.x += 1;break;
    }
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

  vizualize() {
    const board = document.querySelector('.board');
    for(let i = 0; i < this.genotype.length; i++) {
      const position = { ...this.genotype[i].start };
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
        for(let i = 0; i < segment[1]; i++)
          this.moveInDirection(position, segment[0]);
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