import styles from './ConnectionsTile.module.css';
import type { ConnectionTileState } from '@/lib/connections/types';

interface Props {
  tile: ConnectionTileState;
  isSelected: boolean;
  isShaking: boolean;
  onClick: () => void;
}

export default function ConnectionsTile({ tile, isSelected, isShaking, onClick }: Props) {
  return (
    <button
      className={`${styles.tile} ${isSelected ? styles.selected : ''} ${isShaking ? styles.shaking : ''}`}
      onClick={onClick}
    >
      {tile.word}
    </button>
  );
}
