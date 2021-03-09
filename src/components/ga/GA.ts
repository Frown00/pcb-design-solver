import { Individual } from "../individual/Individual";

export class GA {
  private params: any;

  createPopulation() {
    const firstIndividual = new Individual().generateRandom();
    console.log(firstIndividual);
    firstIndividual.vizualize();
  }
}