import { Direction } from "./Individual";

export function randomDirection(exclude?: Direction[]) {
  const directions = Object.values(Direction).filter(v => !exclude.includes(v));
  const index = Math.floor((Math.random() * directions.length));
  return directions[index];
}
