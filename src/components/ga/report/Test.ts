import { Report } from "./Report";

export class Test {
  private reports: Report[];

  constructor() {
    this.reports = [];
  }

  addReport(report: Report) {
    this.reports.push(report);
  }

  getBest() {
    let best = this.reports[0].getBestEver();;
    for(let i = 0; i < this.reports.length; i++) {
      const bestR = this.reports[i].getBestEver();
      if(bestR < best) {
        best = bestR;
      }
    }
    return best;
  }

  getAvg() {
    let bestSum = 0;
    for(let i = 0; i < this.reports.length; i++) {
      bestSum += this.reports[i].getBestEver();
    }
    return bestSum / this.reports.length;
  }

  getWorst() {
    let worst = this.reports[0].getBestEver();;
    for(let i = 0; i < this.reports.length; i++) {
      const bestR = this.reports[i].getBestEver();
      if(bestR > worst) {
        worst = bestR;
      }
    }
    return worst;
  }

  getDeviation() {
    const values: number[] = [];
    for(let i = 0; i < this.reports.length; i++) {
      const bestR = this.reports[i].getBestEver();
      values.push(bestR);
    }
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
}