<script setup>
import { onMounted, ref } from 'vue'
import Fretboard from '~/components/Fretboard.vue'

const canonicalChromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const modes = ['major', 'minor', 'dorian', 'lydian', 'aeolian (minor)', 'phrygian', 'mixolydian', 'locrian', 'ionian (major)']

const flatToSharp = {
  Bb: 'A#',
  Db: 'C#',
  Eb: 'D#',
  Gb: 'F#',
  Ab: 'G#',
  Cb: 'B',
  Fb: 'E',
}

const flatKeys = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb']
const openStrings = ['E', 'B', 'G', 'D', 'A', 'E']
const majorScaleInterval = [2, 2, 1, 2, 2, 2, 1]
const minorScaleInterval = [2, 1, 2, 2, 1, 2, 2]
const dorianScaleInterval = [2, 1, 2, 2, 2, 1, 2]
const phrygianScaleInterval = [1, 2, 2, 2, 1, 2, 2]
const lydianScaleInterval = [2, 2, 2, 1, 2, 2, 1]
const mixolydianScaleInterval = [2, 2, 1, 2, 2, 1, 2]
const locrianScaleInterval = [1, 2, 2, 1, 2, 2, 2]
const selectedString = ref(null)

const uiRootChoices = canonicalChromatic

function getDisplayChromaticForKey(keyRoot) {
  const useFlats = flatKeys.includes(keyRoot)
  return useFlats
    ? ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
    : [...canonicalChromatic]
}

const selectedRoot = ref('A')
const chosenMode = ref('minor')
const chosenScale = ref('A Minor')
const scalePositions = ref([])
const currentScaleNotes = ref([])
const hiddenNote = ref('C')
const selectedAnswer = ref(null)
const answered = ref(false) // ✅ new: track if user has answered

function getScaleNotes(rootNote, mode = 'major') {
  let intervals
  switch (mode) {
    case 'major':
    case 'ionian (major)':
      intervals = majorScaleInterval
      break
    case 'minor':
    case 'aeolian (minor)':
      intervals = minorScaleInterval
      break
    case 'dorian':
      intervals = dorianScaleInterval
      break
    case 'phrygian':
      intervals = phrygianScaleInterval
      break
    case 'lydian':
      intervals = lydianScaleInterval
      break
    case 'mixolydian':
      intervals = mixolydianScaleInterval
      break
    case 'locrian':
      intervals = locrianScaleInterval
      break
  }

  const displayChromatic = getDisplayChromaticForKey(rootNote)
  let rootIndex = displayChromatic.indexOf(rootNote)
  if (rootIndex === -1 && flatToSharp[rootNote]) {
    const sharp = flatToSharp[rootNote]
    rootIndex = displayChromatic.indexOf(sharp)
  }
  if (rootIndex === -1)
    return []

  const scale = [displayChromatic[rootIndex]]
  let cur = rootIndex
  for (const step of intervals) {
    cur = (cur + step) % 12
    scale.push(displayChromatic[cur])
  }
  return scale.slice(0, 7)
}

function getScalePositions(scaleNotesDisplay) {
  const positions = []
  const scaleIndices = scaleNotesDisplay.map(n => canonicalChromatic.indexOf(flatToSharp[n] || n))
  const openStringIndices = openStrings.map(s => canonicalChromatic.indexOf(flatToSharp[s] || s))

  for (let stringIdx = 0; stringIdx < 6; stringIdx++) {
    if (selectedString.value && selectedString.value !== stringIdx + 1)
      continue
    const openIdx = openStringIndices[stringIdx]
    for (let fret = 0; fret <= 12; fret++) {
      const noteIdx = (openIdx + fret) % 12
      if (scaleIndices.includes(noteIdx)) {
        const displayChromatic = getDisplayChromaticForKey(selectedRoot.value)
        const displayName = displayChromatic[noteIdx]
        positions.push({
          string: stringIdx + 1,
          fret,
          note: displayName,
          isRoot: displayName === selectedRoot.value,
        })
      }
    }
  }
  return positions
}

function generateQuestion() {
  const randomNote = canonicalChromatic[Math.floor(Math.random() * canonicalChromatic.length)]
  const randomMode = modes[Math.floor(Math.random() * modes.length)]

  selectedRoot.value = randomNote
  chosenMode.value = randomMode
  chosenScale.value = `${selectedRoot.value} ${chosenMode.value}`

  const notes = getScaleNotes(selectedRoot.value, chosenMode.value)
  currentScaleNotes.value = [...notes]

  const randomIndex = Math.floor(Math.random() * notes.length)
  hiddenNote.value = notes[randomIndex]

  const visibleNotes = notes.filter(n => n !== hiddenNote.value)
  scalePositions.value = getScalePositions(visibleNotes)

  selectedAnswer.value = null
  answered.value = false

  // console.log('Chosen scale:', chosenScale.value)
  // console.log('Full notes:', notes)
  // console.log('Hidden note:', hiddenNote.value)
}

onMounted(() => {
  generateQuestion()
})

function handleAnswer(note) {
  if (answered.value)
    return // prevent multiple guesses
  selectedAnswer.value = note
  answered.value = true
}

const notes = uiRootChoices
</script>

<template>
  <div py-1 />
  <main class="mx-auto h-screen max-w-4xl items-center justify-between text-center">
    <div class="p-4">
      <h2 class="mb-2 text-xl font-semibold">
        {{ chosenScale }}
      </h2>
      <p class="mb-4 text-gray-600">
        One note from this scale is missing. Can you guess which one?
      </p>

      <Fretboard :positions="scalePositions" :show-notes="true" />

      <!-- <div class="mt-4 text-sm text-gray-500">
      <p>Hidden Note: {{ hiddenNote }}</p>
    </div> -->

      <div class="w-full flex items-center justify-center py-5 pr-0">
        <div class="grid grid-cols-12 h-20 w-2/3 place-items-center gap-0.5 border-2 border-blue-400 rounded-lg p-1 dark:border-gray-100">
          <button
            v-for="note in notes"
            :key="note"
            class="rounded px-2 py-1 transition-all duration-200"
            :class="{

              'bg-green-500 text-white': answered && note === hiddenNote,

              'bg-red-500 text-white': answered && note === selectedAnswer && note !== hiddenNote,

              'hover:bg-blue-300 dark:hover:bg-gray-300': !answered,
            }"
            @click="handleAnswer(note)"
          >
            {{ note }}
          </button>
        </div>
      </div>

      <div class="mt-6 flex justify-center">
        <button
          class="rounded bg-blue-500 px-4 py-2 text-white dark:bg-gray-300 hover:bg-blue-600 dark:text-black dark:hover:bg-gray-400"
          @click="generateQuestion"
        >
          Next Question
        </button>
      </div>
    </div>
  </main>
</template>
