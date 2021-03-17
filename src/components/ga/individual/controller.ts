import * as mechanic from "./mechanic";
import { Chromosom, Direction, IndividualModel } from "./model";
import * as util from "./util";
import { IndividualView } from "./view";

export class IndividualController {
  
  generateRandom(maxWidth: number, maxHeight: number, connections: Connection[]) {
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
      let currentPoint = { ...pointA };
      let direction = mechanic.randomDirection([]);
      while(true) {
        if(util.isSamePoint(currentPoint, pointB)) break;
        const forbidden = this.getForbiddenDirections(
          currentPoint, 
          { min: 0, max: maxWidth - 1}, 
          { min: 0, max: maxHeight - 1 }
        );
        forbidden.push(util.getOppositeDirection(direction));
        direction = mechanic.randomDirection(forbidden);
        currentPoint = mechanic.moveInDirection(currentPoint, direction, 1);
        let lastDirection = null;
        if(chromosom.path.length > 0) {
          lastDirection = chromosom.path[chromosom.path.length - 1][0];
        }
        if(lastDirection === direction) {
          chromosom.path[chromosom.path.length - 1][1] += 1;
        } else {
          chromosom.path.push([direction, 1]);
        }
      }
      genotype.push(chromosom);
    }
    const individual = new IndividualModel().setGenotype(genotype);
    const fitness = this.countFitness(genotype);
    individual.setFitness(fitness);
    return individual;
  }

  countFitness(genotype: Chromosom[]) {
    let pathLength = 0;
    let segmentsCount = 0;
    const intersections = this.countIntersections(genotype);
    for(let i = 0; i < genotype.length; i++) {
      const chromosom = genotype[i];
      segmentsCount += chromosom.path.length;
      for(let j = 0; j < chromosom.path.length; j++) {
        const segment = chromosom.path[j];
        const len = segment[1];
        pathLength += len;
      }
    }
    // console.log('PATH LENGTH: ', pathLength);
    // console.log('SEGMENT COUNT: ', segmentsCount);
    // console.log('INTERSECTIONS: ', intersections);
    const fitness = pathLength + segmentsCount * 2 + intersections * 100;
    return fitness;
  }

  paint(individual: IndividualModel, container: HTMLElement) {
    const existingLines = document.getElementsByClassName('line');
    while(existingLines.length > 0)
      existingLines[0].parentElement.removeChild(existingLines[0]);
    const board = document.querySelector('.board');
    const genotype = individual.getGenotype();
    const fitness = individual.getFitness();
    const view = new IndividualView(container);
    const conn = view.createConnections(genotype);
    const label = view.createFitnessLabel(fitness);
    conn.map(c => board.appendChild(c));
    container.appendChild(label);
  }



  private getForbiddenDirections(
    point: Point, 
    x: { min: number, max: number },
    y: { min: number, max: number }
  ) {
    const forbidden = [];
    if(point.x <= x.min) forbidden.push(Direction.LEFT);
    if(point.x >= x.max) forbidden.push(Direction.RIGHT);
    if(point.y <= y.min) forbidden.push(Direction.UP);
    if(point.y >= y.max) forbidden.push(Direction.DOWN);
    return forbidden; 
  }

  private countIntersections(genotype: Chromosom[]) {
    let points: Point[] = [];
    for(let i = 0; i < genotype.length; i++) {
      const chromosom = genotype[i];
      let position = { ...chromosom.start };
      points.push(chromosom.start);
      for(let j = 0; j < chromosom.path.length; j++) {
        const segment = chromosom.path[j];
        const direction = segment[0];
        const len = segment[1];
        for(let m = 0; m < len; m++) {
          position = mechanic.moveInDirection(position, direction, 1);
          points.push({ ...position });
        }
      }
    }
    let intersections = 0;
    while(points.length > 0) {
      const same = points.filter(p => p.x === points[0].x && p.y === points[0].y);
      if(same.length > 1) {
        intersections++;
      }
      points = util.removePoint(points, same[0]);
    }
    return intersections;
  }
}