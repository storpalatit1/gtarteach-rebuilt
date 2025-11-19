<script setup>
import { onMounted, ref } from 'vue'

/* ------------------------------------------------------------------
   Canonical chromatic for semitone math
------------------------------------------------------------------ */
const canonicalChromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

/* Enharmonics */
const flatToSharp = {
  Bb: 'A#',
  Db: 'C#',
  Eb: 'D#',
  Gb: 'F#',
  Ab: 'G#',
  Cb: 'B',
  Fb: 'E',
}

/* Keys that prefer flats */
const flatKeys = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb']

/* Scale intervals mapped cleanly */
const intervals = {
  major: [2, 2, 1, 2, 2, 2, 1],
  ionian: [2, 2, 1, 2, 2, 2, 1],
  minor: [2, 1, 2, 2, 1, 2, 2],
  aeolian: [2, 1, 2, 2, 1, 2, 2],
  dorian: [2, 1, 2, 2, 2, 1, 2],
  phrygian: [1, 2, 2, 2, 1, 2, 2],
  lydian: [2, 2, 2, 1, 2, 2, 1],
  mixolydian: [2, 2, 1, 2, 2, 1, 2],
  locrian: [1, 2, 2, 1, 2, 2, 2],
}

/* Modes for random quiz */
const modes = [
  'major',
  'minor',
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
  'locrian',
]

/* Normalize synonyms */
function normalizeMode(mode) {
  mode = mode.toLowerCase()
  if (mode.includes('ionian') || mode === 'major')
    return 'major'
  if (mode.includes('aeolian') || mode === 'minor')
    return 'minor'
  return mode
}

/* Guitar open strings */
const openStrings = ['E', 'B', 'G', 'D', 'A', 'E']

/* Reactive state */
const selectedRoot = ref('C')
const selectedMode = ref('major')
const selectedString = ref(null)
const scalePositions = ref([])
const currentScaleNotes = ref([])
const userNotes = ref('')
const feedback = ref('')
const score = ref({ correct: 0, total: 0 })
/* ------------------ Display Chromatic ------------------ */
function getDisplayChromaticForKey(root) {
  return flatKeys.includes(root)
    ? ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
    : [...canonicalChromatic]
}

/* ------------------ Build Scale Notes ------------------ */
function getScaleNotes(root, mode) {
  const m = normalizeMode(mode)
  const steps = intervals[m]
  const chroma = getDisplayChromaticForKey(root)

  let idx = chroma.indexOf(root)
  if (idx === -1 && flatToSharp[root]) {
    idx = chroma.indexOf(flatToSharp[root])
  }
  if (idx === -1)
    return []

  const scale = [chroma[idx]]
  for (const s of steps) {
    idx = (idx + s) % 12
    scale.push(chroma[idx])
  }
  return scale.slice(0, 7)
}

/* ------------------ Fretboard Mapping ------------------ */
function getScalePositions(scaleNotesDisplay) {
  const positions = []

  const scaleIndices = scaleNotesDisplay.map((n) => {
    const normalized = flatToSharp[n] || n
    return canonicalChromatic.indexOf(normalized)
  })

  const openIdx = openStrings.map((s) => {
    const normalized = flatToSharp[s] || s
    return canonicalChromatic.indexOf(normalized)
  })

  for (let string = 0; string < 6; string++) {
    if (selectedString.value && selectedString.value !== string + 1)
      continue

    for (let fret = 0; fret <= 12; fret++) {
      const idx = (openIdx[string] + fret) % 12
      if (scaleIndices.includes(idx)) {
        const displayChroma = getDisplayChromaticForKey(selectedRoot.value)
        positions.push({
          string: string + 1,
          fret,
          note: displayChroma[idx],
          isRoot: displayChroma[idx] === selectedRoot.value,
        })
      }
    }
  }

  return positions
}

/* ------------------ Actions ------------------ */
function chooseScale(root) {
  selectedRoot.value = root
  currentScaleNotes.value = getScaleNotes(root, selectedMode.value)
  scalePositions.value = getScalePositions(currentScaleNotes.value)
}

// function chooseMode(mode) {
//   selectedMode.value = mode
//   chooseScale(selectedRoot.value)
// }

// function chooseString(num) {
//   selectedString.value = num
//   if (currentScaleNotes.value.length) {
//     scalePositions.value = getScalePositions(currentScaleNotes.value)
//   }
// }

/* ------------------ Quiz Generator ------------------ */
function generateQuestion() {
  const mode = modes[Math.floor(Math.random() * modes.length)]
  const root = canonicalChromatic[Math.floor(Math.random() * canonicalChromatic.length)]

  selectedRoot.value = root
  selectedMode.value = mode
  currentScaleNotes.value = getScaleNotes(root, mode)

  userNotes.value = ''
  feedback.value = ''
}

/* ------------------ Answer Check ------------------ */
function handleAnswer() {
  const raw = userNotes.value.trim().toLowerCase()
  const [root, modeRaw] = raw.split(/\s+/)
  const mode = normalizeMode(modeRaw || '')

  const correctRoot = selectedRoot.value.toLowerCase()
  const correctMode = normalizeMode(selectedMode.value)

  const isCorrect = root === correctRoot && mode === correctMode

  feedback.value = isCorrect
    ? '✅ Correct!'
    : `❌ Wrong! The correct answer was: ${selectedRoot.value} ${selectedMode.value}`

  if (isCorrect) {
    score.value.correct++
  }
  score.value.total++
}

/* Init */
onMounted(() => {
  chooseScale('G')
  generateQuestion()
})
</script>

<template>
  <main class="h-screen flex flex-col items-center justify-center text-center">
    <div class="max-w-lg w-full p-4">
      <h2 class="mb-1 text-xl">
        What scale is this?
      </h2>

      {{ currentScaleNotes.join(' - ') }}

      <div class="mx-auto mt-5 w-2/5 border-2 border-blue-400 rounded-lg p-2 dark:border-gray-200">
        <input v-model="userNotes" placeholder="Format: C major" class="h-full w-full">
      </div>

      <button :disabled="feedback !== ''" class="mr-2 mt-4 rounded bg-blue-500 px-4 py-2 text-white dark:bg-gray-300 hover:bg-blue-600 dark:text-black dark:hover:bg-gray-400" @click="handleAnswer">
        Submit
      </button>

      <button class="rounded-lg bg-blue-400 px-4 py-2 text-white dark:bg-gray-600 hover:bg-blue-600 disabled:opacity-100 dark:hover:bg-gray-300" @click="generateQuestion">
        Next
      </button>

      <p class="mt-4 font-semibold" :class="feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'">
        {{ feedback }}
      </p>
      <div py-1 />
      <div class="text-sm text-gray-600 dark:text-gray-300">
        Score: <strong>{{ score.correct }}</strong> / {{ score.total }}
      </div>
    </div>
  </main>
</template>
