import { Program } from "./Program";

function load() {
  const loadingBtn = document.getElementById('load-data');
  const selectedFile = document.getElementById('file-data') as HTMLInputElement;
  loadingBtn.addEventListener('click', (event) => {
    console.log(selectedFile.value);
    const file = selectedFile.value + '.txt';
    Program.load(file);
  })
}

function run(): void {
  const runningButton = document.getElementById('run-program');
  runningButton.addEventListener('click', (event) => {
    Program.run();
  })
}

export function listen(): void {
  load();
  run();
}