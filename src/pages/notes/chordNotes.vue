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
const userNotes = ref('')
const feedback = ref('')

function generateQuestion() {
  const chordNames = Object.keys(chords)
  const randomChord = chordNames[Math.floor(Math.random() * chordNames.length)]
  chord.value = randomChord
  feedback.value = ''
  userNotes.value = ''
}

function handleAnswer() {
  const correctNotes = chords[chord.value]
  const userEntered = userNotes.value
    .split(',')
    .map(n => n.trim().toUpperCase()) // normalize
    .filter(Boolean)

  const correctSet = new Set(correctNotes.map(n => n.toUpperCase()))

  const isCorrect
    = userEntered.length === correctNotes.length
      && userEntered.every(note => correctSet.has(note))

  feedback.value = isCorrect ? '✅ Correct!' : `❌ Wrong! Correct notes: ${correctNotes.join(', ')}`
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

      <div class="mx-auto w-3/5 border-2 border-blue-400 rounded-lg p-2 dark:border-gray-200">
        <input
          v-model="userNotes"
          placeholder="Format: E,F#,G"
          class="w-full text-center outline-none"
        >
      </div>

      <button
        class="mt-4 rounded bg-blue-500 px-4 py-2 text-white dark:bg-gray-300 hover:bg-blue-600 dark:text-black dark:hover:bg-gray-400"
        @click="handleAnswer"
      >
        Submit
      </button>

      <p class="mt-4 font-semibold" :class="feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'">
        {{ feedback }}
      </p>

      <button
        class="mt-4 rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 dark:text-black"
        @click="generateQuestion"
      >
        Next Question
      </button>
    </div>
  </main>
</template>
