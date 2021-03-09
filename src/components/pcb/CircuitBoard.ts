import { linkSync } from "fs";
import { BOX_SIZE } from "../../config/constant";

export class CircuitBoard {
  private width: number;
  private height: number;
  private connections: Connection[];

  constructor() {
    this.width = 0;
    this.height = 0;
    this.connections = [];
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getConnections() {
    return this.connections;
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  setConnection(point1: Point, point2: Point) {
    this.connections.push([point1, point2]);
  }
 
  vizualize() {
    const squareSize = BOX_SIZE;
    const lines = [
      { x: 1, y: 1, len: 4, orientation: 'ver'},
      { x: 1, y: 1, len: 2, orientation: 'hor'}
    ]
    const container = document.getElementById('circuit-board');
    container.innerHTML = '';
    const board = document.createElement('div');
    board.classList.add('board');
    board.style.display = 'flex';
    board.style.flexWrap = 'wrap';
    board.style.minWidth = (squareSize * this.width).toString() + 'px';
    board.style.maxWidth = (squareSize * this.width).toString() + 'px';
    board.style.minHeight = (squareSize * this.height).toString() + 'px';
    board.style.maxHeight = (squareSize * this.height).toString() + 'px';
    for(let y = 0; y < this.height; y++) {
      for(let x = 0; x < this.width; x++) {
        const connectionPoint = this.connections.find(c => 
          c[0].x === x && c[0].y === y ||
          c[1].x === x && c[1].y === y
        );
        let point; 
        if(connectionPoint) {
          const index = this.connections.indexOf(connectionPoint);
          point = createConnectionPoint(squareSize, index);
        } else {
          point = createPoint(squareSize);
        }
        board.appendChild(point);
      }
    }

   
    container.appendChild(board);
  }
}

function createPoint(size: number) {
  const point = document.createElement('div');
  point.classList.add('point');
  point.style.width = size.toString() + 'px';
  point.style.height = size.toString() + 'px';
  const circle = document.createElement('div');
  circle.classList.add('circle');
  point.appendChild(circle);
  return point;
}

function createConnectionPoint(size: number, index: number) {
  const point = document.createElement('div');
  point.classList.add('point');
  const text = document.createElement('p');
  text.innerText = index.toString();
  text.style.fontSize = (size / 2.5).toString() + 'px';
  text.style.position = 'relative';
  text.style.right = '3px';
  point.appendChild(text);
  point.style.width = size.toString() + 'px';
  point.style.height = size.toString() + 'px';
  const circle = document.createElement('div');
  circle.classList.add('connection-point');
  point.appendChild(circle);
  return point;
}

