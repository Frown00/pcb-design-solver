import { Point } from "../../pcb/types";
import { BOX_SIZE } from "../../../config/constant";
import { calcDistance } from "./mechanic";
import { Chromosom, Direction, Orientation } from "./model";
import { getDirection, getOrientation } from "./util";

export class IndividualView {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  createFitnessLabel(fitness: number) {
    const text = document.createElement('p');
    text.classList.add("fitness");
    text.innerText = `Fitness: ${fitness}`;
    return text;
  }

  createConnections(genotype: Chromosom[]): HTMLDivElement[] {
    console.log('GENOTYPE:', genotype);
    const lines: any = [];
    const fromTo: any[] = [];
    for(let i = 0; i < genotype.length; i++) {
      let position = { ...genotype[i].start };
      for(let j = 0; j < genotype[i].path.length; j++) {
        const segment = genotype[i].path[j];
        const direction = getDirection(position, segment);
        const orientation = getOrientation(direction);
        const length = calcDistance(position, segment);
        fromTo.push({ from: position, to: segment, direction, orientation, length });
        if(orientation === Orientation.VERTICAL) {
          const toDraw = direction === Direction.RIGHT ? position : segment;
          const lineHTML = this.createVerticalLine(BOX_SIZE, toDraw, length);
          lines.push(lineHTML);
        } 
        else {
          const toDraw = direction === Direction.DOWN ? position : segment;
          const lineHTML = this.createHorizontalLine(BOX_SIZE, toDraw, length);
          lines.push(lineHTML);
        }
        position = segment;
      }
    }
    console.log(fromTo);
    return lines;
  }

  private createVerticalLine(boxSize: number, point: Point, length: number) {
    const lineElem = document.createElement('div');
    lineElem.classList.add('line');
    const leftNormalize = boxSize / 2 - 1;
    const topNormalize = boxSize / 2 - 1;
    lineElem.classList.add('x' + point.x.toString());
    lineElem.classList.add('y' + point.y.toString());
    lineElem.style.left = (leftNormalize + point.x * boxSize).toString() + 'px';
    lineElem.style.top = (topNormalize + point.y * boxSize).toString() + 'px';
    lineElem.style.width = (boxSize * length).toString() + 'px';
    return lineElem;
  }
  
  private createHorizontalLine(boxSize: number, point: Point, length: number) {
    const lineElem = document.createElement('div');
    lineElem.classList.add('line');
    lineElem.classList.add('x' + point.x.toString());
    lineElem.classList.add('y' + point.y.toString());
    const leftNormalize = -((length - 1) * boxSize / 2 + 1);
    const topNormalize = ((length + 1) * boxSize / 2 - 1);
    lineElem.style.left = (leftNormalize + point.x * boxSize).toString() + 'px';
    lineElem.style.top = (topNormalize + point.y * boxSize).toString() + 'px';
    lineElem.style.width = (boxSize * length).toString() + 'px';
    lineElem.style.transform = 'rotate(90deg)';
    return lineElem;
  }
}