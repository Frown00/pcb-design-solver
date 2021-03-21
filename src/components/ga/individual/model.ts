
import * as types from '../../pcb/types';

export class IndividualModel {
  private genotype: Chromosom[];
  private fitness: number;
  private stats: {
    pathTotal: number;
    intersections: number;
    segmentsCount: number;
  }

  setStats(intersections: number, pathTotal: number, segmentsCount: number) {
    this.stats = { intersections, pathTotal, segmentsCount}
  }

  getStats() {
    return this.stats;
  }

  getFitness() {
    return this.fitness;
  }

  setFitness(fitness: number) {
    this.fitness = fitness;
    return this;
  }

  getGenotype() {
    return this.genotype;
  }

  setGenotype(genotype: Chromosom[]) {
    this.genotype = genotype;
    return this;
  }
}

export enum Direction {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right"
}

export enum Orientation {
  HORIZONTAL,
  VERTICAL
}

export type Line = { 
  x: number, 
  y: number, 
  len: number, 
  orientation: Orientation 
};

export type Segment = types.Point;
export type Chromosom = { start: types.Point, end: types.Point, path: Segment[] };
type Length = number;
