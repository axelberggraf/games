import styles from './CrosswordCell.module.css';
import type { CrosswordCell as CellType } from '@/lib/crossword/types';

interface Props {
  cell: CellType;
  cellSize: number;
  isActive: boolean;
  isHighlighted: boolean;
  isCelebrating: boolean;
  isError: boolean;
  onClick: () => void;
}

export default function CrosswordCell({ cell, cellSize, isActive, isHighlighted, isCelebrating, isError, onClick }: Props) {
  if (cell.isBlack) {
    return <div className={`${styles.cell} ${styles.black}`} style={{ width: cellSize, height: cellSize }} />;
  }

  let stateClass = '';
  if (isCelebrating) stateClass = styles.celebrating;
  else if (isActive) stateClass = styles.active;
  else if (isHighlighted) stateClass = styles.highlighted;

  const letterSize = `${Math.round(cellSize * 0.37)}px`;

  return (
    <div
      className={`${styles.cell} ${stateClass}`}
      style={{ width: cellSize, height: cellSize }}
      onClick={onClick}
    >
      {cell.number !== undefined && (
        <span className={styles.number}>{cell.number}</span>
      )}
      <span className={styles.letter} style={{ fontSize: letterSize }}>{cell.userInput}</span>
      {isError && <span className={styles.errorLine} />}
      {isCelebrating && (
        <>
          <span className={`${styles.heart} ${styles.heartTL}`}>♥</span>
          <span className={`${styles.heart} ${styles.heartTR}`}>♥</span>
          <span className={`${styles.heart} ${styles.heartBL}`}>♥</span>
          <span className={`${styles.heart} ${styles.heartBR}`}>♥</span>
        </>
      )}
    </div>
  );
}
