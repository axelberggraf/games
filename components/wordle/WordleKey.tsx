import styles from './WordleKey.module.css';
import type { LetterStatus } from '@/lib/wordle/types';

const STATUS_CLASS: Partial<Record<LetterStatus, string>> = {
  correct: styles.correct,
  present: styles.present,
  absent: styles.absent,
};

interface Props {
  label: string;
  status?: LetterStatus;
  onClick: () => void;
}

export default function WordleKey({ label, status, onClick }: Props) {
  const isWide = label === 'ENTER' || label === '⌫';
  return (
    <button
      className={`${styles.key} ${isWide ? styles.wide : ''} ${status ? (STATUS_CLASS[status] ?? '') : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
