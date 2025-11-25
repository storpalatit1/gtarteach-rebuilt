<script setup>
import { onMounted, ref } from 'vue'
import questions from '~/../data/trueOrFalseQuestions.js'

// State
const currentQuestion = ref(null)
const selectedAnswer = ref(null) // null = unanswered
const score = ref({ correct: 0, total: 0 })
const goTo = ref(false)
// Load a random question
function generateQuestion() {
  const randomIndex = Math.floor(Math.random() * questions.length)
  currentQuestion.value = questions[randomIndex]
  selectedAnswer.value = null
  // console.log(currentQuestion.value.answer)
}

// Handle answer click
function handleAnswer(answer) {
  selectedAnswer.value = answer

  const isCorrect = answer === currentQuestion.value.answer

  score.value = {
    correct: score.value.correct + (isCorrect ? 1 : 0),
    total: score.value.total + 1,
  }
}
function goToNext() {
  goTo.value = false
  generateQuestion()
}

// Go to next question
function handleNext() {
  goTo.value = true
}
onMounted(() => {
  generateQuestion()
})
</script>

<template>
  <main v-if="goTo === false" class="h-screen flex flex-col items-center justify-center text-center">
    <div class="p-4 sm:p-8">
      <div class="p-4">
        <!-- QUESTION -->
        <h4 class="mb-3 text-lg font-semibold">
          {{ currentQuestion?.question }}
        </h4>

        <!-- TRUE / FALSE BUTTONS -->
        <div class="grid grid-cols-2 gap-3">
          <button
            class="w-full border border-blue-400 rounded-lg px-4 py-3 transition dark:border-gray-100"
            :class="{
              'bg-green-500 text-white': selectedAnswer === true && currentQuestion.answer === true,
              'bg-red-500 text-white': selectedAnswer === true && currentQuestion.answer !== true,
              'hover:bg-gray-100 dark:hover:bg-gray-800': selectedAnswer === null,
            }"
            :disabled="selectedAnswer !== null"
            @click="handleAnswer(true)"
          >
            True
          </button>

          <button
            class="w-full border border-blue-400 rounded-lg px-4 py-3 transition dark:border-gray-100"
            :class="{
              'bg-green-500 text-white': selectedAnswer === false && currentQuestion.answer === false,
              'bg-red-500 text-white': selectedAnswer === false && currentQuestion.answer !== false,
              'hover:bg-gray-100 dark:hover:bg-gray-800': selectedAnswer === null,
            }"
            :disabled="selectedAnswer !== null"
            @click="handleAnswer(false)"
          >
            False
          </button>
        </div>

        <!-- NEXT BUTTON -->
        <div class="mt-4">
          <button
            class="rounded-lg bg-blue-400 px-4 py-2 text-white dark:bg-gray-600 hover:bg-blue-600 disabled:opacity-50 dark:hover:bg-gray-300"
            :disabled="selectedAnswer === null"
            @click="handleNext"
          >
            Next
          </button>
        </div>

        <!-- SCORE -->
        <div class="mt-2 text-sm text-size-2xl text-gray-600 dark:text-gray-300">
          Score: {{ score.correct }} correct out of {{ score.total }}
        </div>
      </div>
    </div>
  </main>
  <main v-else class="h-screen flex flex-col items-center justify-center text-center">
    <div py-2 />
    <Progression difficulty="Beginner" :is-correct="selectedAnswer === currentQuestion.answer" />
    <div class="mt-4">
      <button
        class="rounded-lg bg-blue-400 px-4 py-2 text-white dark:bg-gray-600 hover:bg-blue-600 disabled:opacity-100 dark:hover:bg-gray-300"
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
