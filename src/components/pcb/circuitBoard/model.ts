import * as types from "../types";

export class CircuitBoard {
  private width: number;
  private height: number;
  private connections:types.Connection[];

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

  setConnection(point1: types.Point, point2: types.Point) {
    this.connections.push([point1, point2]);
  }
}