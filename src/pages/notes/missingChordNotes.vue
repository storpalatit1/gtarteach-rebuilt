<script setup lang="ts">
import { concat } from 'lodash'
import { onMounted, ref } from 'vue'
import majorChords from '~/../data/majorchords.js'
import minorchords from '~/../data/minorchords.js'
import seventhchords from '~/../data/seventhchords.js'
import Fretboard from '~/components/Fretboard.vue'

interface Position {
  string: number // this tells TS it's a number
  fret: number
}

interface Chord {
  id: number
  name: string
  positions: Position[]
}
const chords = concat(majorChords, minorchords, seventhchords) as Chord[]
const currentChord = ref(chords[0])
const chord = ref('')
const userNotes = ref('')
const feedback = ref('')
const currentChordNotes = ref([''])
const hiddenNote = ref('C')
const visiblePositions = ref<Position[]>([])
const tuning = ['E', 'B', 'G', 'D', 'A', 'E'] // Standard tuning, string 1 = high E

const notesSharp = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

function noteFromStringFret(stringNumber: number, fret: number) {
  // tuning[0] should be string 1 (high E), tuning[1] string 2 (B), etc.
  const openNote = tuning[stringNumber - 1]

  const openIndex = notesSharp.indexOf(openNote)
  return notesSharp[(openIndex + fret) % 12]
}
function generateQuestion() {
  const randomChord = chords[Math.floor(Math.random() * chords.length)]
  currentChord.value = randomChord
  chord.value = randomChord.name

  const notes = randomChord.positions.map(pos =>
    noteFromStringFret(pos.string, pos.fret),
  )

  // Step 1: choose which POSITION to hide
  const randomIndex = Math.floor(Math.random() * randomChord.positions.length)

  // Step 2: hide THAT position
  visiblePositions.value = randomChord.positions.filter((_, i) => i !== randomIndex)

  // Step 3: define hidden note from THAT SAME position
  hiddenNote.value = notes[randomIndex]

  // Save the full notes for debugging if needed
  currentChordNotes.value = notes

  userNotes.value = ''
  feedback.value = ''
}

function handleAnswer() {
  const userAnswer = userNotes.value.trim().toUpperCase()
  const correct = hiddenNote.value.toUpperCase()

  const isCorrect = userAnswer === correct

  feedback.value = isCorrect
    ? '✅ Correct!'
    : `❌ Wrong! The correct note was: ${correct}`
}

onMounted(() => {
  generateQuestion()
})
</script>

<template>
  <main class="h-screen flex flex-col items-center justify-center text-center">
    <div class="max-w-lg w-full p-4">
      <h2 class="mb-1 text-xl">
        What is the missing note of {{ chord }}?
      </h2>

      <Fretboard :positions="visiblePositions" :start-fret="0" :end-fret="5" />
      <div class="mx-auto mt-5 w-2/5 border-2 border-blue-300 rounded-lg p-2">
        <input
          v-model="userNotes"
          placeholder="Format: E" class="h-full w-full"
        >
      </div>
      <button
        class="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        @click="handleAnswer"
      >
        Submit
      </button>

      <p class="mt-4 font-semibold" :class="feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'">
        {{ feedback }}
      </p>

      <button
        class="mt-1 rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
        @click="generateQuestion"
      >
        Next Question
      </button>
    </div>
  </main>
</template>
