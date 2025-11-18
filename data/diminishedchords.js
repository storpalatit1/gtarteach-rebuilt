// src/data/basicSeventhChords.js
export default [

  {
    id: 1,
    name: 'Bm7b5',
    positions: [
      { string: 5, fret: 2 }, // B
      { string: 4, fret: 3 }, // F
      { string: 3, fret: 2 }, // A
      { string: 2, fret: 3 }, // D
    ],
  },
  {
    id: 2,
    name: 'Em7b5',
    positions: [
      { string: 4, fret: 2 }, // E
      { string: 3, fret: 3 }, // Bb
      { string: 2, fret: 3 }, // D
    ],
  },
  {
    id: 3,
    name: 'Am7b5',
    positions: [
      { string: 5, fret: 0 }, // A
      { string: 4, fret: 1 }, // Eb
      { string: 3, fret: 0 }, // G
      { string: 2, fret: 1 }, // C
    ],
  },

  // -----------------------------
  // FULLY DIMINISHED 7 (dim7)
  // -----------------------------
  {
    id: 4,
    name: 'Bdim7',
    positions: [
      { string: 5, fret: 2 }, // B
      { string: 4, fret: 3 }, // D
      { string: 3, fret: 1 }, // F
      { string: 2, fret: 0 }, // Ab/G#
    ],
  },
  {
    id: 5,
    name: 'Edim7',
    positions: [
      { string: 4, fret: 2 }, // E
      { string: 3, fret: 3 }, // G
      { string: 2, fret: 2 }, // Bb
      { string: 1, fret: 3 }, // Db/C#
    ],
  },
  {
    id: 6,
    name: 'Adim7',
    positions: [
      { string: 5, fret: 0 }, // A
      { string: 4, fret: 1 }, // C
      { string: 3, fret: 0 }, // Eb
      { string: 2, fret: 1 }, // Gb/F#
    ],
  },
]
