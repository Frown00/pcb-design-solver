import { CircuitBoard } from "../pcb/circuitBoard/model";
import { IndividualController } from "./individual/controller";
import { IndividualModel } from "./individual/model";
import { IGAParams } from "./types";
import _, { intersection } from "lodash";

const defaultParams: IGAParams = {
  generations: 10,
  populationSize: 100,
  crossingProb: 50,
  mutationProb: 50,
  penalty: {
    intersection: 100,
    pathLength: 1,
    segmentCount: 1
  }
};

export class GA {
  private params: IGAParams;
  private cboard: CircuitBoard;
  private controller: IndividualController;
  private population: IndividualModel[];

  constructor(cboard: CircuitBoard, params: IGAParams) {
    this.cboard = cboard;
    this.controller = new IndividualController();
    this.population = [];
    console.log(params);
    this.params = _.merge(defaultParams, params);
    console.log('PARAMS', this.params);
  }

  getParams() {
    return this.params;
  }

  createPopulation() {
    const width = this.cboard.getWidth();
    const height = this.cboard.getHeight();
    const connections = this.cboard.getConnections();
    const popSize = this.params.populationSize;
    for(let i = 0; i < popSize; i++) {
      const individual = this.controller.generateRandom(width, height, connections);
      this.population.push(individual);
      const progress = parseInt(((i + 1) / popSize * 100).toFixed(2));
      this.repaintProgress(progress);
      console.log(progress + '%');
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

  paintParams() {
    const paramsDiv = document.getElementById('used-params') as HTMLDivElement;
    paramsDiv.innerText = '';
    const params = document.createElement('div');
    params.classList.add('form-params');
    const d1 = document.createElement('div');
    const d2 = document.createElement('div');
    d1.classList.add('params');
    d2.classList.add('params');
    const main = document.createElement('h3');
    main.innerText = 'Paramters';
    d1.appendChild(main);
    d1.innerHTML+= `<label>Generations</label><span>${this.params.generations}</span>
      <label>Population size</label><span>${this.params.populationSize}</span>
      <label>Crossing prob.</label><span>${this.params.crossingProb}%</span>
      <label>Mutation prob.</label><span>${this.params.mutationProb}%</span>
    `
    const penalty = document.createElement('h3');
    penalty.innerText = 'Penalty';
    d2.appendChild(penalty);
    d2.innerHTML += `<label>Intersection</label><span>${this.params.penalty.intersection}x</span>
    <label>Segment count</label><span>${this.params.penalty.segmentCount}x</span>
    <label>Path length</label><span>${this.params.penalty.pathLength}x</span>`
    params.appendChild(d1);
    params.appendChild(d2);
    paramsDiv.appendChild(params);
  }

  repaintProgress(percent: number) {
    const progress = document.getElementById('progress') as HTMLProgressElement;
    progress.value = percent;
  }
}