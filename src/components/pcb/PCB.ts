import { GA } from "../ga/GA";
import { IGAParams } from "../ga/types";
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
    const progress = document.getElementById('progress') as HTMLProgressElement;
    progress.value = 0;
    const container = document.getElementById('circuit-board');
    this.controller.paint(this.circuitBoard, container);
  }

  solve(params: IGAParams) {
    console.log("SOLVING...");
    const progress = document.getElementById('progress') as HTMLProgressElement;
    progress.value = 0;
    const ga = new GA(this.circuitBoard, params);
    ga.paintParams();
    ga.createPopulation();
    ga.paint();
  }
}