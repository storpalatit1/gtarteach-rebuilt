<script setup>
import { onMounted, ref } from 'vue'

const canonicalChromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

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

const modes = [
  'major',
  'minor',
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
  'locrian',
]

function normalizeMode(mode) {
  mode = mode.toLowerCase()
  if (mode.includes('ionian') || mode === 'major')
    return 'major'
  if (mode.includes('aeolian') || mode === 'minor')
    return 'minor'
  return mode
}

const openStrings = ['E', 'B', 'G', 'D', 'A', 'E']

const selectedRoot = ref('C')
const selectedMode = ref('major')
const selectedString = ref(null)
const scalePositions = ref([])
const currentScaleNotes = ref([])
const userNotes = ref('')
const feedback = ref('')
const score = ref({ correct: 0, total: 0 })
const goTo = ref(false)
const isCorrect = ref(null)

function getDisplayChromaticForKey(root) {
  return flatKeys.includes(root)
    ? ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
    : [...canonicalChromatic]
}

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

function chooseScale(root) {
  selectedRoot.value = root
  currentScaleNotes.value = getScaleNotes(root, selectedMode.value)
  scalePositions.value = getScalePositions(currentScaleNotes.value)
}

function generateQuestion() {
  isCorrect.value = null
  const mode = modes[Math.floor(Math.random() * modes.length)]
  const root = canonicalChromatic[Math.floor(Math.random() * canonicalChromatic.length)]

  selectedRoot.value = root
  selectedMode.value = mode
  currentScaleNotes.value = getScaleNotes(root, mode)

  userNotes.value = ''
  feedback.value = ''
}

function handleAnswer() {
  const raw = userNotes.value.trim().toLowerCase()
  const [root, modeRaw] = raw.split(/\s+/)
  const mode = normalizeMode(modeRaw || '')

  const correctRoot = selectedRoot.value.toLowerCase()
  const correctMode = normalizeMode(selectedMode.value)

  isCorrect.value = root === correctRoot && mode === correctMode

  feedback.value = isCorrect.value
    ? '✅ Correct!'
    : `❌ Wrong! The correct answer was: ${selectedRoot.value} ${selectedMode.value}`

  if (isCorrect.value) {
    score.value.correct++
  }
  score.value.total++
}
function goToNext() {
  goTo.value = false
  generateQuestion()
}

function handleNext() {
  goTo.value = true
}

onMounted(() => {
  chooseScale('G')
  generateQuestion()
})
</script>

<template>
  <main v-if="goTo === false" class="h-screen flex flex-col items-center justify-center text-center">
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

      <button class="rounded-lg bg-blue-400 px-4 py-2 text-white dark:bg-gray-600 hover:bg-blue-600 disabled:opacity-100 dark:hover:bg-gray-300" @click="handleNext">
        Next
      </button>

      <p class="mt-4 font-semibold" :class="feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'">
        {{ feedback }}
      </p>
      <div py-1 />
      <div class="mt-2 text-sm text-size-2xl text-gray-600 dark:text-gray-300">
        Score: {{ score.correct }} correct out of {{ score.total }}
      </div>
    </div>
  </main>
  <main v-else class="h-screen flex flex-col items-center justify-center text-center">
    <div py-2 />
    <Progression difficulty="Intermediate" :is-correct="isCorrect" />
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
