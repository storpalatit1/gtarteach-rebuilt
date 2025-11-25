<script setup>
import { onMounted, ref } from 'vue'
import majorChords from '~/../data/majorchords.js'
import minorchords from '~/../data/minorchords.js'
import Fretboard from '~/components/Fretboard.vue'
import Progression from '~/components/Progression.vue'
// import {incrementCorrect, incrementStreak, wrongAnswer} from "../../lib/incrementStats.js"
const chords = majorChords.concat(minorchords)
// Reactive state
const currentChord = ref(chords[0])
const options = ref([])
const selectedAnswer = ref(null)
const score = ref({ correct: 0, total: 0 })
const isCorrect = ref(null)
const goTo = ref(false)
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5)

// Generate a new question
function generateQuestion() {
  isCorrect.value = null
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
  isCorrect.value = answer === currentChord.value.name
  score.value = {
    correct: score.value.correct + (!!isCorrect.value),
    total: score.value.total + 1,

  }
  // if(isCorrect == true)
  // {
  // incrementCorrect("Beginner")
  // incrementStreak()
  // }
  // else
  // {
  //   wrongAnswer()
  // }
}

function goToNext() {
  goTo.value = false
  generateQuestion()
}

// Go to next question
function handleNext() {
  goTo.value = true
}

// Initialize on mount
onMounted(() => {
  generateQuestion()
})
</script>

<template>
  <main v-if="goTo === false" class="mx-auto h-screen max-w-4xl items-center justify-between text-center">
    <div class="p-4">
      <h1 class="mb-4 text-2xl font-bold">
        Basic Chords Test
      </h1>
      <Fretboard :positions="currentChord.positions" :start-fret="0" :end-fret="5" />
      <div py-2 />
      <div>
        <h2 class="mb-3 text-lg font-semibold">
          What chord is this?
        </h2>

        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="option in options"
            :key="option"
            class="w-full border-1.25 border-blue-400 rounded-lg px-2 py-1 transition dark:border-gray-100"
            :class="{
              'bg-green-500 text-white': (selectedAnswer === option && option === currentChord.name) || (selectedAnswer !== option && option === currentChord.name) && selectedAnswer !== null,
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

        <div class="mt-2 text-sm text-size-2xl text-gray-600 dark:text-gray-300">
          Score: {{ score.correct }} correct out of {{ score.total }}
        </div>
      </div>
    </div>
  </main>
  <main v-else class="h-screen flex flex-col items-center justify-center text-center">
    <div py-2 />
    <Progression difficulty="Beginner" :is-correct :correct-answer="currentChord.name" />
    <div class="mt-4">
      <button
        class="rounded-lg bg-blue-400 px-4 py-2 text-white dark:bg-gray-600 hover:bg-blue-600 disabled:opacity-100 dark:hover:bg-gray-300"
        :disabled="!selectedAnswer"
        @click="goToNext"
      >
        Next
      </button>
    </div>

    <div class="mt-2 text-sm text-size-2xl text-gray-600 dark:text-gray-300">
      Score: {{ score.correct }} correct out of {{ score.total }}
    </div>
  </main>
</template>
