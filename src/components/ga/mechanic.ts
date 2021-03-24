import { Point } from "../pcb/types";
import { Chromosom, IndividualModel, Orientation } from "./individual/model";
import { getDirection, getOrientation, isSamePoint, randomWeighted } from "./individual/util";
import _ from "lodash";

export function tournament(population: IndividualModel[], rivalsCount: number): IndividualModel[] {
  const newPopulation = [];
  const size = population.length;
  rivalsCount = Math.max(1, Math.min(rivalsCount, size));
  while(newPopulation.length < size) {
    const rivals = [];
    for(let i = 0; i < rivalsCount; i++) {
      const index = Math.floor(Math.random() * size);
      rivals.push(population[index]);
    }
    let best = rivals[0];
    for(let i = 0; i < rivals.length; i++) {
      if(rivals[i].getFitness() < best.getFitness()) {
        best = rivals[i];
      }
    }
    newPopulation.push(_.cloneDeep(best));
  }
  return newPopulation;
}

export function roulette(population: IndividualModel[]) {
  const sum = population.reduce((acc, next) => acc + next.getFitness(), 0);
  const weights = population.map(p => sum - p.getFitness());
  const newPopulation = [];
  const size = population.length;
  while(newPopulation.length < size) {
    const index = randomWeighted(weights);
    newPopulation.push(_.cloneDeep(population[index]));
  }
  return newPopulation;
}

export function crossover(parent1: IndividualModel, parent2: IndividualModel): IndividualModel {
  const child = new IndividualModel();
  const genotype1 = parent1.getGenotype();
  const genotype2 = parent2.getGenotype();
  const newGenotype: Chromosom[] = [];
  const chromosomId = Math.floor(Math.random() * genotype2.length);
  for(let i = 0; i < genotype2.length; i++) {
    if(i === chromosomId) {
      newGenotype.push(genotype1[i]);
    } else {
      newGenotype.push(genotype2[i]);
    }
  }
  child.setGenotype(_.cloneDeep(newGenotype));
  return child;
}

export function mutation(genotype: Chromosom[], maxWidth: number, maxHeight: number) {
  const chromosomId = Math.floor(Math.random() * genotype.length);
  const newGenotype = _.cloneDeep(genotype);
  const path = newGenotype[chromosomId].path;
  if(path.length < 4) return newGenotype;
  const pathId = _.random(0, path.length - 4);
  const joint = path[pathId];
  let movingPoint = path[pathId + 1];
  let nextMovingPoint = path[pathId + 2];
  const joint2 = path[pathId + 3];
  const direction = getDirection(joint, movingPoint);
  const orientation = getOrientation(direction);
  const { min, max } = getMinMaxMove(movingPoint, orientation, maxHeight, maxWidth);
  const change = _.random(min, max);
  movingPoint = mutationMove(movingPoint, orientation, change);
  nextMovingPoint = mutationMove(nextMovingPoint, orientation, change);
  fixMove(joint, movingPoint, nextMovingPoint, orientation);
  fixMove(joint2, nextMovingPoint, movingPoint, orientation);
  path[pathId + 1] = movingPoint;
  path[pathId + 2] = nextMovingPoint;
  fixPath(path);
  return newGenotype;
}

function getMinMaxMove(point: Point, orientation: Orientation, maxHeight: number, maxWidth: number) {
  if(orientation === Orientation.HORIZONTAL) {
    return {
      min: -point.y,
      max: (maxHeight - 1) - point.y
    }
  }
  if(orientation === Orientation.VERTICAL) {
    return {
      min: -point.x,
      max: (maxWidth - 1) - point.x
    }
  }
}

function mutationMove(point: Point, orientation: Orientation, move: number) {
  const { x, y } = point;
  if(orientation === Orientation.HORIZONTAL) 
    return { 
      x, y: y + move 
    };
  if(orientation === Orientation.VERTICAL) 
    return { 
      x: x + move, y
    };
}

function fixPath(path: Point[]) {
  for(let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i+1];
    if(isSamePoint(p1, p2)) {
      path.splice(i, 1);
    }
  }
}

function fixMove(
  joint: Point, 
  movingPoint: Point,
  nextMovingPoint: Point, 
  orientation: Orientation
) {
  if(isSamePoint(joint, movingPoint)) {
    if(orientation === Orientation.HORIZONTAL) {
      if(joint.y === 0) {
        movingPoint.y++;
        nextMovingPoint.y++;
      } else {
        movingPoint.y--;
        nextMovingPoint.y--;
      }
    }
    if(orientation === Orientation.VERTICAL) {
      if(joint.x === 0) {
        movingPoint.x++;
        nextMovingPoint.x++;
      } else {
        movingPoint.x--;
        nextMovingPoint.x--;
      }
    }
  }
}
