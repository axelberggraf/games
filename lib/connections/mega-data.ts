import type { ConnectionColor } from "./types";

export interface MegaCategory {
  color: ConnectionColor;
  difficulty: string;
  label: string;
}

export interface MegaConnectionsPuzzle {
  word: string;
  categories: MegaCategory[];
}

export const MEGA_PUZZLE: MegaConnectionsPuzzle = {
  word: "VANESSA",
  categories: [
    { color: "yellow", difficulty: "Easy", label: "Die schönste der Welt" },
    { color: "green", difficulty: "Medium", label: "Die tollste der Welt" },
    { color: "blue", difficulty: "Hard", label: "Impressive instincts" },
    { color: "purple", difficulty: "Tricky", label: "Very sneaky" },
    { color: "orange", difficulty: "Challenging", label: "Halfway there" },
    { color: "red", difficulty: "Expert", label: "Truly remarkable" },
    { color: "pink", difficulty: "Master", label: "Almost legendary" },
    { color: "teal", difficulty: "Genius", label: "Absolute perfection" },
  ],
};
