import { CircuitBoard } from "../pcb/circuitBoard/model";
import { IndividualController } from "./individual/controller";
import { IndividualModel } from "./individual/model";
import { IGAParams } from "./types";
import _ from "lodash";
import { Report } from "./report/report";
import * as mechanic from "./mechanic";

export enum SelectionType {
  TOURNAMENT = 'tournament',
  ROULETTE = 'roulette'
}

const defaultParams: IGAParams = {
  generations: 10,
  selectionType: SelectionType.TOURNAMENT,
  tournamentRivals: 5,
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
  private bestSolution: IndividualModel;

  constructor(cboard: CircuitBoard, params: IGAParams) {
    this.cboard = cboard;
    this.controller = new IndividualController();
    this.population = [];
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
      const individual = this.controller
        .generateRandom(width, height, connections, this.params.penalty);
      this.population.push(individual);
    }
    this.bestSolution = this.population[0];
    return this.population;
  }

  evolve(report: Report) {
    const stats = this.population.map(p => p.getFitness());
    report.addGeneration(1, stats);
    for(let i = 2; i <= this.params.generations; i++) {
      const progress = parseInt((i / this.params.generations * 100).toFixed(2));
      // this.repaintProgress(progress);
      console.log(progress + '%');
      this.selection();
      this.crossover();
      this.mutation();
      this.evaluate();
      this.findNewBest();
      const stats = this.population.map(p => p.getFitness());
      report.addGeneration(i, stats);
    }
    console.log(report);
  }

  private selection() {
    if(this.params.selectionType === SelectionType.ROULETTE) {
       this.population = mechanic.roulette(this.population);
       return;
    }
    this.population = mechanic.tournament(this.population, this.params.tournamentRivals);
  }

  private crossover() {
    const chance = this.params.crossingProb / 100;
    const popSize = this.params.populationSize;
    const newPopulation: IndividualModel[] = [];
    while(newPopulation.length < popSize) {
      const id1 = Math.floor(Math.random() * popSize);
      let id2 = id1;
      while(id1 === id2) {
        id2 = Math.floor(Math.random() * popSize);
      }
      const parent1: IndividualModel = this.population[id1];
      const parent2: IndividualModel = this.population[id2];
      const lottery = Math.random();
      if(lottery < chance) {
        const child = mechanic.crossover(parent1, parent2);
        newPopulation.push(child);
      } else {
        newPopulation.push(parent1)
      }
    }
    this.population = newPopulation;
  }

  private mutation() {
    const chance = this.params.mutationProb / 100;
    const width = this.cboard.getWidth();
    const height = this.cboard.getHeight();
    for(let i = 0; i < this.population.length; i++) {
      const individual = this.population[i];
      const lottery = Math.random();
      if(lottery < chance) {
        const newGenotype = mechanic.mutation(individual.getGenotype(), width, height);
        individual.setGenotype(newGenotype);
      }
    }
  }

  private evaluate() {
    for(let i = 0; i < this.population.length; i++) {
      const individual = this.population[i];
      const stats = this.controller.countStats(individual.getGenotype(), this.params.penalty);
      individual.setFitness(stats.fitness);
      individual.setStats(stats.intersections, stats.pathLength, stats.segmentsCount);
    }
  }

  private findNewBest() {
    for(let i = 0; i < this.population.length; i++) {
      const individual = this.population[i];
      if(individual.getFitness() < this.bestSolution.getFitness()) {
        this.bestSolution = individual;
      }
    }
  }

  paint() {
    const container = document.getElementById('circuit-board');
    console.log(this.bestSolution.getStats());
    this.controller.paint(this.bestSolution, container);
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
      <label>Selection type</label><span>${this.params.selectionType}</span>
      <label>Tournament Rivals</label><span>${this.params.tournamentRivals}</span>
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