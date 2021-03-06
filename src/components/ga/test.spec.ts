import { expect } from 'chai';
import { Chromosom, IndividualModel } from './individual/model';
import { log } from './individual/util';
import * as mechanic from './mechanic';
import _ from "lodash";

describe('Mechanic', () => {
  describe('tournament()', () => {
    it('should return new population with  same size and better sum of fitness', () => {
      // Given
      const i1 = new IndividualModel().setFitness(1000);
      const i2 = new IndividualModel().setFitness(100);
      const i3 = new IndividualModel().setFitness(2000);
      const i4 = new IndividualModel().setFitness(50);
      const i5 = new IndividualModel().setFitness(10);
      const population: IndividualModel[] = [i1, i2, i3, i4, i5];
      const rivalsCount = 5;
      // When
      const result = mechanic.tournament(population, rivalsCount);
      // Then
      expect(result.length).to.be.equal(population.length);
      expect(result.reduce((acc, next) => acc + next.getFitness(), 0))
        .to.be.lessThan(population.reduce((acc, next) => acc + next.getFitness(), 0));
    });
  });

  describe('roulette()', () => {
    it('should return new population with same size', () => {
      // Given
      const i1 = new IndividualModel().setFitness(1000);
      const i2 = new IndividualModel().setFitness(100);
      const i3 = new IndividualModel().setFitness(2000);
      const i4 = new IndividualModel().setFitness(50);
      const i5 = new IndividualModel().setFitness(10);
      const population: IndividualModel[] = [i1, i2, i3, i4, i5];
      // When
      const result = mechanic.roulette(population);
      // Then
      expect(result.length).to.be.equal(population.length);
      // expect(result.reduce((acc, next) => acc + next.getFitness(), 0))
      //   .to.be.lessThan(population.reduce((acc, next) => acc + next.getFitness(), 0));
    });
  });

  describe('crossover()', () => {
    it('should return new child', () => {
      // Given
      const g1: Chromosom[] = [
        {
          start: {x: 0, y: 0}, 
          end: {x: 0, y: 1}, 
          path: [{x: 0, y: 2}, {x: 0, y: 1}]
        },
        {
          start: {x: 1, y: 1}, 
          end: {x: 2, y: 1}, 
          path: [{x: 0, y: 2}, {x: 2, y: 1}]
        },
        {
          start: {x: 3, y: 4}, 
          end: {x: 4, y: 1}, 
          path: [{x: 0, y: 2},  {x: 4, y: 1}]
        },
      ];
      const g2: Chromosom[] = [
        {
          start: {x: 0, y: 0}, 
          end: {x: 0, y: 1}, 
          path: [{x: 0, y: 2}, {x: 1, y: 2}, {x: 1, y:1 }, {x: 0, y: 1}]
        },
        {
          start: {x: 1, y: 1}, 
          end: {x: 2, y: 1}, 
          path: [{x: 0, y: 2}, {x: 1, y: 2}, {x: 1, y:1 }, {x: 2, y: 1}]
        },
        {
          start: {x: 3, y: 4}, 
          end: {x: 4, y: 1}, 
          path: [{x: 0, y: 2}, {x: 1, y: 2}, {x: 1, y:1 }, {x: 4, y: 1}]
        },
      ];
      const parent1 = new IndividualModel().setGenotype(g1);
      const parent2 = new IndividualModel().setGenotype(g2);
      // When
      const child = mechanic.crossover(parent1, parent2);
      // Then
      expect(child.getGenotype().length).to.be.equal(g1.length);
    });
  });

  describe('mutation()', () => {
    it('should return new child', () => {
      // Given
      const g1: Chromosom[] = [
        {
          start: {x: 1, y: 1}, 
          end: {x: 2, y: 1}, 
          path: [{x: 0, y: 2}, {x: 3, y: 2}, {x: 3, y: 5}, {x: 0, y: 5}, {x: 0, y: 1}]
        },
      ];
      const len = g1[0].path.length;
      const maxWidth = 10;
      const maxHeight = 10;
      // When
      mechanic.mutation(g1, maxWidth, maxHeight);
      // Then
      // log(g1);
      expect(g1[0].path.length).to.be.equal(len);
      for(let i = 0; i < g1[0].path.length; i++) {
        const point = g1[0].path[i];
        expect(point.x).to.be.lessThan(maxWidth);
        expect(point.x).to.be.greaterThan(-1);
        expect(point.y).to.be.lessThan(maxHeight);
        expect(point.y).to.be.greaterThan(-1);
      }
    });
  });
});
