export interface IGAParams {
  generations?: number, 
  populationSize?: number, 
  crossingProb?: number, 
  mutationProb?: number, 
  penalty?: { 
    intersection?: number, 
    segmentCount?: number, 
    pathLength?: number 
  }
}