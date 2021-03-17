import { CircuitBoard } from "../pcb/circuitBoard/model";
import { IndividualController } from "./individual/controller";
import { IndividualModel } from "./individual/model";

export class GA {
  private params: any;
  private cboard: CircuitBoard;
  private controller: IndividualController;
  private population: IndividualModel[];

  constructor(cboard: CircuitBoard) {
    this.cboard = cboard;
    this.controller = new IndividualController();
    this.population = [];
  }

  createPopulation() {
    const width = this.cboard.getWidth();
    const height = this.cboard.getHeight();
    const connections = this.cboard.getConnections();
    for(let i = 0; i < 1; i++) {
      const individual = this.controller.generateRandom(width, height, connections);
      this.population.push(individual);
    }
  }

  paint() {
    let best = this.population[0];
    for(let i = 1; i < this.population.length; i++) {
      if(this.population[i].getFitness() < best.getFitness()) {
        best = this.population[i];
      }
    }
    const container = document.getElementById('circuit-board');
    this.controller.paint(best, container);
  }
}