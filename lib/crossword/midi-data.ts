import type { CrosswordPuzzle } from "./types";

// 7×7 grid  (# = black square)
//      0    1    2    3    4    5    6
// 0  [ C ][ U ][ E ][ # ][ E ][ A ][ R ]
// 1  [ A ][ # ][ R ][ # ][ L ][ # ][ O ]
// 2  [ B ][ L ][ A ][ N ][ K ][ E ][ T ]
// 3  [ # ][ O ][ # ][ O ][ # ][ G ][ # ]
// 4  [ S ][ T ][ A ][ T ][ I ][ O ][ N ]
// 5  [ I ][ # ][ P ][ # ][ C ][ # ][ I ]
// 6  [ T ][ O ][ E ][ # ][ E ][ A ][ T ]
//
// Across: 1-CUE, 3-EAR, 5-BLANKET, 9-STATION, 13-TOE, 14-EAT
// Down:   1-CAB, 2-ERA, 3-ELK, 4-ROT, 6-LOT, 7-NOT, 8-EGO,
//         9-SIT, 10-APE, 11-ICE, 12-NIT

export const MIDI_PUZZLE: CrosswordPuzzle = {
  grid: [
    [false, false, false, true, false, false, false],
    [false, true, false, true, false, true, false],
    [false, false, false, false, false, false, false],
    [true, false, true, false, true, false, true],
    [false, false, false, false, false, false, false],
    [false, true, false, true, false, true, false],
    [false, false, false, true, false, false, false],
    [true, true, true, true, true, true, true, true],
    [false, false, false, false, false, false, false, false],
  ],
  clues: [
    {
      number: 1,
      direction: "across",
      clue: "Actor's prompt",
      answer: "CUE",
      row: 0,
      col: 0,
      length: 3,
    },
    {
      number: 3,
      direction: "across",
      clue: "Hearing organ",
      answer: "EAR",
      row: 0,
      col: 4,
      length: 3,
    },
    {
      number: 5,
      direction: "across",
      clue: "Warm bed covering",
      answer: "BLANKET",
      row: 2,
      col: 0,
      length: 7,
    },
    {
      number: 9,
      direction: "across",
      clue: "Train stop",
      answer: "STATION",
      row: 4,
      col: 0,
      length: 7,
    },
    {
      number: 13,
      direction: "across",
      clue: "Foot digit",
      answer: "TOE",
      row: 6,
      col: 0,
      length: 3,
    },
    {
      number: 14,
      direction: "across",
      clue: "Have a meal",
      answer: "EAT",
      row: 6,
      col: 4,
      length: 3,
    },
    {
      number: 1,
      direction: "down",
      clue: "Yellow city ride",
      answer: "CAB",
      row: 0,
      col: 0,
      length: 3,
    },
    {
      number: 2,
      direction: "down",
      clue: "Historical period",
      answer: "ERA",
      row: 0,
      col: 2,
      length: 3,
    },
    {
      number: 3,
      direction: "down",
      clue: "Large antlered deer",
      answer: "ELK",
      row: 0,
      col: 4,
      length: 3,
    },
    {
      number: 4,
      direction: "down",
      clue: "Decompose",
      answer: "ROT",
      row: 0,
      col: 6,
      length: 3,
    },
    {
      number: 6,
      direction: "down",
      clue: "Parking ___",
      answer: "LOT",
      row: 2,
      col: 1,
      length: 3,
    },
    {
      number: 7,
      direction: "down",
      clue: "Negative word",
      answer: "NOT",
      row: 2,
      col: 3,
      length: 3,
    },
    {
      number: 8,
      direction: "down",
      clue: "Self-esteem",
      answer: "EGO",
      row: 2,
      col: 5,
      length: 3,
    },
    {
      number: 9,
      direction: "down",
      clue: "Be seated",
      answer: "SIT",
      row: 4,
      col: 0,
      length: 3,
    },
    {
      number: 10,
      direction: "down",
      clue: "Gorilla, e.g.",
      answer: "APE",
      row: 4,
      col: 2,
      length: 3,
    },
    {
      number: 11,
      direction: "down",
      clue: "Frozen water",
      answer: "ICE",
      row: 4,
      col: 4,
      length: 3,
    },
    {
      number: 12,
      direction: "down",
      clue: "Louse egg",
      answer: "NIT",
      row: 4,
      col: 6,
      length: 3,
    },
  ],
};
