import { SelectionType } from "./GA";

export interface IPenalty {
  intersection: number, 
  segmentCount: number, 
  pathLength: number 
}

export interface IGAParams {
  generations?: number, 
  populationSize?: number, 
  selectionType?: SelectionType,
  tournamentRivals?: number,
  crossingProb?: number, 
  mutationProb?: number, 
  penalty?: IPenalty
}