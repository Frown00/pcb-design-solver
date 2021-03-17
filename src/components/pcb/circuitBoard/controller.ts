import { CircuitBoard } from "./model";
import { CircuitBoardView } from "./view";

export class CircuitBoardController {
  
  createCircuitBoard(data: string) {
    const board = new CircuitBoard();
    const lines = data.split(/\r\n|\n\r|\n|\r/);
    const size = lines[0].split(";");
    board.setSize(parseInt(size[0]), parseInt(size[1]));
    for(let i = 1; i < lines.length; i++) {
      const connection = lines[i].split(";");
      const point1 = { x: parseInt(connection[0]), y: parseInt(connection[1]) };
      const point2 = { x: parseInt(connection[2]), y: parseInt(connection[3]) };
      board.setConnection(point1, point2);
    }
    return board;
  }

  paint(circuitBoard: CircuitBoard, container: HTMLElement) {
    container.innerHTML = '';
    const width = circuitBoard.getWidth();
    const height = circuitBoard.getHeight();
    const connections = circuitBoard.getConnections();
    const view = new CircuitBoardView(container);
    const board = view.createBoard(width, height);
    const points = view.createPoints(width, height, connections);
    for(let i = 0; i < points.length; i++) {
      board.appendChild(points[i]);
    }
    container.appendChild(board);
  }
}