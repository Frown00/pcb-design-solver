import { BOX_SIZE } from "../../../config/constant";
import * as types from "../types";

export class CircuitBoardView {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  createBoard(width: number, height: number) {
    const board = document.createElement('div');
    board.classList.add('board');
    board.style.display = 'flex';
    board.style.flexWrap = 'wrap';
    board.style.minWidth = (BOX_SIZE * width).toString() + 'px';
    board.style.maxWidth = (BOX_SIZE * width).toString() + 'px';
    board.style.minHeight = (BOX_SIZE * height).toString() + 'px';
    board.style.maxHeight = (BOX_SIZE * height).toString() + 'px';
    return board;
  }

  createPoints(width: number, height: number, connections: types.Connection[]) {
    const points = [];
    for(let y = 0; y < height; y++) {
      for(let x = 0; x < width; x++) {
        const connectionPoint = connections.find((c: any) => 
          c[0].x === x && c[0].y === y ||
          c[1].x === x && c[1].y === y
        );
        let point; 
        if(connectionPoint) {
          const index = connections.indexOf(connectionPoint);
          point = this.createConnectionPoint(BOX_SIZE, index);
        } else {
          point = this.createPoint(BOX_SIZE);
        }
        points.push(point);
      }
    }
    return points;
  }

  private createPoint(size: number) {
    const point = document.createElement('div');
    point.classList.add('point');
    point.style.width = size.toString() + 'px';
    point.style.height = size.toString() + 'px';
    const circle = document.createElement('div');
    circle.classList.add('circle');
    point.appendChild(circle);
    return point;
  }
  
  private createConnectionPoint(size: number, index: number) {
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
}

