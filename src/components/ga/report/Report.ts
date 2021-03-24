import { IGAParams } from "../types";
import _ from "lodash";

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

export class Report {
  private stats: { [genId: number]: number[] };

  constructor() {
    this.stats = {};
  }

  addGeneration(genId: number, popFitness: number[]) {
    if(!this.stats[genId]) {
      this.stats[genId] = [];
    }
    this.stats[genId] = popFitness;
  }

  getBest(genId: number) {
    const stats = this.stats[genId];
    return Math.min(...stats);
  }

  getAvg(genId: number) {
    const stats = this.stats[genId];
    return _.sum(stats) / stats.length;
  }

  getWorst(genId: number) {
    const stats = this.stats[genId];
    return Math.max(...stats);
  }

  getBestEver() {
    let bestEver = this.getBest(1);
    Object.keys(this.stats).forEach((key) => {
      const best = this.getBest(parseInt(key));
      if(best < bestEver) {
        bestEver = best;
      }
    })
    return bestEver;
  }

  getDeviation(genId: number) {
    const values = this.stats[genId];
    const len = values.length;
    let i = 0;
    let value;
    let mean = 0;
    let sum = 0;
    while (i<len) {
      const delta = (value = values[i]) - mean;
      mean += delta / ++i;
      sum += delta * (value - mean);
    }
  
    return Math.sqrt(sum / (i - 1));
  }

  writeToCSV(params: IGAParams) {
    const path = `Gen=${params.generations} Pop=${params.populationSize} S=${params.selectionType}` +
      ` R=${params.tournamentRivals} CX=${params.crossingProb} MX=${params.mutationProb}` +
      ` P=${params.penalty.intersection} ${params.penalty.segmentCount} ${params.penalty.pathLength}`;
    const format = '.csv';
    const csvWriter = createCsvWriter({
      path: `results/${path}${format}`,
      header: [
        {id: 'generation', title: 'Generation'},
        {id: 'best', title: 'Best'},
        {id: 'average', title: 'Average'},
        {id: 'worst', title: 'Worst'},
        {id: 'std', title: 'Std'},
      ],
      fieldDelimiter: ';'
    });
    const data = [];
    for(let i = 1; i <= Object.keys(this.stats).length; i++) {
      const genId = i;
      data.push({
        generation: i,
        best: this.getBest(genId),
        average: this.getAvg(genId),
        worst: this.getWorst(genId),
        std: this.getDeviation(genId)
      })
    }
    csvWriter
      .writeRecords(data)
      .then(() => console.log('The CSV file was written successfully'));
  }
}