import styles from './WordleGrid.module.css';
import WordleRow from './WordleRow';
import type { RowState } from '@/lib/wordle/types';

interface Props {
  board: RowState[];
  shakingRow: number | null;
  bouncingRow: number | null;
}

export default function WordleGrid({ board, shakingRow, bouncingRow }: Props) {
  return (
    <div className={styles.grid}>
      {board.map((row, i) => (
        <WordleRow
          key={i}
          tiles={row}
          isShaking={shakingRow === i}
          isBouncing={bouncingRow === i}
        />
      ))}
    </div>
  );
}
