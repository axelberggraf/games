import styles from './ConnectionsMistakes.module.css';

interface Props {
  mistakes: number;
  max?: number;
}

export default function ConnectionsMistakes({ mistakes, max = 4 }: Props) {
  return (
    <div className={styles.container}>
      <span>Mistakes remaining:</span>
      <div className={styles.dots}>
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${i < max - mistakes ? '' : styles.used}`}
          />
        ))}
      </div>
    </div>
  );
}
