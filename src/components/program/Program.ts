import { Loader } from "../../loader/Loader";
import { SelectionType } from "../ga/GA";
import { IGAParams } from "../ga/types";
import { PCB } from "../pcb/PCB";

export class Program {
  static cboard: PCB;

  static load(file: string) {
    const data = Loader.loadTestData(file);
    this.cboard = new PCB();
    this.cboard.createCircuitBoad(data);
    this.cboard.paint();
  }

  static run() {
    if(!Program.cboard) {
      console.error("Error with circuit board");
    }
    const generations = document.getElementById('generations') as HTMLInputElement;
    const population = document.getElementById('population-size') as HTMLInputElement;
    const selection = document.getElementById('selection-type') as HTMLInputElement;
    const tournamentRivals = document.getElementById('tournament-rivals') as HTMLInputElement;
    const crossing = document.getElementById('crossing-prob') as HTMLInputElement;
    const mutation = document.getElementById('mutation-prob') as HTMLInputElement;
    const penaltyIntersection = document.getElementById('penalty-intersection') as HTMLInputElement;
    const penaltySegment = document.getElementById('penalty-segment-count') as HTMLInputElement;
    const penaltyPath = document.getElementById('penalty-path-length') as HTMLInputElement;
    const params: IGAParams = {
      generations: isNaN(parseInt(generations.value)) ? undefined : parseInt(generations.value),
      populationSize: isNaN(parseInt(population.value)) ? undefined : parseInt(population.value),
      selectionType: <SelectionType> selection.value,
      tournamentRivals: isNaN(parseInt(tournamentRivals.value)) ? undefined : parseInt(tournamentRivals.value),
      crossingProb: isNaN(parseInt(crossing.value)) ? undefined : parseInt(crossing.value),
      mutationProb: isNaN(parseInt(mutation.value)) ? undefined : parseInt(mutation.value),
      penalty: {
        intersection: isNaN(parseInt(penaltyIntersection.value)) ? undefined : parseInt(penaltyIntersection.value),
        pathLength: isNaN(parseInt(penaltyPath.value)) ? undefined : parseInt(penaltyPath.value),
        segmentCount:isNaN(parseInt(penaltySegment.value)) ? undefined : parseInt(penaltySegment.value),
      }
    }
    this.cboard.solve(params);
  }

}

