<script setup>
import { onMounted, ref } from 'vue'
import Fretboard from '~/components/Fretboard.vue'

/* ------------------------------------------------------------------
   Canonical chromatic (C-based) for accurate semitone math
   Index: 0=C, 1=C#, 2=D, ... 11=B
   ------------------------------------------------------------------ */
const canonicalChromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const modes = ['major', 'minor']
/* Enharmonic helpers (for index lookup) */
// const flatToSharp = {
//   'Bb': 'A#',
//   'Db': 'C#',
//   'Eb': 'D#',
//   'Gb': 'F#',
//   'Ab': 'G#',
//   'Cb': 'B',
//   'Fb': 'E'
// }
// const sharpToFlat = {
//   'A#': 'Bb',
//   'C#': 'Db',
//   'D#': 'Eb',
//   'F#': 'Gb',
//   'G#': 'Ab'
// }

/* Keys that conventionally prefer flats for display */
const flatKeys = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb']

/* Intervals for major/minor (used as semitone steps) */
// const majorScaleInterval = [2,2,1,2,2,2,1]
// const minorScaleInterval = [2,1,2,2,1,2,2]

/* Standard open strings (names) — used only for lookup; actual index is from canonicalChromatic */
const openStrings = ['E', 'B', 'G', 'D', 'A', 'E'] // string 6 -> string 1

/* Reactive state */
const selectedRoot = ref('C')
const selectedMode = ref('major') // can be 'major' or 'minor' if you extend
const selectedString = ref(null) // null => all strings
const scalePositions = ref([])
const currentScaleNotes = ref([])

/* UI: display the 12 root choices (show sharp names; flats will be used internally when needed) */
const uiRootChoices = canonicalChromatic // ['C','C#','D',...,'B']

/* ------------------------------------------------------------------
   Build display-name chromatic for a key (either sharps or flats)
   Returns array of 12 names indexed same as canonicalChromatic:
   e.g. for sharps: ['C','C#','D',...]
         for flats : ['C','Db','D',...]
   ------------------------------------------------------------------ */
function getDisplayChromaticForKey(keyRoot) {
  const useFlats = flatKeys.includes(keyRoot)
  if (useFlats) {
    // flats mapping starting at C
    return ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
  }
  else {
    return [...canonicalChromatic] // sharps
  }
}

/* ------------------------------------------------------------------
   Generate scale note names (in display spelling) for the chosen root & mode
   Uses the display chromatic (so spellings are correct for key)
   ------------------------------------------------------------------ */
function getScaleNotes(rootNote, mode = 'major') {
  // Define intervals (in semitones)
  const majorScaleInterval = [2, 2, 1, 2, 2, 2, 1] // W-W-H-W-W-W-H
  const naturalMinorInterval = [2, 1, 2, 2, 1, 2, 2] // W-H-W-W-H-W-W

  // Choose interval pattern based on mode
  const intervals = mode === 'major' ? majorScaleInterval : naturalMinorInterval

  const displayChromatic = getDisplayChromaticForKey(rootNote)

  // Find root index in chromatic set (handles sharps/flats)
  let rootIndex = displayChromatic.indexOf(rootNote)
  if (rootIndex === -1 && flatToSharp[rootNote]) {
    const sharp = flatToSharp[rootNote]
    rootIndex = displayChromatic.indexOf(sharp)
  }
  if (rootIndex === -1)
    return []

  // Build the scale
  const scale = [displayChromatic[rootIndex]]
  let cur = rootIndex
  for (const step of intervals) {
    cur = (cur + step) % 12
    scale.push(displayChromatic[cur])
  }

  // Return 7 unique pitch classes (omit octave repeat)
  return scale.slice(0, 7)
}

/* ------------------------------------------------------------------
   Map scale notes to fretboard positions (accurate EADGBE tuning)
   - Uses canonicalChromatic for index arithmetic
   - Uses the display chromatic for membership & labels (so you see flats if key requests flats)
   ------------------------------------------------------------------ */
function getScalePositions(scaleNotesDisplay) {
  const positions = []

  // For membership checks convert scaleNotesDisplay to canonical indices
  // e.g. 'Db' -> 'C#' -> canonical index 1
  const scaleIndices = scaleNotesDisplay.map((n) => {
    // normalize flats to sharps for index lookup
    const normalized = flatToSharp[n] || n
    return canonicalChromatic.indexOf(normalized)
  })

  // Compute open-string canonical indices
  const openStringIndices = openStrings.map((s) => {
    // convert any flat notation to canonical sharps if necessary
    const normalized = flatToSharp[s] || s
    return canonicalChromatic.indexOf(normalized)
  })
  // openStringIndices should equal [4,9,2,7,11,4] for E A D G B E (C-based indexing)
  // Verify: canonicalChromatic = ['C','C#','D','D#','E' (4), 'F', 'F#', 'G' (7), 'G#', 'A' (9), 'A#', 'B'(11)]

  for (let stringIdx = 0; stringIdx < 6; stringIdx++) {
    if (selectedString.value && selectedString.value !== stringIdx + 1)
      continue

    const openIdx = openStringIndices[stringIdx]
    for (let fret = 0; fret <= 12; fret++) {
      const noteIdx = (openIdx + fret) % 12
      // membership test: if noteIdx is one of scaleIndices
      if (scaleIndices.includes(noteIdx)) {
        // For display, pick the name from the chosen key's display chromatic
        const displayChromatic = getDisplayChromaticForKey(selectedRoot.value)
        const displayName = displayChromatic[noteIdx]
        positions.push({
          string: stringIdx + 1,
          fret,
          note: displayName,
          isRoot: displayName === selectedRoot.value, // ✅ mark the root note
        })
      }
    }
  }

  return positions
}

/* ------------------------------------------------------------------
   Event handlers
   ------------------------------------------------------------------ */
function chooseScale(root) {
  selectedRoot.value = root
  const notes = getScaleNotes(root, selectedMode.value)
  currentScaleNotes.value = notes
  scalePositions.value = getScalePositions(notes)
}

function chooseString(stringNum) {
  selectedString.value = stringNum
  // refresh positions with current scale
  if (currentScaleNotes.value.length > 0) {
    scalePositions.value = getScalePositions(currentScaleNotes.value)
  }
}
function chooseMode(mode) {
  selectedMode.value = mode
  chooseScale(selectedRoot.value)
}
/* ------------------------------------------------------------------
   Initialize default
   ------------------------------------------------------------------ */
onMounted(() => {
  chooseScale('G') // or 'C' as you prefer; user said G major earlier
})

/* Expose for template */
const positions = scalePositions
const roots = uiRootChoices
</script>

<template>
  <div class="py-5 pl-20">
    <!-- Fretboard (your existing component) -->
    <Fretboard
      :positions="positions"
      :frets="13"
      :show-notes="true"
    />

    <!-- String selector -->
    <div class="flex justify-center gap-2 py-3 pr-40">
      <button
        v-for="n in 6"
        :key="n"
        class="border rounded px-3 py-1 hover:bg-blue-300 dark:hover:bg-gray-300"
        :class="selectedString === n ? 'bg-blue-400 text-white dark:bg-white dark:text-black' : ''"
        @click="chooseString(n)"
      >
        String {{ n }}
      </button>

      <button
        class="border rounded px-3 py-1 hover:bg-gray-300"
        @click="() => { selectedString = null; chooseString(null) }"
      >
        All Strings
      </button>
    </div>

    <!-- Root selector -->
    <div class="w-full flex items-center justify-center py-5 pr-40">
      <div class="grid grid-cols-12 h-20 w-2/3 place-items-center gap-0.5 border-2 border-blue-400 rounded-lg p-1 dark:border-gray-100">
        <button
          v-for="root in roots"
          :key="root"
          class="rounded px-2 py-1 hover:bg-blue-300 dark:hover:bg-gray-300"
          :class="selectedRoot === root ? 'bg-blue-400 text-white dark:bg-white dark:text-black' : ''"
          @click="chooseScale(root)"
        >
          {{ root }}
        </button>
      </div>
    </div>

    <div py-2 />
    <div class="w-full flex items-center justify-center pr-40">
      <div class="grid grid-cols-2 h-20 w-2/3 place-items-center gap-0.5 border-2 border-blue-400 rounded-lg p-1 dark:border-gray-100">
        <button
          v-for="mode in modes"
          :key="mode"
          class="rounded px-2 py-1 hover:bg-blue-300 dark:hover:bg-gray-300"
          :class="selectedMode === mode ? 'bg-blue-400 text-white dark:bg-white dark:text-black' : ''" @click="chooseMode(mode)"
        >
          {{ mode }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* optional small styling tweaks if you need */
</style>
