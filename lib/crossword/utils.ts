import type { CrosswordPuzzle, GridState, CrosswordCell, Direction, ClueEntry, ActiveCell } from './types';

export function buildGrid(puzzle: CrosswordPuzzle): GridState {
  const { grid, clues } = puzzle;
  const ROWS = grid.length;
  const COLS = grid[0]?.length ?? 0;

  const cells: GridState = Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: COLS }, (_, col) => ({
      row,
      col,
      isBlack: grid[row][col],
      letter: '',
      userInput: '',
    }) as CrosswordCell)
  );

  for (const clue of clues) {
    const { row, col, length, direction, answer, number } = clue;
    // Mark the starting cell with the clue number
    if (cells[row][col].number === undefined) {
      cells[row][col].number = number;
    }
    for (let i = 0; i < length; i++) {
      const r = direction === 'down' ? row + i : row;
      const c = direction === 'across' ? col + i : col;
      cells[r][c].letter = answer[i];
      if (direction === 'across') {
        cells[r][c].acrossClueNum = number;
      } else {
        cells[r][c].downClueNum = number;
      }
    }
  }

  return cells;
}

export function getHighlightedCells(
  activeRow: number,
  activeCol: number,
  direction: Direction,
  cells: GridState,
): Set<string> {
  const highlighted = new Set<string>();
  const cell = cells[activeRow][activeCol];
  const clueNum = direction === 'across' ? cell.acrossClueNum : cell.downClueNum;
  if (clueNum === undefined) return highlighted;

  for (let r = 0; r < cells.length; r++) {
    for (let c = 0; c < cells[r].length; c++) {
      const target = cells[r][c];
      const matches =
        direction === 'across'
          ? target.acrossClueNum === clueNum
          : target.downClueNum === clueNum;
      if (matches) highlighted.add(`${r}-${c}`);
    }
  }
  return highlighted;
}

export function getActiveClue(
  active: ActiveCell,
  cells: GridState,
  clues: ClueEntry[],
): ClueEntry | null {
  const cell = cells[active.row][active.col];
  const clueNum =
    active.direction === 'across' ? cell.acrossClueNum : cell.downClueNum;
  if (clueNum === undefined) return null;
  return clues.find(c => c.number === clueNum && c.direction === active.direction) ?? null;
}

export function getNextCell(
  row: number,
  col: number,
  direction: Direction,
  cells: GridState,
): { row: number; col: number } | null {
  const ROWS = cells.length;
  const COLS = cells[0]?.length ?? 0;
  if (direction === 'across') {
    for (let c = col + 1; c < COLS; c++) {
      if (!cells[row][c].isBlack) return { row, col: c };
    }
  } else {
    for (let r = row + 1; r < ROWS; r++) {
      if (!cells[r][col].isBlack) return { row: r, col };
    }
  }
  return null;
}

export function getPrevCell(
  row: number,
  col: number,
  direction: Direction,
  cells: GridState,
): { row: number; col: number } | null {
  if (direction === 'across') {
    for (let c = col - 1; c >= 0; c--) {
      if (!cells[row][c].isBlack) return { row, col: c };
    }
  } else {
    for (let r = row - 1; r >= 0; r--) {
      if (!cells[r][col].isBlack) return { row: r, col };
    }
  }
  return null;
}

export function getFirstCellOfWord(
  row: number,
  col: number,
  direction: Direction,
  cells: GridState,
): { row: number; col: number } {
  const cell = cells[row][col];
  const clueNum =
    direction === 'across' ? cell.acrossClueNum : cell.downClueNum;
  if (clueNum === undefined) return { row, col };

  // Walk backward to find the start
  let r = row;
  let c = col;
  while (true) {
    const prevR = direction === 'down' ? r - 1 : r;
    const prevC = direction === 'across' ? c - 1 : c;
    if (prevR < 0 || prevC < 0) break;
    const prev = cells[prevR][prevC];
    if (prev.isBlack) break;
    const prevClueNum =
      direction === 'across' ? prev.acrossClueNum : prev.downClueNum;
    if (prevClueNum !== clueNum) break;
    r = prevR;
    c = prevC;
  }
  return { row: r, col: c };
}

export function isWordComplete(
  clue: ClueEntry,
  cells: GridState,
): boolean {
  for (let i = 0; i < clue.length; i++) {
    const r = clue.direction === 'down' ? clue.row + i : clue.row;
    const c = clue.direction === 'across' ? clue.col + i : clue.col;
    if (cells[r][c].userInput !== clue.answer[i]) return false;
  }
  return true;
}

export function isPuzzleComplete(cells: GridState): boolean {
  for (let r = 0; r < cells.length; r++) {
    for (let c = 0; c < cells[r].length; c++) {
      const cell = cells[r][c];
      if (!cell.isBlack && cell.userInput !== cell.letter) return false;
    }
  }
  return true;
}
