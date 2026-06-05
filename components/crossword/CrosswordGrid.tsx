import styles from './CrosswordGrid.module.css';
import CrosswordCell from './CrosswordCell';
import type { GridState, ActiveCell } from '@/lib/crossword/types';

interface Props {
  gridState: GridState;
  activeCell: ActiveCell | null;
  highlightedCells: Set<string>;
  celebrationTiles: Set<string>;
  errorTiles: Set<string>;
  onCellClick: (row: number, col: number) => void;
}

export default function CrosswordGrid({
  gridState,
  activeCell,
  highlightedCells,
  celebrationTiles,
  errorTiles,
  onCellClick,
}: Props) {
  const rows = gridState.length;
  const cols = gridState[0]?.length ?? 0;
  const cellSize = Math.max(rows, cols) <= 5 ? 64 : 52;

  return (
    <div
      className={styles.grid}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
      }}
    >
      {gridState.flat().map(cell => {
        const key = `${cell.row}-${cell.col}`;
        const isActive = !!(activeCell && activeCell.row === cell.row && activeCell.col === cell.col);
        const isHighlighted = highlightedCells.has(key);
        const isCelebrating = celebrationTiles.has(key);
        const isError = errorTiles.has(key);
        return (
          <CrosswordCell
            key={key}
            cell={cell}
            cellSize={cellSize}
            isActive={isActive}
            isHighlighted={isHighlighted && !isActive}
            isCelebrating={isCelebrating}
            isError={isError}
            onClick={() => onCellClick(cell.row, cell.col)}
          />
        );
      })}
    </div>
  );
}
