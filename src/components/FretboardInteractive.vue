<script setup lang="ts">
import * as Tone from 'tone'
import { ref } from 'vue'

const { positions = [], frets = 12 } = withDefaults(defineProps<FretboardProps>(), {
  frets: 12,
})
const strings = 6
const stringNames = ['E', 'B', 'G', 'D', 'A', 'E']

interface Position {
  string: number
  fret: number
}

interface FretboardProps {
  positions?: Position[]
  frets?: number
}

const activeNote = ref<{ string: number, fret: number } | null>(null)

const players: Record<number, Tone.Player> = {}
let pitchShift: Tone.PitchShift | null = null

// map strings to sample file paths (put these in /public/notes/)
const samplePaths: Record<number, string> = {
  1: '/notes/open/E2.wav',
  2: '/notes/open/B.wav',
  3: '/notes/open/G.wav',
  4: '/notes/open/D.wav',
  5: '/notes/open/A.wav',
  6: '/notes/open/E.wav',
}

// setup all players (called after user gesture)
async function setupAudio() {
  if (Object.keys(players).length === 0) {
    Object.entries(samplePaths).forEach(([string, path]) => {
      players[+string] = new Tone.Player(path).toDestination()
    })
  }

  if (!pitchShift) {
    pitchShift = new Tone.PitchShift(0).toDestination()
  }
}

// called when a fret circle is clicked
async function onNoteClick(stringIndex: number, fretIndex: number) {
  // unlock audio context on first click
  if (Tone.context.state !== 'running') {
    await Tone.start()
    // console.log("Audio context started by user interaction");
  }

  await setupAudio()

  activeNote.value = { string: stringIndex, fret: fretIndex }

  const player = players[stringIndex]
  if (!player)
    return

  // clone the player to avoid overlap
  const cloned = new Tone.Player(player.buffer).connect(pitchShift!)

  // 🧠 only apply pitch shifting when fret > 0
  if (fretIndex > 0 && pitchShift) {
    pitchShift.pitch = fretIndex
  }
  else if (pitchShift) {
    pitchShift.pitch = 0 // reset to normal pitch
  }
  cloned.fadeIn = 0.01
  cloned.fadeOut = 0.1
  cloned.start()
}

// highlight pressed notes
function getNoteColor(stringIndex: number, fretIndex: number) {
  if (
    activeNote.value?.string === stringIndex
    && activeNote.value?.fret === fretIndex
  ) {
    return '#10b981' // active note
  }
  return '#9ca3af' // default
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
              class="text-xs"
              style="font-size: 12px"
              fill="#6b7280"
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
