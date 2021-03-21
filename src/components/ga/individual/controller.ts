import * as mechanic from "./mechanic";
import { Chromosom, Direction, IndividualModel } from "./model";
import * as util from "./util";
import { IndividualView } from "./view";
import * as types from '../../pcb/types';
import _ from "lodash";
import { IPenalty } from "../types";

export class IndividualController {
  
  generateRandom(
    maxWidth: number, 
    maxHeight: number, 
    connections: types.Connection[],
    penalty: IPenalty
  ) {
    const genotype = [];
    const step = 1;
    let blackList = _.flatMap(connections);
    for(let i = 0; i < connections.length; i++) {
      const conn = connections[i];
      const pointA = conn[0];
      const pointB = conn[1];
      blackList = blackList.filter(b => b !== pointA && b !== pointB);
      const chromosom: Chromosom = {
        start: pointA,
        end: pointB,
        path: []
      }
      let position: types.Point = { ...pointA };
      let direction: Direction = null;
     
      while(true) {
        if(util.isSamePoint(position, pointB)) break;
        const validDirections = mechanic.validDirections({
          point: position, 
          lastDirection: direction, 
          blackList, 
          step, 
          maxWidth, 
          maxHeight
        });
        const distances = mechanic.countDistances(validDirections, position, pointB, step);
        const nextDirection = mechanic.chooseDirection(validDirections, distances);
        const nextPoint = mechanic.moveInDirection(position, nextDirection, step);
        if(nextDirection === direction) {
          chromosom.path.pop();
        }
        chromosom.path.push(nextPoint);
        position = nextPoint;
        direction = nextDirection;
      }
      genotype.push(chromosom);
      blackList.push(pointA);
      blackList.push(pointB);
    }
    const individual = new IndividualModel().setGenotype(genotype);
    const stats = this.countStats(genotype, penalty);
    individual.setFitness(stats.fitness);
    individual.setStats(stats.intersections, stats.pathLength, stats.segmentsCount);
    return individual;
  }

  countStats(genotype: Chromosom[], penalty: IPenalty) {
    let pathLength = 0;
    let segmentsCount = 0;
    const intersections = mechanic.countIntersections(genotype);
    for(let i = 0; i < genotype.length; i++) {
      const chromosom = genotype[i];
      segmentsCount += chromosom.path.length;
      let current = chromosom.start;
      for(let j = 0; j < chromosom.path.length; j++) {
        const segment = chromosom.path[j];
        const len = mechanic.calcDistance(current, segment);
        pathLength += len;
        current = segment;
      }
    }
    const path = pathLength * penalty.pathLength;
    const segment = segmentsCount * penalty.segmentCount;
    const intersection = intersections * penalty.intersection;
    const fitness = path + segment + intersection;
    return { fitness, pathLength, segmentsCount, intersections };
  }

  paint(individual: IndividualModel, container: HTMLElement) {
    const existingLines = document.getElementsByClassName('line');
    const results = document.getElementsByClassName('fitness');
    while(existingLines.length > 0)
      existingLines[0].parentElement.removeChild(existingLines[0]);
    while(results.length > 0)
      results[0].parentElement.removeChild(results[0]);
    const board = document.querySelector('.board');
    const genotype = individual.getGenotype();
    const fitness = individual.getFitness();
    const view = new IndividualView(container);
    const conn = view.createConnections(genotype);
    const label = view.createFitnessLabel(fitness);
    conn.map(c => board.appendChild(c));
    container.appendChild(label);
  }

  
}