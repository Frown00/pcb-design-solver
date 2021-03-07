import { Loader } from "./loader/Loader";
import { PCB } from "./pcb/PCB";

enum FileName {
  FILE_0 = 'zad0.txt',
  FILE_1 = 'zad1.txt',
  FILE_2 = 'zad2.txt',
  FILE_3 = 'zad2.txt',
}

class Program {
  static data: string;

  static load(file: string) {
    Program.data = Loader.loadTestData(file);
    PCB.createCircuitBoad(Program.data);
    PCB.circuitBoard.vizualize();
  }

  static run() {
    if(!Program.data) {
      console.error("No loaded data!");
    }
    if(!PCB.circuitBoard) {
      console.error("Error with circuit board");
    }
    PCB.solve();
  }
}

function loadData() {
  const loadingBtn = document.getElementById('load-data');
  const selectedFile = document.getElementById('file-data') as HTMLInputElement;
  loadingBtn.addEventListener('click', (event) => {
    console.log(selectedFile.value);
    const file = selectedFile.value + '.txt';
    Program.load(file);
  })
}

export function run(): void {
  const runningButton = document.getElementById('run-program');
  runningButton.addEventListener('click', (event) => {
    Program.run();
  })
}

export function listenActions(): void {
  loadData();
  run();
}