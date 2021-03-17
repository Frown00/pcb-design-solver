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
}