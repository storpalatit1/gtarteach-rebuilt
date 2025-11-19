<script setup lang="ts">
interface Position {
  string: number
  fret: number
  note?: string
  isRoot?: boolean
}

interface FretboardProps {
  positions: Position[]
  showNotes?: boolean
  startFret?: number
  endFret?: number
}

const { positions, showNotes, startFret, endFret } = withDefaults(
  defineProps<FretboardProps>(),
  {
    showNotes: false,
    startFret: 0,
    endFret: 12,
  },
)

const strings = 6
const stringNames = ['E', 'B', 'G', 'D', 'A', 'E']
const fretWidth = 60

// compute visible frets from the provided range
const visibleFrets = Array.from(
  { length: endFret - startFret + 1 },
  (_, i) => i + startFret,
)
</script>

<template>
  <div py-1 />
  <div class="w-full overflow-x-auto">
    <div class="inline-block min-w-full">
      <div class="relative" style="padding-top: 40px">
        <!-- String names -->
        <!-- <div
  class="absolute left-0 top-0 flex flex-col"
  :style="{
    left: '10px',   // move labels 10px right
    gap: `calc((100% - 40px) / 5)`,
    height: 'calc(100% - 40px)',
    transform: 'translateY(40px)',
  }"
>
          <div
            v-for="(name, i) in stringNames"
            :key="i"
            class="text-muted-foreground w-8 pr-2 text-right text-xs font-medium -mt-2 "
          >
            {{ name }}
          </div>
        </div> -->

        <!-- Fretboard -->
        <div class="ml-15">
          <svg
            :viewBox="`-40 0 ${(visibleFrets.length + 1) * fretWidth + 40} ${strings * 40}`"
            class="mx-auto block"
            :style="{ maxWidth: `${(visibleFrets.length + 1) * fretWidth}px` }"
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
              v-for="fretIndex in visibleFrets"
              :key="`fret-${fretIndex}`"
              :x="(fretIndex - startFret) * fretWidth + 30"
              y="15"
              text-anchor="middle"
              class="text-foreground text-xs"
              fill="currentColor"
              style="font-size: 12px"
            >
              {{ fretIndex }}
            </text>

            <!-- Strings (horizontal lines) -->
            <line
              v-for="stringIndex in strings"
              :key="`string-${stringIndex}`"
              x1="0"
              :y1="(stringIndex - 1) * 40 + 40"
              :x2="(visibleFrets.length + 1) * fretWidth"
              :y2="(stringIndex - 1) * 40 + 40"
              stroke="currentColor"
              :stroke-width="stringIndex === 1 || stringIndex === strings ? 3 : 2"
              class="text-foreground"
            />

            <!-- Frets (vertical lines) -->
            <line
              v-for="(fretIndex, i) in visibleFrets"
              :key="`fret-line-${fretIndex}`"
              :x1="i * fretWidth"
              y1="40"
              :x2="i * fretWidth"
              :y2="strings * 40 + 40"
              stroke="currentColor"
              :stroke-width="fretIndex === startFret ? 4 : 2"
              class="text-foreground"
            />

            <!-- Finger positions -->
            <g
              v-for="(pos, index) in positions.filter(
                p => p.fret >= startFret && p.fret <= endFret,
              )"
              :key="`pos-${index}`"
              :transform="`translate(${(pos.fret - startFret) * fretWidth + 18}, ${(pos.string - 1) * 40 + 28})`"
            >
              <!-- Marker circle -->
              <circle
                cx="12"
                cy="12"
                r="12"
                :class="pos.isRoot
                  ? 'fill-blue-400 dark:fill-white stroke-blue-700 dark:stroke-white'
                  : 'fill-gray-200 stroke-gray-800 dark:fill-black dark:stroke-gray-100'"
              />

              <!-- Note label -->
              <text
                v-if="showNotes"
                x="12"
                y="12"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="currentColor"
                :class="pos.isRoot
                  ? 'text-white dark:text-black'
                  : 'text-black dark:text-white'"
                class="font-bold"
                style="font-size: 14px"
              >
                {{ pos.note }}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
