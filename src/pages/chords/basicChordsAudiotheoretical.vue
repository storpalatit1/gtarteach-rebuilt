<script setup lang="ts">
import * as Tone from 'tone'
import { onMounted, ref } from 'vue'
import majorChords from '~/../data/majorchords.js'
import minorchords from '~/../data/minorchords.js'

// --------------------------------------------------------------------
// Tone.js setup
// --------------------------------------------------------------------
const synth = new Tone.PolySynth(Tone.FMSynth).toDestination()

const noteNames = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]

const chordFormulas: Record<string, number[]> = {
  Major: [0, 4, 7],
  Minor: [0, 3, 7],
}

// --------------------------------------------------------------------
// Combine all chords from external files
// --------------------------------------------------------------------
const chords = majorChords.concat(minorchords)
const currentChord = ref<any>(null)
const options = ref<string[]>([])
const selectedAnswer = ref<string | null>(null)
const score = ref({ correct: 0, total: 0 })

// Utility: shuffle an array
const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5)

// --------------------------------------------------------------------
// Random Chord Generator + Playback
// --------------------------------------------------------------------
function getRandomChord() {
  const rootIndex = Math.floor(Math.random() * noteNames.length)
  const root = noteNames[rootIndex]
  const chordTypes = Object.keys(chordFormulas)
  const type = chordTypes[Math.floor(Math.random() * chordTypes.length)]
  const formula = chordFormulas[type]

  // Generate note names
  const baseOctave = 3
  const notes = formula.map((semitone) => {
    const index = (rootIndex + semitone) % 12
    const octaveShift = Math.floor((rootIndex + semitone) / 12)
    return `${noteNames[index]}${baseOctave + octaveShift}`
  })

  return { name: `${root} ${type}`, root, type, notes }
}

async function playChord(notes: string[]) {
  await Tone.start()
  synth.triggerAttackRelease(notes, '2n')
}

// --------------------------------------------------------------------
// Quiz logic
// --------------------------------------------------------------------
function generateQuestion() {
  // pick a random correct chord
  const correctChord = getRandomChord()

  // choose 3 random wrong chords from dataset for options
  const wrongChords = shuffle(chords.filter(c => c.name !== correctChord.name)).slice(0, 3)
  const allOptions = shuffle([correctChord.name, ...wrongChords.map(c => c.name)])

  currentChord.value = correctChord
  options.value = allOptions
  selectedAnswer.value = null

  // play the chord
  playChord(correctChord.notes)
}

function handleAnswer(answer: string) {
  selectedAnswer.value = answer
  const isCorrect = answer === currentChord.value.name
  score.value = {
    correct: score.value.correct + (isCorrect ? 1 : 0),
    total: score.value.total + 1,
  }
}

function handleNext() {
  generateQuestion()
}

onMounted(() => {
  generateQuestion()
})
</script>

<template>
  <main class="mx-auto h-screen max-w-3xl flex flex-col items-center justify-center text-center">
    <h1 class="mb-4 text-2xl font-bold">
      🎵 Chord Recognition Test
    </h1>

    <div class="max-w-md w-full border rounded-xl p-6">
      <h4 class="mb-3 text-lg font-semibold">
        What chord is this?
      </h4>

      <div class="mb-3 flex justify-center">
        <button
          class="border border-blue-400 rounded-md bg-blue-400 px-4 py-2 dark:border-gray-400 dark:bg-transparent"
          @click="playChord(currentChord?.notes || [])"
        >
          ▶️ Play Again
        </button>
      </div>

      <div class="grid grid-cols-2 mb-4 gap-3">
        <button
          v-for="option in options"
          :key="option"
          class="border border-blue-400 rounded-lg px-2 py-2 transition dark:border-gray-300"
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

      <div class="text-sm text-gray-600 dark:text-gray-300">
        Score: <strong>{{ score.correct }}</strong> / {{ score.total }}
      </div>

      <div v-if="selectedAnswer" class="mt-3">
        <p class="text-sm">
          The correct answer was:
          <strong>{{ currentChord.name }}</strong>
        </p>
        <button class="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600" @click="handleNext">
          Next
        </button>
      </div>
    </div>
  </main>
</template>
