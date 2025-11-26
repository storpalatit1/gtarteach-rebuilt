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

const majorScaleInterval = [2, 2, 1, 2, 2, 2, 1]
const minorScaleInterval = [2, 1, 2, 2, 1, 2, 2]
const dorianScaleInterval = [2, 1, 2, 2, 2, 1, 2]
const phrygianScaleInterval = [1, 2, 2, 2, 1, 2, 2]
const lydianScaleInterval = [2, 2, 2, 1, 2, 2, 1]
const mixolydianScaleInterval = [2, 2, 1, 2, 2, 1, 2]
const locrianScaleInterval = [1, 2, 2, 1, 2, 2, 2]

const openStrings = ['E', 'B', 'G', 'D', 'A', 'E']

const selectedRoot = ref('C')
const selectedMode = ref('major')
const selectedString = ref(null)
const scalePositions = ref([])
const currentScaleNotes = ref([])

const uiRootChoices = canonicalChromatic

function getDisplayChromaticForKey(keyRoot) {
  const useFlats = flatKeys.includes(keyRoot)
  if (useFlats) {
    return ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
  }
  else {
    return [...canonicalChromatic]
  }
}

function getScaleNotes(rootNote, mode = 'major') {
  let intervals

  switch (mode) {
    case 'major':
      intervals = majorScaleInterval
      break
    case 'ionian (major)':
      intervals = majorScaleInterval
      break
    case 'minor' :
      intervals = minorScaleInterval
      break
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
  const scaleIndices = scaleNotesDisplay.map((n) => {
    const normalized = flatToSharp[n] || n
    return canonicalChromatic.indexOf(normalized)
  })

  const openStringIndices = openStrings.map((s) => {
    const normalized = flatToSharp[s] || s
    return canonicalChromatic.indexOf(normalized)
  })

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

function chooseScale(root) {
  selectedRoot.value = root
  const notes = getScaleNotes(root, selectedMode.value)
  currentScaleNotes.value = notes
  scalePositions.value = getScalePositions(notes)
}

function chooseString(stringNum) {
  selectedString.value = stringNum

  if (currentScaleNotes.value.length > 0) {
    scalePositions.value = getScalePositions(currentScaleNotes.value)
  }
}
function chooseMode(mode) {
  selectedMode.value = mode
  chooseScale(selectedRoot.value)
}

onMounted(() => {
  chooseScale('G')
})

const positions = scalePositions
const roots = uiRootChoices
</script>

<template>
  <div class="px-4 py-5">
    <div class="mb-6 w-full flex justify-center">
      <Fretboard
        :positions="positions"
        :start-fret="0"
        :end-fret="12"
        :show-notes="true"
      />
    </div>

    <div class="mb-6 flex flex-wrap justify-center gap-2">
      <button
        v-for="n in 6"
        :key="n"
        class="border rounded px-3 py-1 text-sm hover:bg-blue-300 dark:hover:bg-gray-300"
        :class="selectedString === n ? 'bg-blue-400 text-white dark:bg-white dark:text-black' : ''"
        @click="chooseString(n)"
      >
        String {{ n }}
      </button>

      <button
        class="border rounded px-3 py-1 text-sm hover:bg-gray-300"
        @click="() => { selectedString = null; chooseString(null) }"
      >
        All Strings
      </button>
    </div>

    <div class="mb-6 w-full flex justify-center">
      <div class="grid grid-cols-6 max-w-xl w-full place-items-center gap-1 border-2 border-blue-400 rounded-lg p-2 sm:grid-cols-12 dark:border-gray-100">
        <button
          v-for="root in roots"
          :key="root"
          class="rounded px-2 py-1 text-sm hover:bg-blue-300 dark:hover:bg-gray-300"
          :class="selectedRoot === root ? 'bg-blue-400 text-white dark:bg-white dark:text-black' : ''"
          @click="chooseScale(root)"
        >
          {{ root }}
        </button>
      </div>
    </div>

    <div class="w-full flex justify-center">
      <div class="grid grid-cols-2 max-w-3xl w-full place-items-center gap-1 border-2 border-blue-400 rounded-lg p-2 lg:grid-cols-9 md:grid-cols-5 sm:grid-cols-3 dark:border-gray-100">
        <button
          v-for="mode in modes"
          :key="mode"
          class="rounded px-2 py-1 text-center text-sm hover:bg-blue-300 dark:hover:bg-gray-300"
          :class="selectedMode === mode ? 'bg-blue-400 text-white dark:bg-white dark:text-black' : ''"
          @click="chooseMode(mode)"
        >
          {{ mode }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
