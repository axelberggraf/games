import styles from './WordleRow.module.css';
import WordleTile from './WordleTile';
import type { RowState } from '@/lib/wordle/types';

interface Props {
  tiles: RowState;
  isShaking?: boolean;
  isBouncing?: boolean;
}

export default function WordleRow({ tiles, isShaking, isBouncing }: Props) {
  return (
    <div
      className={`${styles.row} ${isShaking ? styles.shaking : ''} ${isBouncing ? styles.bouncing : ''}`}
    >
      {tiles.map((tile, i) => (
        <WordleTile
          key={i}
          letter={tile.letter}
          status={tile.status}
          revealDelay={i * 300}
        />
      ))}
    </div>
  );
}
