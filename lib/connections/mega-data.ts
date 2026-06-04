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
    { color: "green", difficulty: "Medium", label: "Die schlauste der Welt" },
    {
      color: "blue",
      difficulty: "Hard",
      label: "Einfach die tollste der Welt",
    },
    { color: "purple", difficulty: "Tricky", label: "Baber" },
    {
      color: "orange",
      difficulty: "Challenging",
      label: "My butterfly<3",
    },
    { color: "red", difficulty: "Expert", label: "A goddess among humans" },
    { color: "pink", difficulty: "Master", label: "The birthday queen" },
    { color: "teal", difficulty: "Genius", label: "Axel loves _____" },
  ],
};
