<script setup lang="ts">
import * as Tone from 'tone'
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<FretboardProps>(), {
  frets: 12,
  multiple: false,
  modelValue: () => [],
})
const emit = defineEmits(['update:modelValue'])
const strings = 6
const stringNames = ['E', 'B', 'G', 'D', 'A', 'E']

interface Position {
  string: number
  fret: number
}

interface FretboardProps {
  positions?: Position[]
  frets?: number
  multiple?: boolean
  modelValue?: Position[]
}

let synth: Tone.FMSynth | null = null

const selectedNotes = ref<Position[]>([...props.modelValue])

watch(
  () => props.modelValue,
  newVal => (selectedNotes.value = [...newVal]),
)

async function setupAudio() {
  await Tone.start()
  if (!synth)
    synth = new Tone.FMSynth().toDestination()
}

const noteNames = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]

// Lowest string (6th) is E2 in standard tuning.
const stringOpenNotes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']

function getNoteName(stringIndex: number, fretIndex: number): string {
  // Example: stringIndex = 6 (low E string)
  const openNote = stringOpenNotes[strings - stringIndex]
  const match = openNote.match(/([A-G]#?)(\d)/)
  if (!match)
    return 'N/A'

  const [, openNoteName, octaveStr] = match
  let octave = Number.parseInt(octaveStr)
  let semitoneIndex = noteNames.indexOf(openNoteName) + fretIndex

  // Adjust octave if we go above 11 semitones
  while (semitoneIndex >= 12) {
    semitoneIndex -= 12
    octave++
  }

  return `${noteNames[semitoneIndex]}${octave}`
}

// const getNoteFrequency = (stringIndex: number, fretIndex: number): number => {
//   const baseFrequencies = [82.41, 110, 146.83, 196, 246.94, 329.63];
//   const openFreq = baseFrequencies[strings - stringIndex];
//   return openFreq * Math.pow(2, fretIndex / 12);
// };
async function onNoteClick(stringIndex: number, fretIndex: number) {
  await setupAudio()

  const noteName = getNoteName(stringIndex, fretIndex)
  synth?.triggerAttackRelease(noteName, '8n') // ✅ this one only

  const pos = { string: stringIndex, fret: fretIndex, note: noteName }

  const existingIndex = selectedNotes.value.findIndex(
    n => n.string === pos.string && n.fret === pos.fret,
  )

  if (existingIndex >= 0) {
    selectedNotes.value.splice(existingIndex, 1)
  }
  else {
    if (!props.multiple) {
      selectedNotes.value = [pos]
    }
    else {
      selectedNotes.value.push(pos)
    }
  }

  emit('update:modelValue', [...selectedNotes.value])
}
function getNoteColor(stringIndex: number, fretIndex: number) {
  return selectedNotes.value.some(
    n => n.string === stringIndex && n.fret === fretIndex,
  )
    ? '#10b981' // selected
    : '#9ca3af' // default
}
</script>

<template>
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

        <!-- Fretboard -->
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
              :fill="isDark ? '#fff' : '#1f2937'"
              class="text-xs"
              style="font-size: 12px"
            >
              {{ fretIndex - 1 }}
            </text>

            <!-- Strings (horizontal lines) -->
            <line
              v-for="stringIndex in strings"
              :key="`string-${stringIndex}`"
              x1="0"
              :y1="(stringIndex - 1) * 40 + 40"
              :x2="(frets + 1) * 60"
              :y2="(stringIndex - 1) * 40 + 40"
              stroke="currentColor"
              :stroke-width="stringIndex === 6 || stringIndex === strings ? 3 : 2"
              class="text-foreground"
            />

            <!-- Frets (vertical lines) -->
            <line
              v-for="fretIndex in frets + 1"
              :key="`fret-line-${fretIndex}`"
              :x1="(fretIndex - 1) * 60"
              y1="40"
              :x2="(fretIndex - 1) * 60"
              :y2="strings * 40 + 40"
              stroke="currentColor"
              :stroke-width="fretIndex === 1 ? 4 : 2"
              class="text-foreground"
            />

            <!-- Clickable notes -->
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

            <!-- Chord positions from props -->
            <g
              v-for="(pos, index) in positions"
              :key="`pos-${index}`"
              :transform="`translate(${pos.fret * 60 + 18}, ${(pos.string - 1) * 40 + 28})`"
            >
              <path
                fill="currentColor"
                d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
                class="fill-primary"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
