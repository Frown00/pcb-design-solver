import { remote } from "electron";
import path from 'path';
import fs from 'fs';

export class Loader {
  static loadTestData(file: string): string {
    const modalPath = path.join(remote.app.getAppPath(), '/test-data/', file)
    const data = fs.readFileSync(modalPath, 'utf-8');
    return data.trim();
  }
}