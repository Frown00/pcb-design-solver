import { Loader } from "../../loader/Loader";
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
    this.cboard.solve();
  }

}

