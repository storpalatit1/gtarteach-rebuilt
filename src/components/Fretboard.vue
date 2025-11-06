<script setup lang="ts">
// import * as Tone from "tone";
// import { ref } from "vue";

// const pitch = ref(0);

// let player: Tone.Player | null = null;
// let pitchShift: Tone.PitchShift | null = null;

// const setupAudio = async () => {
//   await Tone.start();
//   if (!player) {
//     player = new Tone.Player("/guitar-note.wav").toDestination();
//   }
//   if (!pitchShift) {
//     pitchShift = new Tone.PitchShift(pitch.value).toDestination();
//     player.connect(pitchShift);
//   }
// };

// const updatePitch = () => {
//   if (pitchShift) pitchShift.pitch = Number(pitch.value);
// };

// const playNote = async () => {
//   if (!player) await setupAudio();
//   player?.start();
// };

interface Position {
  string: number
  fret: number
}

interface FretboardProps {
  positions: Position[]
  frets?: number
}

const { positions, frets } = withDefaults(defineProps<FretboardProps>(), {
  frets: 12,
})

const strings = 6
const stringNames = ['E', 'B', 'G', 'D', 'A', 'E']
</script>

<template>
  <div py-1 />
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
              :stroke-width="stringIndex === 1 || stringIndex === strings ? 3 : 2"
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

            <!-- Finger positions -->
            <g
              v-for="(pos, index) in positions"
              :key="`pos-${index}`"
              :transform="`translate(${pos.fret * 60 + 18}, ${(pos.string - 1) * 40 + 28})`"
            >
              <!-- Your icon -->
              <path
                fill="currentColor"
                d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
                class="fill-primary"
              />
              <!-- <text
                :x="pos.fret * 60 + 30"
                :y="(pos.string - 1) * 40 + 40"
                text-anchor="middle"
                dominant-baseline="central"
                class="fill-primary-foreground font-bold"
                style="font-size: 14px"
              >
                {{ index + 1 }}
              </text> -->
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
