import { IGAParams } from "../types";

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

class ReportGeneration {
  private stats: number[];

  constructor() {
    this.stats = [];
  }

  addStat(stat: number) {
    this.stats.push(stat);
  }
  getBest() {
    //
  }

  getAvg() {
    //
  }

  getWorst() {
    //
  }
}

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
      ],
      fieldDelimiter: ';'
    });

    const data = [
      {
        generation: 0,
        best: 100,
        average: 26,
        worst: 10
      }
    ];
    
    csvWriter
      .writeRecords(data)
      .then(() => console.log('The CSV file was written successfully'));
  }
}