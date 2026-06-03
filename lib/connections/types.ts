export type ConnectionColor = 'yellow' | 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'pink' | 'teal';

export const COLOR_ORDER: ConnectionColor[] = ['yellow', 'green', 'blue', 'purple', 'orange', 'red', 'pink', 'teal'];

export interface ConnectionCategory {
  color: ConnectionColor;
  label: string;
  words: [string, string, string, string];
}

export interface ConnectionsPuzzle {
  categories: ConnectionCategory[];
}

export type TileStatus = 'idle' | 'selected' | 'solved';

export interface ConnectionTileState {
  word: string;
  status: TileStatus;
  solvedColor?: ConnectionColor;
}
