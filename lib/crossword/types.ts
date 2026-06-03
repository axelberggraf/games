export type Direction = 'across' | 'down';

export interface CrosswordCell {
  row: number;
  col: number;
  isBlack: boolean;
  number?: number;
  letter: string;
  userInput: string;
  acrossClueNum?: number;
  downClueNum?: number;
}

export type GridState = CrosswordCell[][];

export interface ClueEntry {
  number: number;
  direction: Direction;
  clue: string;
  answer: string;
  row: number;
  col: number;
  length: number;
}

export interface CrosswordPuzzle {
  grid: boolean[][];
  clues: ClueEntry[];
  animationTiles?: { row: number; col: number }[];
}

export interface ActiveCell {
  row: number;
  col: number;
  direction: Direction;
}
