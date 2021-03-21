import { expect } from 'chai';
import { Connection, Point } from '../../pcb/types';
import { IndividualController } from './controller';
import * as mechanic from './mechanic';
import * as util from './util';
import { Direction } from './model';

describe('Mechanic', () => {
  describe('chooseDirection', () => {
    it('should return one random weighted direction', () => {
      // Given
      const availableDirections: Direction[] = [
        Direction.DOWN, 
        Direction.LEFT, 
        Direction.UP, 
        Direction.RIGHT
      ];
      const distances = [1, 2, 3, 4];
      // When
      const result = mechanic.chooseDirection(availableDirections, distances);
      // Then
      expect(result).to.be.oneOf(availableDirections);
    });
  });
  
  describe('calcDistance()', () => {
    it('should return correct distance', () => {
      // Given
      const point1: Point = { x: 1, y: 1 };
      const point2: Point = { x: 5, y: 1 };
      // When
      const result = mechanic.calcDistance(point1, point2)
      // Then
      expect(result).to.be.equal(4);
    });
  });
});

describe('IndividualController', () => {
  describe('generateRandom', () => {
    it('should return random Individual', () => {
      // Given
      const width = 6;
      const height = 6;
      const p1: Point = { x: 0, y: 0};
      const p2: Point = { x: 1, y: 1};
      const p3: Point = { x: 2, y: 2};
      const p4: Point = { x: 2, y: 1};
      const conn1: Connection = [p1, p2];
      const conn2: Connection = [p3, p4];
      const connections: Connection[] = [conn1, conn2];
      // When
      const result = new IndividualController().generateRandom(width, height, connections)
      // Then
      util.log(result);
    });
  });
});