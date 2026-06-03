'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import styles from './CrosswordGame.module.css';
import CrosswordGrid from './CrosswordGrid';
import CrosswordClues from './CrosswordClues';
import {
  buildGrid,
  getHighlightedCells,
  getActiveClue,
  getNextCell,
  getPrevCell,
  isWordComplete,
  isPuzzleComplete,
} from '@/lib/crossword/utils';
import type { GridState, ActiveCell, Direction, CrosswordPuzzle } from '@/lib/crossword/types';

interface Props {
  puzzle: CrosswordPuzzle;
  title: string;
}

export default function CrosswordGame({ puzzle, title }: Props) {
  const [gridState, setGridState] = useState<GridState>(() => buildGrid(puzzle));
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);
  const [solvedClues, setSolvedClues] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');
  const [celebrationTiles, setCelebrationTiles] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const [clueBarTop, setClueBarTop] = useState(0);

  // iOS Safari: position:fixed scrolls with content when keyboard is open.
  // Track visualViewport.offsetTop to manually keep the bar at the visual top.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setClueBarTop(vv.offsetTop);
    update();
    vv.addEventListener('scroll', update);
    vv.addEventListener('resize', update);
    return () => {
      vv.removeEventListener('scroll', update);
      vv.removeEventListener('resize', update);
    };
  }, []);


  const highlightedCells = useMemo(() => {
    if (!activeCell) return new Set<string>();
    return getHighlightedCells(activeCell.row, activeCell.col, activeCell.direction, gridState);
  }, [activeCell, gridState]);

  const activeClue = useMemo(() => {
    if (!activeCell) return null;
    return getActiveClue(activeCell, gridState, puzzle.clues);
  }, [activeCell, gridState]);

  const activeClueKey = activeClue
    ? `${activeClue.number}-${activeClue.direction}`
    : null;

  const sortedClues = useMemo(() => [
    ...puzzle.clues.filter(c => c.direction === 'across').sort((a, b) => a.number - b.number),
    ...puzzle.clues.filter(c => c.direction === 'down').sort((a, b) => a.number - b.number),
  ], [puzzle.clues]);

  const activeClueIndex = useMemo(() => {
    if (!activeClue) return -1;
    return sortedClues.findIndex(c => c.number === activeClue.number && c.direction === activeClue.direction);
  }, [activeClue, sortedClues]);

  const navigateClue = useCallback((delta: 1 | -1) => {
    if (activeClueIndex === -1) return;
    const next = sortedClues[(activeClueIndex + delta + sortedClues.length) % sortedClues.length];
    inputRef.current?.focus({ preventScroll: true });
    setActiveCell({ row: next.row, col: next.col, direction: next.direction });
  }, [activeClueIndex, sortedClues]);

  function getValidDirection(row: number, col: number, preferred: Direction): Direction {
    const cell = gridState[row][col];
    const hasAcross = cell.acrossClueNum !== undefined;
    const hasDown = cell.downClueNum !== undefined;
    if (preferred === 'across' && hasAcross) return 'across';
    if (preferred === 'down' && hasDown) return 'down';
    if (hasAcross) return 'across';
    return 'down';
  }

  const handleCellClick = useCallback((row: number, col: number) => {
    if (gridState[row][col].isBlack) return;
    // Must focus synchronously inside the gesture handler — useEffect is too late for iOS
    inputRef.current?.focus({ preventScroll: true });
    if (activeCell && activeCell.row === row && activeCell.col === col) {
      const cell = gridState[row][col];
      if (cell.acrossClueNum !== undefined && cell.downClueNum !== undefined) {
        setActiveCell(prev => ({
          ...prev!,
          direction: prev!.direction === 'across' ? 'down' : 'across',
        }));
      }
    } else {
      const dir = activeCell
        ? getValidDirection(row, col, activeCell.direction)
        : getValidDirection(row, col, 'across');
      setActiveCell({ row, col, direction: dir });
    }
  }, [activeCell, gridState]);

  const handleClueClick = useCallback((clue: { number: number; direction: Direction; row: number; col: number }) => {
    inputRef.current?.focus({ preventScroll: true });
    setActiveCell({ row: clue.row, col: clue.col, direction: clue.direction });
  }, []);

  const checkSolvedClues = useCallback((updatedGrid: GridState) => {
    const newSolved = new Set<string>();
    for (const clue of puzzle.clues) {
      const key = `${clue.number}-${clue.direction}`;
      if (isWordComplete(clue, updatedGrid)) {
        newSolved.add(key);
      }
    }
    setSolvedClues(newSolved);
    if (isPuzzleComplete(updatedGrid)) {
      setMessage('Puzzle complete!');
      setActiveCell(null);
      inputRef.current?.blur();
      puzzle.animationTiles?.forEach((tile, i) => {
        setTimeout(() => {
          setCelebrationTiles(prev => new Set([...prev, `${tile.row}-${tile.col}`]));
        }, i * 120);
      });
    }
  }, []);

  function findNextEmpty(row: number, col: number, direction: Direction): { row: number; col: number } | null {
    const ROWS = gridState.length;
    const COLS = gridState[0]?.length ?? 0;
    let r = row;
    let c = col;
    while (true) {
      if (direction === 'across') { c++; } else { r++; }
      if (r >= ROWS || c >= COLS) break;
      if (gridState[r][c].isBlack) break;
      if (gridState[r][c].userInput === '') return { row: r, col: c };
    }
    const cell = gridState[row][col];
    const clueNum = direction === 'across' ? cell.acrossClueNum : cell.downClueNum;
    if (clueNum === undefined) return null;
    const clue = puzzle.clues.find(cl => cl.number === clueNum && cl.direction === direction);
    if (!clue) return null;
    for (let i = 0; i < clue.length; i++) {
      const tr = direction === 'down' ? clue.row + i : clue.row;
      const tc = direction === 'across' ? clue.col + i : clue.col;
      if (gridState[tr][tc].userInput === '') return { row: tr, col: tc };
    }
    const next = getNextCell(row, col, direction, gridState);
    if (next && !gridState[next.row][next.col].isBlack) return next;
    return null;
  }

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!activeCell) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const { row, col, direction } = activeCell;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (direction === 'across') {
        const next = getNextCell(row, col, 'across', gridState);
        if (next) setActiveCell({ ...next, direction: 'across' });
      } else {
        setActiveCell(prev => ({ ...prev!, direction: 'across' }));
      }
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (direction === 'across') {
        const prev = getPrevCell(row, col, 'across', gridState);
        if (prev) setActiveCell({ ...prev, direction: 'across' });
      } else {
        setActiveCell(prev => ({ ...prev!, direction: 'across' }));
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (direction === 'down') {
        const next = getNextCell(row, col, 'down', gridState);
        if (next) setActiveCell({ ...next, direction: 'down' });
      } else {
        setActiveCell(prev => ({ ...prev!, direction: 'down' }));
      }
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (direction === 'down') {
        const prev = getPrevCell(row, col, 'down', gridState);
        if (prev) setActiveCell({ ...prev, direction: 'down' });
      } else {
        setActiveCell(prev => ({ ...prev!, direction: 'down' }));
      }
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (gridState[row][col].userInput !== '') {
        setGridState(prev => {
          const next = prev.map(r => r.map(c => ({ ...c })));
          next[row][col].userInput = '';
          checkSolvedClues(next);
          return next;
        });
      } else {
        const prev = getPrevCell(row, col, direction, gridState);
        if (prev) {
          setActiveCell({ ...prev, direction });
          setGridState(g => {
            const next = g.map(r => r.map(c => ({ ...c })));
            next[prev.row][prev.col].userInput = '';
            checkSolvedClues(next);
            return next;
          });
        }
      }
      return;
    }

    if (/^[a-zA-Z]$/.test(e.key)) {
      // preventDefault stops the char from entering the input value,
      // which prevents onChange from double-firing on desktop and iOS
      e.preventDefault();
      const letter = e.key.toUpperCase();
      setGridState(prev => {
        const next = prev.map(r => r.map(c => ({ ...c })));
        next[row][col].userInput = letter;
        checkSolvedClues(next);
        return next;
      });
      const nextEmpty = findNextEmpty(row, col, direction);
      if (nextEmpty) setActiveCell({ ...nextEmpty, direction });
    }
  }, [activeCell, gridState, checkSolvedClues]);

  // On Android, keydown fires 'Unidentified' so letters arrive via onChange instead
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeCell) return;
    const val = e.target.value;
    e.target.value = '';
    if (!val) return;
    const char = val[val.length - 1];
    if (!/^[a-zA-Z]$/.test(char)) return;

    const letter = char.toUpperCase();
    const { row, col, direction } = activeCell;
    setGridState(prev => {
      const next = prev.map(r => r.map(c => ({ ...c })));
      next[row][col].userInput = letter;
      checkSolvedClues(next);
      return next;
    });
    const nextEmpty = findNextEmpty(row, col, direction);
    if (nextEmpty) setActiveCell({ ...nextEmpty, direction });
  }, [activeCell, gridState, checkSolvedClues]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← Games</Link>
        <h1 className={styles.headerTitle}>{title}</h1>
        <div style={{ width: 60 }} />
      </header>

      {message && <div className={styles.notification}>{message}</div>}

      {/*
        Captures keyboard input. Full-width strip at the bottom, transparent, sitting
        behind the mobile clue bar (z-index 49 vs 50). iOS requires real dimensions and
        non-opacity hiding — opacity:0 suppresses the virtual keyboard on some versions.
      */}
      <input
        ref={inputRef}
        type="text"
        inputMode="text"
        autoCapitalize="characters"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '54px',
          fontSize: '16px',
          color: 'transparent',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          padding: 0,
          caretColor: 'transparent',
          pointerEvents: 'none',
          zIndex: 49,
        }}
      />

      <main className={styles.main}>
        <div className={styles.activeClue}>
          {activeClue ? (
            <>
              <span className={styles.activeClueNumber}>
                {activeClue.number} {activeClue.direction === 'across' ? 'A' : 'D'} —{' '}
              </span>
              {activeClue.clue}
            </>
          ) : (
            'Tap a square to begin'
          )}
        </div>
        <div className={styles.puzzleArea}>
          <CrosswordGrid
            gridState={gridState}
            activeCell={activeCell}
            highlightedCells={highlightedCells}
            celebrationTiles={celebrationTiles}
            onCellClick={handleCellClick}
          />
          <div className={styles.clueListWrapper}>
            <CrosswordClues
              clues={puzzle.clues}
              activeClueKey={activeClueKey}
              solvedClues={solvedClues}
              onClueClick={handleClueClick}
            />
          </div>
        </div>
        <Link href="/" className={styles.backLinkBottom}>← Games</Link>
      </main>

      {activeClue && (
        <div className={styles.mobileClueBar} style={{ top: clueBarTop }}>
          <button
            className={styles.clueNavBtn}
            onPointerDown={e => { e.preventDefault(); navigateClue(-1); }}
          >←</button>
          <div className={styles.mobileClueText}>
            {activeClue.clue}
          </div>
          <button
            className={styles.clueNavBtn}
            onPointerDown={e => { e.preventDefault(); navigateClue(1); }}
          >→</button>
        </div>
      )}
    </div>
  );
}
