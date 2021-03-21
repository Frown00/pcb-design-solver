export interface IPenalty {
  intersection: number, 
  segmentCount: number, 
  pathLength: number 
}

export interface IGAParams {
  generations?: number, 
  populationSize?: number, 
  crossingProb?: number, 
  mutationProb?: number, 
  penalty?: IPenalty
}