'use client';

import { useEffect, useRef } from 'react';
import styles from './WordleTile.module.css';
import type { LetterStatus } from '@/lib/wordle/types';

const STATUS_CLASS: Record<LetterStatus, string> = {
  correct: styles.correct,
  present: styles.present,
  absent: styles.absent,
  tbd: styles.tbd,
  empty: '',
};

interface Props {
  letter: string;
  status: LetterStatus;
  revealDelay?: number;
}

export default function WordleTile({ letter, status, revealDelay = 0 }: Props) {
  const isRevealed = status === 'correct' || status === 'present' || status === 'absent';
  const tileRef = useRef<HTMLDivElement>(null);
  const prevLetter = useRef('');

  // Pop animation when a new letter is typed
  useEffect(() => {
    if (letter && letter !== prevLetter.current && status === 'tbd') {
      const el = tileRef.current;
      if (!el) return;
      el.classList.remove(styles.popping);
      void el.offsetWidth; // reflow
      el.classList.add(styles.popping);
      const onEnd = () => el.classList.remove(styles.popping);
      el.addEventListener('animationend', onEnd, { once: true });
    }
    prevLetter.current = letter;
  }, [letter, status]);

  return (
    <div
      ref={tileRef}
      className={`${styles.tile} ${STATUS_CLASS[status]} ${isRevealed ? styles.revealing : ''}`}
      style={isRevealed ? { animationDelay: `${revealDelay}ms` } : undefined}
    >
      {letter}
    </div>
  );
}
