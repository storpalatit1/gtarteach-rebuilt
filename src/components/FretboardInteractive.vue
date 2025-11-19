<script setup lang="ts">
import * as Tone from 'tone'
import { ref, watch } from 'vue'

// --------------------------------------------------------------------
// Props & Types
// --------------------------------------------------------------------
interface Position {
  string: number
  fret: number
  note?: string
}

interface FretboardProps {
  positions?: Position[]
  frets?: number
  multiple?: boolean
  modelValue?: Position[]
}

const props = withDefaults(defineProps<FretboardProps>(), {
  frets: 12,
  multiple: false,
  modelValue: () => [],
})

const emit = defineEmits(['update:modelValue'])

const strings = 6
const stringNames = ['E', 'B', 'G', 'D', 'A', 'E']

// --------------------------------------------------------------------
// Tone.js Sampler
// --------------------------------------------------------------------
const sampler = new Tone.Sampler({
  urls: {
    'A2': 'A2.mp3',
    'C3': 'C3.mp3',
    'D#3': 'Ds3.mp3',
    'F#3': 'Fs3.mp3',
  },
  baseUrl: 'https://tonejs.github.io/audio/salamander/',
  release: 1,
}).toDestination()

const isLoaded = ref(false)
Tone.loaded().then(() => (isLoaded.value = true))

// --------------------------------------------------------------------
// Note helpers
// --------------------------------------------------------------------
const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const stringOpenNotes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']

function getNoteName(stringIndex: number, fretIndex: number): string {
  const openNote = stringOpenNotes[strings - stringIndex]
  const match = openNote.match(/([A-G]#?)(\d)/)
  if (!match)
    return 'N/A'

  const [, base, octaveStr] = match
  let octave = Number(octaveStr)
  let semitone = noteNames.indexOf(base) + fretIndex

  while (semitone >= 12) {
    semitone -= 12
    octave++
  }

  return `${noteNames[semitone]}${octave}`
}

// --------------------------------------------------------------------
// State
// --------------------------------------------------------------------
const selectedNotes = ref<Position[]>([...props.modelValue])

watch(
  () => props.modelValue,
  v => (selectedNotes.value = [...v]),
)

// --------------------------------------------------------------------
// Click handler
// --------------------------------------------------------------------
async function onNoteClick(stringIndex: number, fretIndex: number) {
  if (!isLoaded.value)
    return

  await Tone.start()
  const note = getNoteName(stringIndex, fretIndex)
  sampler.triggerAttackRelease(note, '8n')

  const pos = { string: stringIndex, fret: fretIndex, note }
  const idx = selectedNotes.value.findIndex(
    n => n.string === pos.string && n.fret === pos.fret,
  )

  if (idx >= 0)
    selectedNotes.value.splice(idx, 1)
  else props.multiple ? selectedNotes.value.push(pos) : (selectedNotes.value = [pos])

  emit('update:modelValue', [...selectedNotes.value])
}

// --------------------------------------------------------------------
// Style: Note color
// --------------------------------------------------------------------
function getNoteColor(stringIndex: number, fretIndex: number) {
  const scale = props.positions?.some(
    n => n.string === stringIndex && n.fret === fretIndex,
  )
  const selected = selectedNotes.value.some(
    n => n.string === stringIndex && n.fret === fretIndex,
  )

  if (selected)
    return 'fill-blue-500 dark:fill-blue-400'
  if (scale)
    return 'fill-green-400 dark:fill-green-300'
  return 'fill-gray-400 dark:fill-gray-200'
}
</script>

<template>
  <div class="w-screen flex items-center justify-center overflow-hidden">
    <div class="inline-block overflow-x-auto">
      <svg
        :viewBox="`-40 0 ${(frets + 1) * 60 + 40} ${strings * 40}`"
        :width="(frets + 1) * 60"
        :height="strings * 40 + 40"
        class="mx-auto block"
      >
        <!-- STRING NAMES (inside SVG) -->
        <text
          v-for="(name, i) in stringNames"
          :key="`label-${i}`"
          x="-20"
          :y="(i * 40) + 40"
          text-anchor="end"
          class="fill-gray-800 text-xs dark:fill-gray-200"
        >
          {{ name }}
        </text>

        <!-- Fret numbers -->
        <text
          v-for="i in frets + 1"
          :key="`fret-${i}`"
          :x="(i - 1) * 60 + 30"
          y="15"
          text-anchor="middle"
          class="fill-gray-800 text-xs dark:fill-gray-200"
        >
          {{ i - 1 }}
        </text>

        <!-- Strings -->
        <line
          v-for="i in strings"
          :key="`string-${i}`"
          x1="0"
          :x2="(frets + 1) * 60"
          :y1="(i - 1) * 40 + 40"
          :y2="(i - 1) * 40 + 40"
          stroke="currentColor"
          :stroke-width="i === 1 || i === strings ? 3 : 2"
        />

        <!-- Frets -->
        <line
          v-for="i in frets + 1"
          :key="`fret-line-${i}`"
          :x1="(i - 1) * 60"
          :x2="(i - 1) * 60"
          y1="40"
          :y2="strings * 40 + 40"
          stroke="currentColor"
          :stroke-width="i === 1 ? 4 : 2"
        />

        <!-- Notes -->
        <g v-for="i in strings" :key="`g-${i}`">
          <circle
            v-for="f in frets"
            :key="`note-${i}-${f}`"
            :cx="f * 60 - 30"
            :cy="(i - 1) * 40 + 40"
            r="10"
            class="cursor-pointer transition-colors"
            :class="getNoteColor(i, f)"
            @click="onNoteClick(i, f)"
          />
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.fretboard {
  user-select: none;
}
</style>
