import { GA } from "../ga/GA";
import { CircuitBoardController } from "./circuitBoard/controller";
import { CircuitBoard } from "./circuitBoard/model";

export class PCB {
  private circuitBoard: CircuitBoard;
  private controller: CircuitBoardController;

  constructor() {
    this.controller = new CircuitBoardController();
  }

  createCircuitBoad(data: string) {
    this.circuitBoard = this.controller.createCircuitBoard(data);
  }

  paint() {
    const container = document.getElementById('circuit-board');
    this.controller.paint(this.circuitBoard, container);
  }

  solve() {
    console.log("SOLVING...");
    const ga = new GA(this.circuitBoard);
    ga.createPopulation();
    ga.paint();
  }
}