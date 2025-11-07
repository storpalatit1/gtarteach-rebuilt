<script setup>
import { onMounted, ref } from 'vue'
import InteractiveFretboard from '../../components/FretboardInteractive.vue'

// All notes in order
const noteNames = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G']

// Standard tuning (EADGBE)
const stringTunings = ['E', 'A', 'D', 'G', 'B', 'E']

const chosenNote = ref(null)
const selectedFrets = ref([])
const isCorrect = ref(null)

// Pick random note
function chooseRandomNote() {
  chosenNote.value = noteNames[Math.floor(Math.random() * noteNames.length)]
//   console.log('Chosen note:', chosenNote.value)
}

// Given a string index (0 = lowest E) and fret number, get note name
function getNoteName(stringIndex, fret) {
  const openNote = stringTunings[stringIndex]
  const openIndex = noteNames.indexOf(openNote)
  const noteIndex = (openIndex + fret) % 12
  return noteNames[noteIndex]
}

// Return all fret positions (string, fret) that match the chosen note
function getAllNotePositions(note) {
  const positions = []
  for (let string = 0; string < stringTunings.length; string++) {
    for (let fret = 0; fret <= 12; fret++) {
      if (getNoteName(string, fret) === note) {
        positions.push({ string, fret })
      }
    }
  }
  return positions
}
// helper: try to coerce incoming pos into canonical {string: 0..5, fret: 0..12}
function normalizePos(raw) {
  let s = Number(raw.string)
  let f = Number(raw.fret)

  // flip vertical orientation (fretboard uses 1=top, 6=bottom)
  if (s >= 1 && s <= 6)
    s = 6 - s // now 0=low E, 5=high E

  // normalize frets (UI 1..12 => 0..11)
  if (f >= 1)
    f = f - 1

  return { string: s, fret: f }
}

function toKey(pos) {
  return `${pos.string}-${pos.fret}` // canonical string
}

function checkAnswer() {
  if (!chosenNote.value)
    return

  const correctPositions = getAllNotePositions(chosenNote.value)
  const normalizedSelected = (selectedFrets.value || []).map(normalizePos)

  //   console.group(`🔎 Checking ${chosenNote.value}`);

  //   console.log("🎯 Correct positions (0-based):");
  //   correctPositions.forEach(p => {
  //     console.log(
  //       `   string ${p.string}, fret ${p.fret} → note ${getNoteName(p.string, p.fret)}`
  //     );
  //   });

  //   console.log("🎸 User selected (raw + normalized):");
  //   selectedFrets.value.forEach(p => {
  //     console.log(
  //       `   RAW string:${p.string}, fret:${p.fret} → ${getNoteName(p.string, p.fret)}`
  //     );
  //   });

  //   normalizedSelected.forEach(p => {
  //     console.log(
  //       `   NORMALIZED string:${p.string}, fret:${p.fret} → ${getNoteName(p.string, p.fret)}`
  //     );
  //   });

  //   console.groupEnd();

  // compare sets normally
  const correctKeys = Array.from(new Set(correctPositions.map(toKey))).sort()
  const selectedKeys = Array.from(new Set(normalizedSelected.map(toKey))).sort()

  const allCorrect
    = selectedKeys.length === correctKeys.length
      && selectedKeys.every(k => correctKeys.includes(k))

  isCorrect.value = allCorrect

//   console.log("✅ Expected keys:", correctKeys);
//   console.log("🎯 Selected keys:", selectedKeys);
//   console.log("Result:", isCorrect.value);
}
onMounted(() => {
  chooseRandomNote()
})
</script>

<template>
  <main class="mx-auto h-screen max-w-4xl items-center justify-between text-center">
    <div class="p-4">
      <h1 v-if="chosenNote" class="mb-4 text-2xl font-bold">
        Find all {{ chosenNote }}'s on the fretboard
      </h1>

      <InteractiveFretboard
        v-model="selectedFrets"
        :frets="13"
        multiple
      />
    </div>

    <div class="mt-4 space-x-4">
      <button
        class="border border-blue-400 rounded-md bg-blue-400 px-4 py-2 dark:border-gray-400 dark:bg-transparent"
        @click="checkAnswer"
      >
        Confirm
      </button>

      <button
        class="border border-blue-400 rounded-md bg-blue-400 px-4 py-2 dark:border-gray-400 dark:bg-transparent"
        @click="selectedFrets = []"
      >
        Reset
      </button>
      <button
        class="border border-blue-400 rounded-md bg-blue-400 px-4 py-2 dark:border-gray-400 dark:bg-transparent"
        @click="selectedFrets = [], chooseRandomNote()"
      >
        Next
      </button>
    </div>

    <div v-if="isCorrect !== null" class="mt-6 text-xl font-semibold">
      <span v-if="isCorrect" class="text-green-500">✅ Correct!</span>
      <span v-else class="text-red-500">❌ Try again.</span>
    </div>
  </main>
</template>
