<script setup>
import { ref } from 'vue'

const props = defineProps({
  modifiers: {
    type: String,
    required: false,
  },
})

const emit = defineEmits(['notePressed'])

const playerRef = ref()

function playNote(note) {
  if (note.name.length === 2 && Number.isNaN(note.name[1])) {
    playerRef.value.initAudio(`../../../public/notes/${note.gString}/${note.name[0]}s.mp3`)
  }
  else {
    playerRef.value.initAudio(`../../../public/notes/${note.gString}/${note.name}.mp3`)
  }
  emit('notePressed', note)
}
const notes = [
  { x: 6, y: 88, name: 'E', octave: 1, gString: 1 },
  { x: 10, y: 88, name: 'F', octave: 1, gString: 1 },
  { x: 17, y: 88, name: 'F#', octave: 1, gString: 1 },
  { x: 24.5, y: 88, name: 'G', octave: 1, gString: 1 },
  { x: 32, y: 88, name: 'G#', octave: 1, gString: 1 },
  { x: 39, y: 88, name: 'A', octave: 1, gString: 1 },
  { x: 46, y: 88, name: 'A#', octave: 1, gString: 1 },
  { x: 54, y: 88, name: 'B', octave: 1, gString: 1 },
  { x: 61, y: 88, name: 'C', octave: 2, gString: 1 },
  { x: 68, y: 88, name: 'C#', octave: 2, gString: 1 },
  { x: 76, y: 88, name: 'D', octave: 2, gString: 1 },
  { x: 83, y: 88, name: 'D#', octave: 2, gString: 1 },
  { x: 91, y: 88, name: 'E2', octave: 2, gString: 1 },

  { x: 6, y: 73, name: 'A', octave: 1, gString: 2 },
  { x: 10, y: 73, name: 'A#', octave: 1, gString: 2 },
  { x: 17, y: 73, name: 'B', octave: 1, gString: 2 },
  { x: 24.5, y: 73, name: 'C', octave: 2, gString: 2 },
  { x: 32, y: 73, name: 'C#', octave: 2, gString: 2 },
  { x: 39, y: 73, name: 'D', octave: 2, gString: 2 },
  { x: 46, y: 73, name: 'D#', octave: 2, gString: 2 },
  { x: 54, y: 73, name: 'E', octave: 2, gString: 2 },
  { x: 61, y: 73, name: 'F', octave: 2, gString: 2 },
  { x: 68, y: 73, name: 'F#', octave: 2, gString: 2 },
  { x: 76, y: 73, name: 'G', octave: 2, gString: 2 },
  { x: 83, y: 73, name: 'G#', octave: 2, gString: 2 },
  { x: 91, y: 73, name: 'A2', octave: 2, gString: 2 },

  { x: 6, y: 58, name: 'D', octave: 2, gString: 3 },
  { x: 10, y: 58, name: 'D#', octave: 2, gString: 3 },
  { x: 17, y: 58, name: 'E', octave: 2, gString: 3 },
  { x: 24.5, y: 58, name: 'F', octave: 2, gString: 3 },
  { x: 32, y: 58, name: 'F#', octave: 2, gString: 3 },
  { x: 39, y: 58, name: 'G', octave: 2, gString: 3 },
  { x: 46, y: 58, name: 'G#', octave: 2, gString: 3 },
  { x: 54, y: 58, name: 'A', octave: 2, gString: 3 },
  { x: 61, y: 58, name: 'A#', octave: 2, gString: 3 },
  { x: 68, y: 58, name: 'B', octave: 2, gString: 3 },
  { x: 76, y: 58, name: 'C', octave: 3, gString: 3 },
  { x: 83, y: 58, name: 'C#', octave: 3, gString: 3 },
  { x: 91, y: 58, name: 'D2', octave: 3, gString: 3 },

  { x: 6, y: 42, name: 'G', octave: 2, gString: 4 },
  { x: 10, y: 42, name: 'G#', octave: 2, gString: 4 },
  { x: 17, y: 42, name: 'A', octave: 2, gString: 4 },
  { x: 24.5, y: 42, name: 'A#', octave: 2, gString: 4 },
  { x: 32, y: 42, name: 'B', octave: 2, gString: 4 },
  { x: 39, y: 42, name: 'C', octave: 3, gString: 4 },
  { x: 46, y: 42, name: 'C#', octave: 3, gString: 4 },
  { x: 54, y: 42, name: 'D', octave: 3, gString: 4 },
  { x: 61, y: 42, name: 'D#', octave: 3, gString: 4 },
  { x: 68, y: 42, name: 'E', octave: 3, gString: 4 },
  { x: 76, y: 42, name: 'F', octave: 3, gString: 4 },
  { x: 83, y: 42, name: 'F#', octave: 3, gString: 4 },
  { x: 91, y: 42, name: 'G2', octave: 3, gString: 4 },

  { x: 6, y: 27, name: 'B', octave: 2, gString: 5 },
  { x: 10, y: 27, name: 'C', octave: 3, gString: 5 },
  { x: 17, y: 27, name: 'C#', octave: 3, gString: 5 },
  { x: 24.5, y: 27, name: 'D', octave: 3, gString: 5 },
  { x: 32, y: 27, name: 'D#', octave: 3, gString: 5 },
  { x: 39, y: 27, name: 'E', octave: 3, gString: 5 },
  { x: 46, y: 27, name: 'F', octave: 3, gString: 5 },
  { x: 54, y: 27, name: 'F#', octave: 3, gString: 5 },
  { x: 61, y: 27, name: 'G', octave: 3, gString: 5 },
  { x: 68, y: 27, name: 'G#', octave: 3, gString: 5 },
  { x: 76, y: 27, name: 'A', octave: 3, gString: 5 },
  { x: 83, y: 27, name: 'A#', octave: 3, gString: 5 },
  { x: 91, y: 27, name: 'B2', octave: 3, gString: 5 },

  { x: 6, y: 13, name: 'E', octave: 3, gString: 6 },
  { x: 10, y: 13, name: 'F', octave: 3, gString: 6 },
  { x: 17, y: 13, name: 'F#', octave: 3, gString: 6 },
  { x: 24.5, y: 13, name: 'G', octave: 3, gString: 6 },
  { x: 32, y: 13, name: 'G#', octave: 3, gString: 6 },
  { x: 39, y: 13, name: 'A', octave: 3, gString: 6 },
  { x: 46, y: 13, name: 'A#', octave: 3, gString: 6 },
  { x: 54, y: 13, name: 'B', octave: 3, gString: 6 },
  { x: 61, y: 13, name: 'C', octave: 4, gString: 6 },
  { x: 68, y: 13, name: 'C#', octave: 4, gString: 6 },
  { x: 76, y: 13, name: 'D', octave: 4, gString: 6 },
  { x: 83, y: 13, name: 'D#', octave: 4, gString: 6 },
  { x: 91, y: 13, name: 'E2', octave: 4, gString: 6 },
]
</script>

<template>
  <div class="relative max-w-4xl w-full">
    <!-- Scalable background image -->
    <img
      src="/assets/fretboard.png"
      alt="Fretboard"
      class="pointer-events-none h-auto w-full select-none"
    >

    <!-- Clickable note buttons -->
    <button
      v-for="(note, index) in notes"
      :key="index"
      class="absolute rounded-full bg-blue-500 opacity-80 transition-transform duration-150 hover:scale-125 dark:bg-gray-800 hover:opacity-100"
      :style="{
        width: '3%',
        height: '10%',
        top: `${note.y}%`,
        left: `${note.x}%`,
        transform: 'translate(-50%, -50%)',
      }"
      @click="playNote(note)"
    >
      <div v-if="props.modifiers !== 'blindfold'">
        {{ note.name }}
      </div>
    </button>
  </div>
  <!-- <AudioPlayer ref="playerRef" /> -->
</template>

<style scoped>
.relative {
  aspect-ratio: 5 / 1; /* keep the shape consistent */
}
</style>
*/
