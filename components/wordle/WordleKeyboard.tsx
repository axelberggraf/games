import styles from './WordleKeyboard.module.css';
import WordleKey from './WordleKey';
import type { KeyboardState } from '@/lib/wordle/types';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

interface Props {
  keyboardState: KeyboardState;
  onKey: (key: string) => void;
}

export default function WordleKeyboard({ keyboardState, onKey }: Props) {
  return (
    <div className={styles.keyboard}>
      {ROWS.map((row, ri) => (
        <div key={ri} className={styles.row}>
          {row.map(label => (
            <WordleKey
              key={label}
              label={label}
              status={keyboardState[label]}
              onClick={() => onKey(label)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
