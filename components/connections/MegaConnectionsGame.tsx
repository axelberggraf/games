'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './MegaConnectionsGame.module.css';
import type { ConnectionColor } from '@/lib/connections/types';
import type { MegaConnectionsPuzzle } from '@/lib/connections/mega-data';

const TILES_PER_GROUP = 4;

interface MegaTile {
  id: string;
  status: 'idle' | 'solved';
  solvedColor?: ConnectionColor;
}

interface Props {
  puzzle: MegaConnectionsPuzzle;
  title: string;
}

export default function MegaConnectionsGame({ puzzle, title }: Props) {
  const totalTiles = puzzle.categories.length * TILES_PER_GROUP;
  const colorOrder = puzzle.categories.map(c => c.color);

  const [tiles, setTiles] = useState<MegaTile[]>(() =>
    Array.from({ length: totalTiles }, (_, i) => ({ id: `tile-${i}`, status: 'idle' }))
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [solvedColors, setSolvedColors] = useState<ConnectionColor[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won'>('playing');
  const [message, setMessage] = useState('');
  const latestBannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (solvedColors.length === 0) return;
    latestBannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [solvedColors]);

  const showMessage = useCallback((msg: string, duration = 2000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  }, []);

  const handleTileClick = useCallback((id: string) => {
    if (gameStatus !== 'playing') return;
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }, [gameStatus]);

  const handleSubmit = useCallback(() => {
    if (selected.length !== 4 || gameStatus !== 'playing') return;

    const nextColor = colorOrder[solvedColors.length];
    const category = puzzle.categories.find(c => c.color === nextColor)!;

    setTiles(prev => prev.map(t =>
      selected.includes(t.id) ? { ...t, status: 'solved', solvedColor: nextColor } : t
    ));

    setSolvedColors(prev => {
      const next = [...prev, nextColor];
      if (next.length === puzzle.categories.length) {
        setGameStatus('won');
        showMessage('Brilliant!', 4000);
      }
      return next;
    });

    setSelected([]);
  }, [selected, gameStatus, solvedColors, colorOrder, puzzle, showMessage]);

  const handleShuffle = useCallback(() => {
    setTiles(prev => {
      const solved = prev.filter(t => t.status === 'solved');
      const unsolved = prev.filter(t => t.status !== 'solved');
      for (let i = unsolved.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unsolved[i], unsolved[j]] = [unsolved[j], unsolved[i]];
      }
      return [...solved, ...unsolved];
    });
  }, []);

  const handleDeselect = useCallback(() => setSelected([]), []);

  const unsolved = tiles.filter(t => t.status !== 'solved');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← Games</Link>
        <h1 className={styles.headerTitle}>{title}</h1>
        <div style={{ width: 60 }} />
      </header>

      {message && <div className={styles.notification}>{message}</div>}

      <main className={styles.main}>
        <p className={styles.subtitle}>
          {`Create ${puzzle.categories.length} groups of four!`}
        </p>

        <div className={styles.wrapper}>
          {colorOrder.filter(c => solvedColors.includes(c)).map(color => {
            const cat = puzzle.categories.find(c => c.color === color)!;
            const isLatest = color === solvedColors[solvedColors.length - 1];
            return (
              <div
                key={color}
                ref={isLatest ? latestBannerRef : null}
                className={styles.banner}
                style={{ background: `var(--color-connections-${color})` }}
              >
                <span className={styles.bannerDifficulty}>{cat.difficulty}</span>
                <span className={styles.bannerLabel}>{cat.label}</span>
              </div>
            );
          })}
          {unsolved.length > 0 && (
            <div className={styles.grid}>
              {unsolved.map(tile => (
                <button
                  key={tile.id}
                  className={`${styles.tile} ${selected.includes(tile.id) ? styles.selected : ''}`}
                  onClick={() => handleTileClick(tile.id)}
                >
                  {puzzle.word}
                </button>
              ))}
            </div>
          )}
        </div>

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
