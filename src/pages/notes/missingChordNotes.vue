<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import majorChords from '~/../data/majorchords.js'
import minorchords from '~/../data/minorchords.js'
import seventhchords from '~/../data/seventhchords.js'
import Fretboard from '~/components/Fretboard.vue'

interface Position {
  string: number
  fret: number
}

interface Chord {
  id: number
  name: string
  positions: Position[]
}

const chords = [...majorChords, ...minorchords, ...seventhchords] as Chord[]

const currentChord = ref<Chord | null>(null)
const hiddenNote = ref<string | null>(null)
const visiblePositions = ref<Position[]>([])
const userNote = ref('')
const feedback = ref('')
const score = ref({ correct: 0, total: 0 })
const isCorrect = ref<boolean | null>(null)
const goTo = ref(false)
const tuning = ['E', 'B', 'G', 'D', 'A', 'E']
const notesSharp = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const chordName = computed(() => currentChord.value?.name ?? '')

const correctNoteString = computed(() => hiddenNote.value ?? '')

function noteFromStringFret(stringNumber: number, fret: number): string {
  const openNote = tuning[stringNumber - 1] // string 1 = tuning[0]
  const openIndex = notesSharp.indexOf(openNote)
  return notesSharp[(openIndex + fret) % 12]
}

function generateQuestion() {
  if (!chords.length)
    return

  isCorrect.value = null
  feedback.value = ''
  userNote.value = ''

  const randomChord = chords[Math.floor(Math.random() * chords.length)]
  currentChord.value = randomChord

  const notes = randomChord.positions.map(pos =>
    noteFromStringFret(pos.string, pos.fret),
  )

  const hiddenIndex = Math.floor(Math.random() * randomChord.positions.length)

  hiddenNote.value = notes[hiddenIndex]
  visiblePositions.value = randomChord.positions.filter((_, i) => i !== hiddenIndex)
}

function handleAnswer() {
  if (!hiddenNote.value)
    return

  const userAnswer = userNote.value.trim().toUpperCase()
  const correct = hiddenNote.value.toUpperCase()

  isCorrect.value = userAnswer === correct

  feedback.value = isCorrect.value
    ? '✅ Correct!'
    : `❌ Wrong! The correct note was: ${correct}`

  if (isCorrect.value) {
    score.value.correct++
  }
  score.value.total++
}

function goToNext() {
  goTo.value = false
  generateQuestion()
}

function handleNext() {
  goTo.value = true
}

onMounted(() => {
  generateQuestion()
})
</script>

<template>
  <main
    v-if="goTo === false"
    class="h-screen flex flex-col items-center justify-center text-center"
  >
    <div class="max-w-lg w-full p-4">
      <h2 class="mb-1 text-xl">
        What is the missing note of {{ chordName }}?
      </h2>

      <Fretboard
        :positions="visiblePositions"
        :start-fret="0"
        :end-fret="5"
      />

      <div
        class="mx-auto mt-5 w-2/5 border-2 border-blue-300 rounded-lg p-2 dark:border-gray-200"
      >
        <input
          v-model="userNote"
          placeholder="Format: E"
          class="h-full w-full text-center outline-none"
        >
      </div>

      <button
        class="mr-2 mt-4 rounded-md bg-blue-200 px-4 py-2 dark:border dark:border-gray-400 dark:bg-transparent"
        @click="handleAnswer"
      >
        Submit
      </button>
      <button
        class="rounded-lg bg-blue-800 px-4 py-2 text-white dark:bg-gray-800 dark:text-gray disabled:opacity-100"
        @click="handleNext"
      >
        Next
      </button>
      <p
        v-if="feedback"
        class="mt-4 font-semibold"
        :class="feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'"
      >
        {{ feedback }}
      </p>

      <div class="mt-2 text-sm text-gray-600 dark:text-gray-300">
        Score: {{ score.correct }} correct out of {{ score.total }}
      </div>
    </div>
  </main>

  <main v-else class="h-screen flex flex-col items-center justify-center text-center">
    <div class="max-w-xl w-full">
      <Progression
        difficulty="Intermediate"
        :is-correct="isCorrect"
        :correct-answer="correctNoteString"
      />
      <div class="mt-4">
        <button
          class="rounded-lg bg-blue-400 px-4 py-2 text-white dark:bg-gray-600 hover:bg-blue-600 disabled:opacity-100 dark:hover:bg-gray-300"
          @click="goToNext"
        >
          Next
        </button>
      </div>

      <div class="mt-2 text-sm text-gray-600 dark:text-gray-300">
        Score: {{ score.correct }} correct out of {{ score.total }}
      </div>
    </div>
  </main>
</template>
