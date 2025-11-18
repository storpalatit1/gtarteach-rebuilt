<script setup>
import { onMounted, ref } from 'vue'
import diminishedChords from '~/../data/diminishedchords.js'
import majorChords from '~/../data/majorchords.js'
import minorchords from '~/../data/minorchords.js'
import seventhChords from '~/../data/seventhchords.js'
import Fretboard from '~/components/Fretboard.vue'

const chords = majorChords.concat(minorchords, diminishedChords, seventhChords)
// Reactive state
const currentChord = ref(chords[0])
const options = ref([])
const selectedAnswer = ref(null)
const score = ref({ correct: 0, total: 0 })

// Shuffle helper
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5)

// Generate a new question
function generateQuestion() {
  const correctChord = chords[Math.floor(Math.random() * chords.length)]
  const wrongChords = chords.filter(c => c.name !== correctChord.name)
  const shuffledWrong = shuffle(wrongChords).slice(0, 3)
  const allOptions = shuffle([correctChord.name, ...shuffledWrong.map(c => c.name)])

  currentChord.value = correctChord
  options.value = allOptions
  selectedAnswer.value = null
}

// Handle user’s answer
function handleAnswer(answer) {
  selectedAnswer.value = answer
  const isCorrect = answer === currentChord.value.name
  score.value = {
    correct: score.value.correct + (isCorrect ? 1 : 0),
    total: score.value.total + 1,
  }
}

// Go to next question
function handleNext() {
  generateQuestion()
}

// Initialize on mount
onMounted(() => {
  generateQuestion()
})
</script>

<template>
  <main class="mx-auto h-screen max-w-4xl items-center justify-between text-center">
    <div class="p-4">
      <h1 class="mb-4 text-2xl font-bold">
        Basic Chords Test
      </h1>
      <Fretboard :positions="currentChord.positions" :start-fret="0" :end-fret="5" />
      <div py-2 />
      <div class="border-1.5 border-blue-400 rounded-lg dark:border-gray-100">
        <h4 class="mb-3 text-lg font-semibold">
          What chord is this?
        </h4>

        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="option in options"
            :key="option"
            class="w-full border-1.25 border-blue-400 rounded-lg px-2 py-1 transition dark:border-gray-100"
            :class="{
              'bg-green-500 text-white': selectedAnswer === option && option === currentChord.name,
              'bg-red-500 text-white': selectedAnswer === option && option !== currentChord.name,
              'hover:bg-gray-100 dark:hover:bg-gray-800': !selectedAnswer,
            }"
            :disabled="!!selectedAnswer"
            @click="handleAnswer(option)"
          >
            {{ option }}
          </button>
        </div>

        <div class="mt-4">
          <button
            class="rounded-lg bg-blue-400 px-4 py-2 text-white dark:bg-gray-600 hover:bg-blue-600 disabled:opacity-100 dark:hover:bg-gray-300"
            :disabled="!selectedAnswer"
            @click="handleNext"
          >
            Next
          </button>
        </div>

        <div class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Score: correct {{ score.correct }} out of {{ score.total }}
        </div>
      </div>
    </div>
  </main>
</template>
