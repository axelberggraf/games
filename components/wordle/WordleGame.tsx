'use client';

import { useEffect, useCallback, useReducer, useState } from 'react';
import styles from './WordleGame.module.css';
import WordleGrid from './WordleGrid';
import WordleKeyboard from './WordleKeyboard';
import { SOLUTION } from '@/lib/wordle/data';
import { evaluateGuess, updateKeyboardState } from '@/lib/wordle/evaluate';
import type { WordleGameState, WordleAction, RowState, TileState } from '@/lib/wordle/types';

async function checkWordValidity(word: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`,
      { signal: AbortSignal.timeout(4000) }
    );
    return res.ok;
  } catch {
    return true; // allow through on network error to avoid blocking gameplay
  }
}

const EMPTY_TILE: TileState = { letter: '', status: 'empty' };
const EMPTY_ROW: RowState = [EMPTY_TILE, EMPTY_TILE, EMPTY_TILE, EMPTY_TILE, EMPTY_TILE];

function makeInitialState(): WordleGameState {
  return {
    solution: SOLUTION,
    board: Array(6).fill(null).map(() => [...EMPTY_ROW] as RowState),
    currentRow: 0,
    currentCol: 0,
    keyboardState: {},
    gameStatus: 'playing',
    message: '',
    shakingRow: null,
    bouncingRow: null,
  };
}

function reducer(state: WordleGameState, action: WordleAction): WordleGameState {
  if (state.gameStatus !== 'playing' && action.type !== 'CLEAR_MESSAGE' && action.type !== 'CLEAR_SHAKE' && action.type !== 'CLEAR_BOUNCE') {
    return state;
  }

  switch (action.type) {
    case 'ADD_LETTER': {
      if (state.currentCol >= 5) return state;
      const board = state.board.map(r => [...r]) as WordleGameState['board'];
      board[state.currentRow][state.currentCol] = { letter: action.letter, status: 'tbd' };
      return { ...state, board, currentCol: state.currentCol + 1 };
    }

    case 'DELETE_LETTER': {
      if (state.currentCol <= 0) return state;
      const col = state.currentCol - 1;
      const board = state.board.map(r => [...r]) as WordleGameState['board'];
      board[state.currentRow][col] = EMPTY_TILE;
      return { ...state, board, currentCol: col };
    }

    case 'WORD_NOT_FOUND':
      return { ...state, message: 'Not in dictionary', shakingRow: state.currentRow };

    case 'SUBMIT_GUESS': {
      if (state.currentCol < 5) {
        return { ...state, message: 'Not enough letters', shakingRow: state.currentRow };
      }
      const guess = state.board[state.currentRow].map(t => t.letter).join('');
      const evaluated = evaluateGuess(guess, state.solution);
      const board = state.board.map(r => [...r]) as WordleGameState['board'];
      board[state.currentRow] = evaluated;
      const keyboardState = updateKeyboardState(state.keyboardState, evaluated);
      const won = guess === state.solution;
      const lost = !won && state.currentRow === 5;
      return {
        ...state,
        board,
        keyboardState,
        currentRow: state.currentRow + 1,
        currentCol: 0,
        gameStatus: won ? 'won' : lost ? 'lost' : 'playing',
        message: won ? 'Brilliant!' : lost ? state.solution : '',
        bouncingRow: won ? state.currentRow : null,
        shakingRow: null,
      };
    }

    case 'CLEAR_MESSAGE':
      return { ...state, message: '' };
    case 'CLEAR_SHAKE':
      return { ...state, shakingRow: null };
    case 'CLEAR_BOUNCE':
      return { ...state, bouncingRow: null };

    default:
      return state;
  }
}

export default function WordleGame() {
  const [state, dispatch] = useReducer(reducer, null, makeInitialState);
  const [isValidating, setIsValidating] = useState(false);

  const handleEnter = useCallback(async () => {
    if (state.gameStatus !== 'playing' || isValidating) return;
    if (state.currentCol < 5) {
      dispatch({ type: 'SUBMIT_GUESS' });
      return;
    }
    const guess = state.board[state.currentRow].map(t => t.letter).join('');
    setIsValidating(true);
    try {
      const valid = await checkWordValidity(guess);
      dispatch({ type: valid ? 'SUBMIT_GUESS' : 'WORD_NOT_FOUND' });
    } finally {
      setIsValidating(false);
    }
  }, [state, isValidating]);

  const handleKey = useCallback((key: string) => {
    if (isValidating) return;
    if (key === 'ENTER') {
      handleEnter();
    } else if (key === '⌫' || key === 'Backspace') {
      dispatch({ type: 'DELETE_LETTER' });
    } else if (/^[A-Za-z]$/.test(key)) {
      dispatch({ type: 'ADD_LETTER', letter: key.toUpperCase() });
    }
  }, [isValidating, handleEnter]);

  // Physical keyboard
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      handleKey(e.key === 'Backspace' ? '⌫' : e.key);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  // Clear shake after animation
  useEffect(() => {
    if (state.shakingRow !== null) {
      const t = setTimeout(() => dispatch({ type: 'CLEAR_SHAKE' }), 600);
      return () => clearTimeout(t);
    }
  }, [state.shakingRow]);

  // Clear message after timeout
  useEffect(() => {
    if (state.message && state.gameStatus === 'playing') {
      const t = setTimeout(() => dispatch({ type: 'CLEAR_MESSAGE' }), 1800);
      return () => clearTimeout(t);
    }
  }, [state.message, state.gameStatus]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Wordle</h1>
      </header>

      {state.message && (
        <div className={styles.notification}>{state.message}</div>
      )}

      <main className={styles.main}>
        <WordleGrid
          board={state.board}
          shakingRow={state.shakingRow}
          bouncingRow={state.bouncingRow}
        />
        <div className={styles.keyboard}>
          <WordleKeyboard keyboardState={state.keyboardState} onKey={handleKey} />
        </div>
      </main>
    </div>
  );
}
