<script setup>
import { onMounted, ref } from 'vue'

const selectedChord = ref('')
const selectedChordFormula = ref([''])
const selectedAnswer = ref(false)
const canonicalChromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const selectedRoot = ref('')
const chordTypes
  = [
    { name: 'Major', formula: ['1', '3', '5'] },
    { name: 'Minor', formula: ['1', 'b3', '5'] },
    { name: 'Dominant 7', formula: ['1', '3', '5', 'b7'] },
    { name: 'Major 7', formula: ['1', '3', '5', '7'] },
    { name: 'Minor 7', formula: ['1', 'b3', '5', 'b7'] },
    { name: 'Diminished', formula: ['1', 'b3', '#5'] },
    { name: 'Half-Diminished (m7b5)', formula: ['1', 'b3', 'b5', 'b7'] },
    { name: 'Augmented', formula: ['1', '3', '#5'] },
  ]
const score = ref({ correct: 0, total: 0 })
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5)
const displayedFormulas = ref([])
const goTo = ref(false)
function generateQuestion() {
  const randomRoot = canonicalChromatic[Math.floor(Math.random() * canonicalChromatic.length)]
  const randomChordIndex = Math.floor(Math.random() * chordTypes.length)
  const randomChordFormula = chordTypes[randomChordIndex].formula
  const randomChord = chordTypes[randomChordIndex].name

  selectedRoot.value = randomRoot
  selectedChordFormula.value = randomChordFormula
  selectedChord.value = randomChord
  displayedFormulas.value = shuffle(chordTypes)
  // console.log(randomChord,randomChordFormula);
}
function handleAnswer(answer) {
  selectedAnswer.value = answer
  const isCorrect = answer === selectedChord.value
  score.value = {
    correct: score.value.correct + (isCorrect ? 1 : 0),
    total: score.value.total + 1,
  }
}
function goToNext() {
  selectedAnswer.value = false
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
  <main v-if="goTo === false" class="mx-auto h-screen max-w-4xl items-center justify-between text-center">
    <div class="p-4">
      <div py-2 />
      <div>
        <h4 class="mb-3 text-lg font-semibold">
          What is the formula for the {{ selectedRoot }} {{ selectedChord }}?
        </h4>
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="option in displayedFormulas" :key="option.name"
            class="w-full border-1.25 border-blue-400 rounded-lg px-2 py-1 transition dark:border-gray-100" :class="{
              'bg-green-500 text-white': selectedAnswer === option.name && option.name === selectedChord,
              'bg-red-500 text-white': selectedAnswer === option.name && option.name !== selectedChord,
              'hover:bg-gray-100 dark:hover:bg-gray-800': !selectedAnswer,
            }" :disabled="!!selectedAnswer" @click="handleAnswer(option.name)"
          >
            {{ option.formula.join(' - ') }}
          </button>
        </div>

        <div class="mt-4">
          <button
            class="rounded-lg bg-blue-400 px-4 py-2 text-white dark:bg-gray-600 hover:bg-blue-600 disabled:opacity-100 dark:hover:bg-gray-300"
            :disabled="!selectedAnswer" @click="handleNext"
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
    <Progression difficulty="Beginner" :is-correct="selectedAnswer === selectedChord" />
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
