export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty' | 'tbd';

export interface TileState {
  letter: string;
  status: LetterStatus;
}

export type RowState = [TileState, TileState, TileState, TileState, TileState];

export type KeyboardState = Record<string, LetterStatus>;

export interface WordleGameState {
  solution: string;
  board: RowState[];
  currentRow: number;
  currentCol: number;
  keyboardState: KeyboardState;
  gameStatus: 'playing' | 'won';
  message: string;
  shakingRow: number | null;
  bouncingRow: number | null;
}

export type WordleAction =
  | { type: 'ADD_LETTER'; letter: string }
  | { type: 'DELETE_LETTER' }
  | { type: 'SUBMIT_GUESS' }
  | { type: 'WORD_NOT_FOUND' }
  | { type: 'CLEAR_MESSAGE' }
  | { type: 'CLEAR_SHAKE' }
  | { type: 'CLEAR_BOUNCE' };
