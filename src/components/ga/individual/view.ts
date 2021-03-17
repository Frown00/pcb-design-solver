import { BOX_SIZE } from "../../../config/constant";
import { moveInDirection } from "./mechanic";
import { Chromosom, Line, Orientation } from "./model";
import { getLine } from "./util";

export class IndividualView {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  createFitnessLabel(fitness: number) {
    const text = document.createElement('p');
    text.innerText = `Fitness: ${fitness}`;
    return text;
  }

  createConnections(genotype: Chromosom[]): HTMLDivElement[] {
    console.log('GENOTYPE:', genotype);
    const lines = [];
    for(let i = 0; i < genotype.length; i++) {
      let position = { ...genotype[i].start };
      for(let j = 0; j < genotype[i].path.length; j++) {
        const segment = genotype[i].path[j];
        const line = getLine(position, segment);
        if(line.orientation === Orientation.VERTICAL) {
          const lineHTML = this.createVerticalLine(BOX_SIZE, line);
          lines.push(lineHTML);
        } 
        else {
          const lineHTML = this.createHorizontalLine(BOX_SIZE, line);
          lines.push(lineHTML);
        }
        position = moveInDirection(position, segment[0], segment[1]);
      }
    }
    return lines;
  }

  private createVerticalLine(boxSize: number, line: Line) {
    const lineElem = document.createElement('div');
    lineElem.classList.add('line');
    lineElem.style.left = (boxSize * line.x + boxSize / 2 - 1).toString() + 'px';
    lineElem.style.top = (boxSize * line.y + boxSize / 2 - 1).toString() + 'px';
    lineElem.style.width = (boxSize * line.len).toString() + 'px';
    return lineElem;
  }
  
  private createHorizontalLine(boxSize: number, line: Line) {
    const lineElem = document.createElement('div');
    lineElem.classList.add('line');
    lineElem.style.left = (boxSize * line.x - ((1+ line.len) * (boxSize / 2)) + boxSize - 1).toString() + 'px';
    lineElem.style.top = (boxSize * line.y + ((1+line.len)* (boxSize / 2)) - 1).toString() + 'px';
    lineElem.style.width = (boxSize * line.len).toString() + 'px';
    lineElem.style.transform = 'rotate(90deg)';
    return lineElem;
  }
}