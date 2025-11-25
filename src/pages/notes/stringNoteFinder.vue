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
const score = ref({ correct: 0, total: 0 })
const goTo = ref(false)
// Pick random note
function chooseRandomNote() {
  isCorrect.value = null
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

  const correctKeys = Array.from(new Set(correctPositions.map(toKey))).sort()
  const selectedKeys = Array.from(new Set(normalizedSelected.map(toKey))).sort()

  const allCorrect
    = selectedKeys.length === correctKeys.length
      && selectedKeys.every(k => correctKeys.includes(k))

  isCorrect.value = allCorrect

  if (isCorrect.value === true) {
    score.value.correct++
  }
  score.value.total++
}

function goToNext() {
  selectedFrets.value = []
  chooseRandomNote()
  goTo.value = false
  generateQuestion()
}

// Go to next question
function handleNext() {
  goTo.value = true
}

onMounted(() => {
  chooseRandomNote()
})
</script>

<template>
  <main v-if="goTo === false" class="min-h-screen w-screen flex flex-col items-center p-4">
    <h1 v-if="chosenNote" class="mb-4 text-center text-2xl font-bold">
      Find all {{ chosenNote }}'s on the fretboard
    </h1>

    <!-- Fretboard + control buttons group -->
    <div class="flex flex-col items-center gap-4">
      <InteractiveFretboard
        v-model="selectedFrets"
        :frets="13"
        multiple
      />

      <!-- BUTTONS stay close because they are inside this flex group -->
      <div class="space-x-4">
        <button
          class="rounded-md bg-blue-200 px-4 py-2 dark:border dark:border-gray-400 dark:bg-transparent"
          :disabled="isCorrect !== null"
          @click="checkAnswer"
        >
          Confirm
        </button>

        <button
          class="border border-blue-400 rounded-md bg-blue-400 px-4 py-2 dark:border-white dark:bg-white dark:text-black"
          :disabled="isCorrect !== null"
          @click="selectedFrets = []"
        >
          Reset
        </button>

        <button
          :class="{
            'rounded-lg bg-blue-800 px-4 py-2 text-white dark:bg-gray-800 dark:text-gray disabled:opacity-100': isCorrect === null,
            'rounded-lg bg-blue-400 px-4 py-2 text-white dark:bg-gray-600 hover:bg-blue-600 disabled:opacity-100 dark:hover:bg-gray-300': isCorrect !== null,
          }"
          :disabled="isCorrect === null"
          @click="handleNext"
        >
          Next
        </button>
      </div>
    </div>

    <div class="mt-2 text-sm text-size-2xl text-gray-600 dark:text-gray-300">
      Score: {{ score.correct }} correct out of {{ score.total }}
    </div>
    <div v-if="isCorrect !== null" class="mt-2 text-xl font-semibold">
      <span v-if="isCorrect" class="text-green-500">✅ Correct!</span>
      <span v-else class="text-red-500">❌ Try again.</span>
    </div>
  </main>
  <main v-else class="h-screen flex flex-col items-center justify-center text-center">
    <div py-2 />
    <Progression difficulty="Beginner" :is-correct="isCorrect" />
    <div class="mt-4">
      <button
        class="rounded-lg bg-blue-400 px-4 py-2 text-white dark:bg-gray-600 hover:bg-blue-600 disabled:opacity-100 dark:hover:bg-gray-300"
        @click="goToNext"
      >
        Next
      </button>
    </div>

    <div class="mt-2 text-sm text-size-2xl text-gray-600 dark:text-gray-300">
      Score: {{ score.correct }} correct out of {{ score.total }}
    </div>
  </main>
</template>
