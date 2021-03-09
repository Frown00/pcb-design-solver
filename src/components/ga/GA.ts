import { Individual } from "../individual/Individual";

export class GA {
  private params: any;

  createPopulation() {
    const population: Individual[] = [];
    for(let i = 0; i < 10; i++) {
      const individual = new Individual().generateRandom();
      individual.countFitness();
      population.push(individual);
    }
    let best = population[0];
    for(let i = 1; i < population.length; i++) {
      if(population[i].getFitness() < best.getFitness()) {
        best = population[i];
      }
    }
    console.log("FITNESS:", best.getFitness());
    best.vizualize();
  }
}