<script setup lang="ts">
import * as Tone from 'tone'
import { ref, watch } from 'vue'

// --------------------------------------------------------------------
// Props and types
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
// Tone.js Sampler setup
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

Tone.loaded().then(() => {
  isLoaded.value = true
})

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

  const [, openNoteName, octaveStr] = match
  let octave = Number.parseInt(octaveStr)
  let semitoneIndex = noteNames.indexOf(openNoteName) + fretIndex

  while (semitoneIndex >= 12) {
    semitoneIndex -= 12
    octave++
  }

  return `${noteNames[semitoneIndex]}${octave}`
}

// --------------------------------------------------------------------
// State
// --------------------------------------------------------------------
const selectedNotes = ref<Position[]>([...props.modelValue])

watch(
  () => props.modelValue,
  newVal => (selectedNotes.value = [...newVal]),
)

// --------------------------------------------------------------------
// Play note & toggle selection
// --------------------------------------------------------------------
async function onNoteClick(stringIndex: number, fretIndex: number) {
  if (!isLoaded.value)
    return console.warn('Sampler not loaded yet!')

  await Tone.start()
  const noteName = getNoteName(stringIndex, fretIndex)
  sampler.triggerAttackRelease(noteName, '8n')

  const pos = { string: stringIndex, fret: fretIndex, note: noteName }
  const existingIndex = selectedNotes.value.findIndex(
    n => n.string === pos.string && n.fret === pos.fret,
  )

  if (existingIndex >= 0) {
    selectedNotes.value.splice(existingIndex, 1)
  }
  else {
    if (!props.multiple)
      selectedNotes.value = [pos]
    else selectedNotes.value.push(pos)
  }

  emit('update:modelValue', [...selectedNotes.value])
}

// --------------------------------------------------------------------
// Coloring logic
// --------------------------------------------------------------------
function getNoteColor(stringIndex: number, fretIndex: number) {
  const isScaleNote
    = props.positions?.some(n => n.string === stringIndex && n.fret === fretIndex) ?? false

  const isSelected
    = selectedNotes.value.some(n => n.string === stringIndex && n.fret === fretIndex)

  if (isSelected)
    return '#60A5FA' // blue = user-selected
  if (isScaleNote)
    return '#34D399' // green = scale note
  return '#9ca3af' // gray = others
}
</script>

<template>
  <div class="fretboard">
    <div class="py-1" />
    <div class="w-full overflow-x-auto">
      <div class="inline-block min-w-full">
        <div class="relative" style="padding-top: 40px">
          <!-- String names -->
          <div
            class="absolute left-0 top-0 flex flex-col"
            :style="{
              gap: `calc((100% - 40px) / 5)`,
              height: 'calc(100% - 40px)',
              transform: 'translateY(40px)',
            }"
          >
            <div
              v-for="(name, i) in stringNames"
              :key="i"
              class="text-muted-foreground w-8 pr-2 text-right text-xs font-medium -mt-2"
            >
              {{ name }}
            </div>
          </div>

          <!-- SVG fretboard -->
          <div class="ml-10">
            <svg
              :viewBox="`0 0 ${(frets + 1) * 60} ${strings * 40}`"
              class="w-full"
              :style="{ maxWidth: `${(frets + 1) * 60}px` }"
            >
              <!-- Fret numbers -->
              <text
                v-for="fretIndex in frets + 1"
                :key="`fret-${fretIndex}`"
                :x="(fretIndex - 1) * 60 + 30"
                y="15"
                text-anchor="middle"
                class="text-xs"
                style="font-size: 12px; fill: #1f2937"
              >
                {{ fretIndex - 1 }}
              </text>

              <!-- Strings -->
              <line
                v-for="stringIndex in strings"
                :key="`string-${stringIndex}`"
                x1="0"
                :y1="(stringIndex - 1) * 40 + 40"
                :x2="(frets + 1) * 60"
                :y2="(stringIndex - 1) * 40 + 40"
                stroke="currentColor"
                :stroke-width="stringIndex === 6 || stringIndex === strings ? 3 : 2"
              />

              <!-- Frets -->
              <line
                v-for="fretIndex in frets + 1"
                :key="`fret-line-${fretIndex}`"
                :x1="(fretIndex - 1) * 60"
                y1="40"
                :x2="(fretIndex - 1) * 60"
                :y2="strings * 40 + 40"
                stroke="currentColor"
                :stroke-width="fretIndex === 1 ? 4 : 2"
              />

              <!-- Notes -->
              <g v-for="stringIndex in strings" :key="`string-${stringIndex}`">
                <circle
                  v-for="fretIndex in frets"
                  :key="`note-${stringIndex}-${fretIndex}`"
                  :cx="fretIndex * 60 - 30"
                  :cy="(stringIndex - 1) * 40 + 40"
                  r="10"
                  class="cursor-pointer transition-colors"
                  :fill="getNoteColor(stringIndex, fretIndex)"
                  @click="onNoteClick(stringIndex, fretIndex)"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fretboard {
  user-select: none;
}
</style>
