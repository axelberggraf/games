import CrosswordGame from '@/components/crossword/CrosswordGame';
import { PUZZLE } from '@/lib/crossword/data';

export const metadata = { title: 'Mini Crossword — Mini Games' };

export default function CrosswordPage() {
  return <CrosswordGame puzzle={PUZZLE} title="Mini Crossword" />;
}
