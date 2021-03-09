import { CircuitBoard } from "./CircuitBoard";
import { GA } from "../ga/GA";

export class PCB {
  static circuitBoard: CircuitBoard;

  static createCircuitBoad(data: string) {
    PCB.circuitBoard = new CircuitBoard();
    const lines = data.split(/\r\n|\n\r|\n|\r/);
    const size = lines[0].split(";");
    PCB.circuitBoard.setSize(parseInt(size[0]), parseInt(size[1]));
    for(let i = 1; i < lines.length; i++) {
      const connection = lines[i].split(";");
      const point1 = { x: parseInt(connection[0]), y: parseInt(connection[1]) };
      const point2 = { x: parseInt(connection[2]), y: parseInt(connection[3]) };
      PCB.circuitBoard.setConnection(point1, point2);
    }
    console.log(PCB.circuitBoard);
  }

  static solve() {
    console.log("SOLVING...");
    const ga = new GA();
    ga.createPopulation();
  }
}