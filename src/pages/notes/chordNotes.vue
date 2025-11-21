<script setup lang="ts">
import { onMounted, ref } from 'vue'

const chords: Record<string, string[]> = {
  'C Major': ['C', 'E', 'G'],
  'C Minor': ['C', 'D#', 'G'],
  'D Major': ['D', 'F#', 'A'],
  'D Minor': ['D', 'F', 'A'],
  'E Major': ['E', 'G#', 'B'],
  'E Minor': ['E', 'G', 'B'],
}

const chord = ref('')
const userNote1 = ref('')
const userNote2 = ref('')
const userNote3 = ref('')
const feedback = ref('')
const score = ref({ correct: 0, total: 0 })

function generateQuestion() {
  const chordNames = Object.keys(chords)
  const randomChord = chordNames[Math.floor(Math.random() * chordNames.length)]
  chord.value = randomChord
  feedback.value = ''
  userNote1.value = ''
  userNote2.value = ''
  userNote3.value = ''
}

function handleAnswer() {
  const correctNotes = chords[chord.value]

  const combinedInput
    = `${userNote1.value}, ${userNote2.value}, ${userNote3.value}`

  const userEntered = combinedInput
    .split(/[, ]+/)
    .map(n => n.trim().toUpperCase())
    .filter(Boolean)

  const correctSet = new Set(correctNotes.map(n => n.toUpperCase()))
  const userSet = new Set(userEntered)

  // ✔ Correct only when all notes match exactly (no duplicates, any order)
  const isCorrect
    = userSet.size === correctSet.size
      && [...userSet].every(note => correctSet.has(note))

  feedback.value = isCorrect
    ? '✅ Correct!'
    : `❌ Wrong! Correct notes: ${correctNotes.join(', ')}`

  if (isCorrect) {
    score.value.correct++
  }
  score.value.total++
}

onMounted(() => {
  generateQuestion()
})
</script>

<template>
  <main class="h-screen flex flex-col items-center justify-center text-center">
    <div class="max-w-lg w-full p-4">
      <h2 class="mb-4 text-xl">
        What notes make the chord: {{ chord }}?
      </h2>

      <div class="grid grid-cols-3 mx-auto w-2/5 gap-1 border-2 border-blue-400 rounded-lg p-2 dark:border-gray-200">
        <input
          v-model="userNote1"
          class="max-length-1 w-full border-b-2 text-center outline-none"
        >
        <input
          v-model="userNote2"
          class="max-length-1 w-full border-b-2 text-center outline-none"
        >
        <input
          v-model="userNote3"
          class="max-length-1 w-full border-b-2 text-center outline-none"
        >
      </div>

      <button
        class="mt-4 rounded-md bg-blue-200 px-4 py-2 dark:border dark:border-gray-400 dark:bg-transparent"
        :disabled="feedback !== ''"
        @click="handleAnswer"
      >
        Submit
      </button>

      <p class="mt-4 font-semibold" :class="feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'">
        {{ feedback }}
      </p>

      <button
        :class="{
          'rounded-lg bg-blue-800 px-4 py-2 text-white dark:bg-gray-800 dark:text-gray disabled:opacity-100': feedback === '',
          'rounded-lg bg-blue-400 px-4 py-2 text-white dark:bg-gray-600 hover:bg-blue-600 disabled:opacity-100 dark:hover:bg-gray-300': feedback !== '',
        }"
        :disabled="feedback === ''"
        @click="generateQuestion"
      >
        Next
      </button>
      <div class="mt-2 text-sm text-size-2xl text-gray-600 dark:text-gray-300">
        Score: {{ score.correct }} correct out of {{ score.total }}
      </div>
    </div>
  </main>
</template>
