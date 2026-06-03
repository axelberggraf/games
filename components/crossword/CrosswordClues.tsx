import styles from './CrosswordClues.module.css';
import type { ClueEntry } from '@/lib/crossword/types';

interface Props {
  clues: ClueEntry[];
  activeClueKey: string | null;
  solvedClues: Set<string>;
  onClueClick: (clue: ClueEntry) => void;
}

export default function CrosswordClues({ clues, activeClueKey, solvedClues, onClueClick }: Props) {
  const across = clues.filter(c => c.direction === 'across').sort((a, b) => a.number - b.number);
  const down = clues.filter(c => c.direction === 'down').sort((a, b) => a.number - b.number);

  function renderList(list: ClueEntry[]) {
    return (
      <ul className={styles.clueList}>
        {list.map(c => {
          const key = `${c.number}-${c.direction}`;
          return (
            <li
              key={key}
              className={`${styles.clue} ${activeClueKey === key ? styles.active : ''} ${solvedClues.has(key) ? styles.solved : ''}`}
              onClick={() => onClueClick(c)}
            >
              <span className={styles.clueNumber}>{c.number}</span>
              <span>{c.clue}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Across</div>
        {renderList(across)}
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Down</div>
        {renderList(down)}
      </div>
    </div>
  );
}
