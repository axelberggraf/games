import styles from './ConnectionsGrid.module.css';
import ConnectionsTile from './ConnectionsTile';
import ConnectionsResult from './ConnectionsResult';
import type { ConnectionTileState, ConnectionColor, ConnectionsPuzzle } from '@/lib/connections/types';

interface Props {
  tiles: ConnectionTileState[];
  selected: string[];
  solvedColors: ConnectionColor[];
  colorOrder: ConnectionColor[];
  puzzle: ConnectionsPuzzle;
  shakingWords: Set<string>;
  onTileClick: (word: string) => void;
}

export default function ConnectionsGrid({ tiles, selected, solvedColors, colorOrder, puzzle, shakingWords, onTileClick }: Props) {
  const unsolved = tiles.filter(t => t.status !== 'solved');

  return (
    <div className={styles.wrapper}>
      {colorOrder.filter(c => solvedColors.includes(c)).map(color => {
        const category = puzzle.categories.find(cat => cat.color === color)!;
        return <ConnectionsResult key={color} category={category} />;
      })}
      {unsolved.length > 0 && (
        <div className={styles.grid}>
          {unsolved.map(tile => (
            <ConnectionsTile
              key={tile.word}
              tile={tile}
              isSelected={selected.includes(tile.word)}
              isShaking={shakingWords.has(tile.word)}
              onClick={() => onTileClick(tile.word)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
