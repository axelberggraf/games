import type { LetterStatus, TileState, RowState, KeyboardState } from './types';

export function evaluateGuess(guess: string, solution: string): RowState {
  const result: TileState[] = Array(5).fill(null).map((_, i) => ({
    letter: guess[i],
    status: 'absent' as LetterStatus,
  }));

  // Count available solution letters
  const solutionLetterCount: Record<string, number> = {};
  for (const char of solution) {
    solutionLetterCount[char] = (solutionLetterCount[char] || 0) + 1;
  }

  // Pass 1: mark correct positions
  for (let i = 0; i < 5; i++) {
    if (guess[i] === solution[i]) {
      result[i].status = 'correct';
      solutionLetterCount[guess[i]]--;
    }
  }

  // Pass 2: mark present / absent
  for (let i = 0; i < 5; i++) {
    if (result[i].status === 'correct') continue;
    if (solutionLetterCount[guess[i]] > 0) {
      result[i].status = 'present';
      solutionLetterCount[guess[i]]--;
    } else {
      result[i].status = 'absent';
    }
  }

  return result as RowState;
}

export function updateKeyboardState(
  current: KeyboardState,
  row: RowState,
): KeyboardState {
  const STATUS_RANK: Record<LetterStatus, number> = {
    correct: 3,
    present: 2,
    absent: 1,
    tbd: 0,
    empty: 0,
  };

  const next = { ...current };
  for (const tile of row) {
    const existing = next[tile.letter];
    if (!existing || STATUS_RANK[tile.status] > STATUS_RANK[existing]) {
      next[tile.letter] = tile.status;
    }
  }
  return next;
}
