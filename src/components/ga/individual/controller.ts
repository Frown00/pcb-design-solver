import * as mechanic from "./mechanic";
import { Chromosom, Direction, IndividualModel } from "./model";
import * as util from "./util";
import { IndividualView } from "./view";
import * as types from '../../pcb/types';

export class IndividualController {
  
  generateRandom(maxWidth: number, maxHeight: number, connections: types.Connection[]) {
    const genotype = [];
    for(let i = 0; i < connections.length; i++) {
      const conn = connections[i];
      const pointA = conn[0];
      const pointB = conn[1];
      const chromosom: Chromosom = {
        start: pointA,
        end: pointB,
        path: []
      }
      let currentPoint: types.Point = { ...pointA };
      let direction: Direction = null;
      let forbiddenDirections: Direction[] = mechanic.findForbiddenDirections(
        currentPoint, 
        { min: 0, max: maxWidth - 1}, 
        { min: 0, max: maxHeight - 1 }
      );
      while(true) {
        if(util.isSamePoint(currentPoint, pointB)) break;
        direction = mechanic.randomDirection(forbiddenDirections);
        const length = mechanic.randomLength(currentPoint, direction, maxWidth - 1, maxHeight - 1);
        const nextPoint = mechanic.moveInDirection(currentPoint, direction, length);
        chromosom.path.push(nextPoint);
        currentPoint = nextPoint;
        forbiddenDirections = mechanic.findForbiddenDirections(
          currentPoint, 
          { min: 0, max: maxWidth - 1}, 
          { min: 0, max: maxHeight - 1 }
        );
        forbiddenDirections.push(direction);
        forbiddenDirections.push(util.getOppositeDirection(direction));
      }
      genotype.push(chromosom);
    }
    const individual = new IndividualModel().setGenotype(genotype);
    const stats = this.countStats(genotype);
    individual.setFitness(stats.fitness);
    return individual;
  }

  countStats(genotype: Chromosom[]) {
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
    // console.log('PATH LENGTH: ', pathLength);
    // console.log('SEGMENT COUNT: ', segmentsCount);
    // console.log('INTERSECTIONS: ', intersections);
    const fitness = pathLength + segmentsCount * 2 + intersections * 100;
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