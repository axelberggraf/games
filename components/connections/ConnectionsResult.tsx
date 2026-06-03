import styles from './ConnectionsResult.module.css';
import type { ConnectionCategory } from '@/lib/connections/types';

interface Props {
  category: ConnectionCategory;
}

const COLOR_CLASS = {
  yellow: styles.yellow,
  green: styles.green,
  blue: styles.blue,
  purple: styles.purple,
  orange: styles.orange,
  red: styles.red,
  pink: styles.pink,
  teal: styles.teal,
};

export default function ConnectionsResult({ category }: Props) {
  return (
    <div className={`${styles.banner} ${COLOR_CLASS[category.color]}`}>
      <span className={styles.label}>{category.label}</span>
      <span className={styles.words}>{category.words.join(', ')}</span>
    </div>
  );
}
