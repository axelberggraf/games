import type { ConnectionColor, ConnectionsPuzzle } from './types';

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function checkSelection(
  selected: string[],
  puzzle: ConnectionsPuzzle,
): ConnectionColor | null {
  if (selected.length !== 4) return null;
  for (const category of puzzle.categories) {
    const matches = selected.filter(w => category.words.includes(w));
    if (matches.length === 4) return category.color;
  }
  return null;
}

export function getOneAway(
  selected: string[],
  puzzle: ConnectionsPuzzle,
): boolean {
  if (selected.length !== 4) return false;
  for (const category of puzzle.categories) {
    const matches = selected.filter(w => category.words.includes(w));
    if (matches.length === 3) return true;
  }
  return false;
}
