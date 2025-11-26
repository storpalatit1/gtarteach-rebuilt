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
const dorianIntervals = [
  { degree: 1, interval: 'Perfect Unison', semitones: 0 },
  { degree: 2, interval: 'Major 2nd', semitones: 2 },
  { degree: 3, interval: 'Minor 3rd', semitones: 3 },
  { degree: 4, interval: 'Perfect 4th', semitones: 5 },
  { degree: 5, interval: 'Perfect 5th', semitones: 7 },
  { degree: 6, interval: 'Major 6th', semitones: 9 },
  { degree: 7, interval: 'Minor 7th', semitones: 10 },
]

const phrygianIntervals = [
  { degree: 1, interval: 'Perfect Unison', semitones: 0 },
  { degree: 2, interval: 'Minor 2nd', semitones: 1 },
  { degree: 3, interval: 'Minor 3rd', semitones: 3 },
  { degree: 4, interval: 'Perfect 4th', semitones: 5 },
  { degree: 5, interval: 'Perfect 5th', semitones: 7 },
  { degree: 6, interval: 'Minor 6th', semitones: 8 },
  { degree: 7, interval: 'Minor 7th', semitones: 10 },
]

const lydianIntervals = [
  { degree: 1, interval: 'Perfect Unison', semitones: 0 },
  { degree: 2, interval: 'Major 2nd', semitones: 2 },
  { degree: 3, interval: 'Major 3rd', semitones: 4 },
  { degree: 4, interval: 'Augmented 4th', semitones: 6 },
  { degree: 5, interval: 'Perfect 5th', semitones: 7 },
  { degree: 6, interval: 'Major 6th', semitones: 9 },
  { degree: 7, interval: 'Major 7th', semitones: 11 },
]

const mixolydianIntervals = [
  { degree: 1, interval: 'Perfect Unison', semitones: 0 },
  { degree: 2, interval: 'Major 2nd', semitones: 2 },
  { degree: 3, interval: 'Major 3rd', semitones: 4 },
  { degree: 4, interval: 'Perfect 4th', semitones: 5 },
  { degree: 5, interval: 'Perfect 5th', semitones: 7 },
  { degree: 6, interval: 'Major 6th', semitones: 9 },
  { degree: 7, interval: 'Minor 7th', semitones: 10 },
]

const locrianIntervals = [
  { degree: 1, interval: 'Perfect Unison', semitones: 0 },
  { degree: 2, interval: 'Minor 2nd', semitones: 1 },
  { degree: 3, interval: 'Minor 3rd', semitones: 3 },
  { degree: 4, interval: 'Perfect 4th', semitones: 5 },
  { degree: 5, interval: 'Diminished 5th', semitones: 6 },
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
  'phrygian',
  'dorian',
  'locrian',
  'lydian',
  'mixolydian',
]
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const chosenMode = ref('')
const chosenRoot = ref('')
const chosenScale = ref([''])
const chosenInterval = ref(1)
const addition = ref('st')
const userInterval = ref('')
const feedback = ref('')
const score = ref({ correct: 0, total: 0 })
const goTo = ref(false)
const isCorrect = ref(null)
function addSemitones(note, semitones) {
  const index = notes.indexOf(note)
  return notes[(index + semitones) % notes.length]
}

function generateScale(root, mode) {
  return mode.map(step => ({
    degree: step.degree,
    note: addSemitones(root, step.semitones),
    interval: step.interval,
  }))
}

function additionToNumber() {
  if (chosenInterval.value === 1) {
    addition.value = 'st'
  }
  else if (chosenInterval.value === 2) {
    addition.value = 'nd'
  }
  else if (chosenInterval.value === 3) {
    addition.value = 'rd'
  }
  else if (chosenInterval.value === 4 || chosenInterval.value === 5 || chosenInterval.value === 6 || chosenInterval.value === 7) {
    addition.value = 'th'
  }
}

function generateQuestion() {
  feedback.value = ''
  const randomRoot = notes[Math.floor(Math.random() * notes.length)]
  const randomMode = modes[Math.floor(Math.random() * modes.length)]
  const randomInterval = Math.floor(Math.random() * 6 + 1)
  chosenMode.value = randomMode
  chosenRoot.value = randomRoot
  chosenInterval.value = randomInterval
  additionToNumber()
  switch (chosenMode.value) {
    case 'major':
      chosenScale.value = generateScale(chosenRoot.value, majorScaleIntervals)
      break

    case 'minor':
      chosenScale.value = generateScale(chosenRoot.value, minorScaleIntervals)
      break
    case 'dorian':
      chosenScale.value = generateScale(chosenRoot.value, dorianIntervals)
      break
    case 'lydian':
      chosenScale.value = generateScale(chosenRoot.value, lydianIntervals)
      break
    case 'mixolydian':
      chosenScale.value = generateScale(chosenRoot.value, mixolydianIntervals)
      break
    case 'locrian':
      chosenScale.value = generateScale(chosenRoot.value, locrianIntervals)
      break
    case 'phrygian':
      chosenScale.value = generateScale(chosenRoot.value, phrygianIntervals)
      break
  }

  // console.log(chosenScale.value, chosenRoot.value, chosenMode.value, randomInterval, chosenScale.value[chosenInterval.value]);
}
function handleAnswer() {
  const answer = userInterval.value.trim()
  const correctNote = chosenScale.value[chosenInterval.value]?.note

  isCorrect.value = answer.toUpperCase() === correctNote.toUpperCase()

  score.value = {
    correct: score.value.correct + (isCorrect.value ? 1 : 0),
    total: score.value.total + 1,
  }

  feedback.value = isCorrect.value
    ? 'Correct!'
    : `Incorrect — correct answer: ${correctNote}`
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
  <main v-if="goTo === false" class="h-screen flex flex-col items-center justify-center text-center">
    <div class="max-w-lg w-full p-4">
      <h2 class="mb-4 text-xl">
        What is the {{ chosenInterval }}{{ addition }} next interval of the {{ chosenRoot }} {{ chosenMode }} scale? (Counting starts from the note after the root)
      </h2>

      <div class="mx-auto w-3/5 border-2 border-blue-400 rounded-lg p-2 dark:border-gray-200">
        <input
          v-model="userInterval"
          placeholder="Format: E"
          class="w-full text-center outline-none"
        >
      </div>

      <button
        class="mr-2 mt-4 rounded bg-blue-500 px-4 py-2 text-white dark:bg-gray-300 hover:bg-blue-600 dark:text-black dark:hover:bg-gray-400"
        :disabled="feedback !== ''"
        @click="handleAnswer"
      >
        Submit
      </button>

      <button
        class="rounded-lg bg-blue-400 px-4 py-2 text-white dark:bg-gray-600 hover:bg-blue-600 disabled:opacity-100 dark:hover:bg-gray-300"
        @click="handleNext"
      >
        Next
      </button>
      <p v-if="feedback !== ''" class="mt-4 font-semibold" :class="feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'">
        {{ feedback }}
      </p>
      <div class="mt-2 py-2 text-sm text-size-2xl text-gray-600 dark:text-gray-300">
        Score: {{ score.correct }} correct out of {{ score.total }}
      </div>
    </div>
  </main>
  <main v-else class="h-screen flex flex-col items-center justify-center text-center">
    <div py-2 />
    <Progression difficulty="Advanced" :is-correct="isCorrect" />
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
