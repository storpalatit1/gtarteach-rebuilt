<script setup>
import { onMounted, ref } from 'vue'

const majorScaleIntervals = [
  { degree: 1, interval: 'Perfect Unison', semitones: 0 },
  { degree: 2, interval: 'Major 2nd', semitones: 2 },
  { degree: 3, interval: 'Major 3rd', semitones: 4 },
  { degree: 4, interval: 'Perfect 4th', semitones: 5 },
  { degree: 5, interval: 'Perfect 5th', semitones: 7 },
  { degree: 6, interval: 'Major 6th', semitones: 9 },
  { degree: 7, interval: 'Major 7th', semitones: 11 },
]

const minorScaleIntervals = [
  { degree: 1, interval: 'Perfect Unison', semitones: 0 },
  { degree: 2, interval: 'Major 2nd', semitones: 2 },
  { degree: 3, interval: 'Minor 3rd', semitones: 3 },
  { degree: 4, interval: 'Perfect 4th', semitones: 5 },
  { degree: 5, interval: 'Perfect 5th', semitones: 7 },
  { degree: 6, interval: 'Minor 6th', semitones: 8 },
  { degree: 7, interval: 'Minor 7th', semitones: 10 },
]
// const questionTypes = [
//     "Identifying an interval by number",
//     "Identifying the note by an interval",
//     "Identifying the interval within a scale"
// ]

const modes = [
  'major',
  'minor',
]
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const chosenMode = ref('')
const chosenRoot = ref('')
const chosenScale = ref([''])
const chosenInterval = ref(1)
const userInterval = ref('')
const feedback = ref('')
const score = ref({ correct: 0, total: 0 })
function addSemitones(note, semitones) {
  const index = notes.indexOf(note)
  return notes[(index + semitones) % notes.length]
}

function generateMajorScale(root) {
  return majorScaleIntervals.map(step => ({
    degree: step.degree,
    note: addSemitones(root, step.semitones),
    interval: step.interval,
  }))
}
function generateMinorScale(root) {
  return minorScaleIntervals.map(step => ({
    degree: step.degree,
    note: addSemitones(root, step.semitones),
    interval: step.interval,
  }))
}

function generateQuestion() {
  const randomRoot = notes[Math.floor(Math.random() * notes.length)]
  const randomMode = modes[Math.floor(Math.random() * modes.length)]
  const randomInterval = Math.floor(Math.random() * 6 + 1)
  chosenMode.value = randomMode
  chosenRoot.value = randomRoot
  chosenInterval.value = randomInterval
  switch (chosenMode.value) {
    case 'major':
      chosenScale.value = generateMajorScale(chosenRoot.value)
      break

    case 'minor':
      chosenScale.value = generateMinorScale(chosenRoot.value)
      break
  }

  // console.log(chosenScale.value, chosenRoot.value, chosenMode.value, randomInterval, chosenScale.value[chosenInterval.value]);
}
function handleAnswer() {
  const answer = userInterval.value.trim()
  const correctNote = chosenScale.value[chosenInterval.value]?.note

  const isCorrect = answer.toUpperCase() === correctNote.toUpperCase()

  score.value = {
    correct: score.value.correct + (isCorrect ? 1 : 0),
    total: score.value.total + 1,
  }

  feedback.value = isCorrect
    ? 'Correct!'
    : `Incorrect — correct answer: ${correctNote}`
}

function handleNext() {
  generateQuestion()
}
onMounted(() => {
  generateQuestion()
})
</script>

<template>
  <main class="h-screen flex flex-col items-center justify-center text-center">
    <div class="max-w-lg w-full p-4">
      <h2 class="mb-4 text-xl">
        What is the {{ chosenInterval }} interval of the {{ chosenRoot }} {{ chosenMode }} scale?
      </h2>

      <div class="mx-auto w-3/5 border-2 border-blue-400 rounded-lg p-2 dark:border-gray-200">
        <input
          v-model="userInterval"
          placeholder="Format: E"
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
        @click="handleNext"
      >
        Next Question
      </button>
    </div>
  </main>
</template>
