import { Chromosom, IndividualModel } from "./individual/model";
import { randomWeighted } from "./individual/util";

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
    newPopulation.push(best);
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
    newPopulation.push(population[index]);
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
  child.setGenotype(newGenotype);
  return child;
}

export function mutation(genotype: Chromosom[], maxWidth: number, maxHeight: number) {
  const newGenotype: Chromosom[] = [];
  const chromosomId = Math.floor(Math.random() * genotype.length);
  const path = genotype[chromosomId].path;
  const pathId = Math.floor(Math.random() * path.length - 1);
  const point = path[pathId];
  const nextPoint = path[pathId + 1];
   
  return newGenotype;
}