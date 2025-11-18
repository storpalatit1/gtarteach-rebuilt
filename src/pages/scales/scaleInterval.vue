<script setup>
import { onMounted, ref } from 'vue'

const modes = ['major', 'minor', 'dorian', 'lydian', 'aeolian (minor)', 'phrygian', 'mixolydian', 'locrian', 'ionian (major)']

const majorScaleInterval = ['W', 'W', 'H', 'W', 'W', 'W', 'H']
const minorScaleInterval = ['W', 'H', 'W', 'W', 'H', 'W', 'W']
const dorianScaleInterval = ['W', 'H', 'W', 'W', 'W', 'H', 'W']
const phrygianScaleInterval = ['H', 'W', 'W', 'W', 'H', 'W', 'W']
const lydianScaleInterval = ['W', 'W', 'W', 'H', 'W', 'W', 'H']
const mixolydianScaleInterval = ['W', 'W', 'H', 'W', 'W', 'H', 'W']
const locrianScaleInterval = ['H', 'W', 'W', 'H', 'W', 'W', 'W']

const modeAliases = {
  'major': ['major', 'ionian (major)', 'ionian'],
  'ionian (major)': ['major', 'ionian (major)', 'ionian'],
  'minor': ['minor', 'aeolian (minor)', 'aeolian'],
  'aeolian (minor)': ['minor', 'aeolian (minor)', 'aeolian'],
  'dorian': ['dorian'],
  'phrygian': ['phrygian'],
  'lydian': ['lydian'],
  'mixolydian': ['mixolydian'],
  'locrian': ['locrian'],
}

// const selectedMode = ref('major')
const correctMode = ref(modes[0])
const correctModeDisplay = ref(majorScaleInterval)
const selectedAnswer = ref(null)
const score = ref({ correct: 0, total: 0 })

function generateQuestion() {
  const correct = modes[Math.floor(Math.random() * modes.length)]
  correctMode.value = correct
  // console.log(correctMode.value);

  switch (correctMode.value) {
    case 'major':
      correctModeDisplay.value = majorScaleInterval
      break
    case 'ionian (major)':
      correctModeDisplay.value = majorScaleInterval
      break
    case 'aeolian (minor)':
      correctModeDisplay.value = minorScaleInterval
      break
    case 'minor':
      correctModeDisplay.value = minorScaleInterval
      break
    case 'dorian':
      correctModeDisplay.value = dorianScaleInterval
      break
    case 'phrygian':
      correctModeDisplay.value = phrygianScaleInterval
      break
    case 'lydian':
      correctModeDisplay.value = lydianScaleInterval
      break
    case 'mixolydian':
      correctModeDisplay.value = mixolydianScaleInterval
      break
    case 'locrian':
      correctModeDisplay.value = locrianScaleInterval
      break
  }
}
function handleAnswer(answer) {
  selectedAnswer.value = answer

  const correctAliases = modeAliases[correctMode.value] || []

  if (correctAliases.includes(answer)) {
    // console.log("correct");
    score.value.correct++
  }

  score.value.total++
}

function handleNext() {
  selectedAnswer.value = null
  generateQuestion()
}

onMounted(() => {
  generateQuestion()
})
</script>

<template>
  <div py-4 />
  <main class="mx-auto h-screen max-w-4xl items-center justify-between text-center">
    <div class="border-1.5 border-blue-400 rounded-lg dark:border-gray-100">
      <h4 class="mb-3 text-lg font-semibold">
        What mode is this?
      </h4>
      <h4 v-if="!selectedAnswer" class="text-size-10">
        {{ correctModeDisplay.join(' - ') }}
      </h4>
      <h4 v-else class="text-size-7">
        it was {{ correctMode }} mode
      </h4>
      <div py-2 />
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="mode in modes"
          :key="mode"
          class="w-full border-1.25 border-blue-400 rounded-lg px-2 py-1 transition dark:border-gray-100"
          :class="{
            'bg-green-500 text-white': selectedAnswer === mode && modeAliases[correctMode].includes(mode),
            'bg-red-500 text-white': selectedAnswer === mode && !modeAliases[correctMode].includes(mode),
            'hover:bg-gray-100 dark:hover:bg-gray-800': !selectedAnswer,
          }"
          :disabled="!!selectedAnswer"
          @click="handleAnswer(mode)"
        >
          {{ mode }}
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
  </main>
</template>
