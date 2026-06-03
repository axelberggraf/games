'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import styles from './ConnectionsGame.module.css';
import ConnectionsGrid from './ConnectionsGrid';
import ConnectionsMistakes from './ConnectionsMistakes';
import { shuffle, checkSelection, getOneAway } from '@/lib/connections/utils';
import type { ConnectionTileState, ConnectionColor, ConnectionsPuzzle } from '@/lib/connections/types';

const MAX_MISTAKES = 6;

interface Props {
  puzzle: ConnectionsPuzzle;
  title: string;
  legendLabels?: string[];
}

export default function ConnectionsGame({ puzzle, title, legendLabels }: Props) {
  const colorOrder = puzzle.categories.map(c => c.color) as ConnectionColor[];

  const [tiles, setTiles] = useState<ConnectionTileState[]>(() => {
    const words = shuffle(puzzle.categories.flatMap(c => c.words));
    return words.map(word => ({ word, status: 'idle' }));
  });
  const [selected, setSelected] = useState<string[]>([]);
  const [solvedColors, setSolvedColors] = useState<ConnectionColor[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [message, setMessage] = useState('');
  const [shakingWords, setShakingWords] = useState<Set<string>>(new Set());

  const showMessage = useCallback((msg: string, duration = 2000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  }, []);

  const handleTileClick = useCallback((word: string) => {
    if (gameStatus !== 'playing') return;
    setSelected(prev => {
      if (prev.includes(word)) return prev.filter(w => w !== word);
      if (prev.length >= 4) return prev;
      return [...prev, word];
    });
  }, [gameStatus]);

  const handleSubmit = useCallback(() => {
    if (selected.length !== 4 || gameStatus !== 'playing') return;

    const color = checkSelection(selected, puzzle);
    if (color) {
      setSolvedColors(prev => {
        const next = [...prev, color];
        if (next.length === puzzle.categories.length) {
          setGameStatus('won');
          showMessage('Brilliant!', 4000);
        }
        return next;
      });
      setTiles(prev =>
        prev.map(t =>
          selected.includes(t.word)
            ? { ...t, status: 'solved', solvedColor: color }
            : t
        )
      );
      setSelected([]);
    } else {
      const oneAway = getOneAway(selected, puzzle);
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setShakingWords(new Set(selected));
      setTimeout(() => setShakingWords(new Set()), 600);
      setSelected([]);
      if (newMistakes >= MAX_MISTAKES) {
        setGameStatus('lost');
        setSolvedColors(colorOrder);
        setTiles(prev =>
          prev.map(t => {
            const cat = puzzle.categories.find(c => c.words.includes(t.word));
            return cat ? { ...t, status: 'solved', solvedColor: cat.color } : t;
          })
        );
        showMessage('Better luck next time!', 4000);
      } else {
        showMessage(oneAway ? 'One away…' : 'That\'s not quite right');
      }
    }
  }, [selected, gameStatus, mistakes, puzzle, colorOrder, showMessage]);

  const handleShuffle = useCallback(() => {
    setTiles(prev => {
      const unsolved = shuffle(prev.filter(t => t.status !== 'solved'));
      const solved = prev.filter(t => t.status === 'solved');
      return [...solved, ...unsolved];
    });
  }, []);

  const handleDeselect = useCallback(() => setSelected([]), []);

  const groupCount = puzzle.categories.length;
  const subtitle = `Create ${groupCount} groups of four!`;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← Games</Link>
        <h1 className={styles.headerTitle}>{title}</h1>
        <div style={{ width: 60 }} />
      </header>

      {message && <div className={styles.notification}>{message}</div>}

      <main className={styles.main}>
        <p className={styles.subtitle}>{subtitle}</p>

        {legendLabels && (
          <div className={styles.legend}>
            {colorOrder.map((color, i) => (
              <span key={color} className={styles.legendItem}>
                <span
                  className={styles.legendDot}
                  style={{ background: `var(--color-connections-${color})` }}
                />
                {legendLabels[i]}
              </span>
            ))}
          </div>
        )}

        <ConnectionsGrid
          tiles={tiles}
          selected={selected}
          solvedColors={solvedColors}
          colorOrder={colorOrder}
          puzzle={puzzle}
          shakingWords={shakingWords}
          onTileClick={handleTileClick}
        />

        <ConnectionsMistakes mistakes={mistakes} max={MAX_MISTAKES} />

        {gameStatus === 'playing' && (
          <div className={styles.actions}>
            <button className={styles.btn} onClick={handleShuffle}>Shuffle</button>
            <button className={styles.btn} onClick={handleDeselect} disabled={selected.length === 0}>
              Deselect all
            </button>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleSubmit}
              disabled={selected.length !== 4}
            >
              Submit
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
