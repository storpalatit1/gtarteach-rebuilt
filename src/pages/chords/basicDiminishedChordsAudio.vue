<script setup lang="ts">
import * as Tone from 'tone'
import { ref } from 'vue'

// --------------------------------------------------------------------
// 🎹 Tone.js setup — using Sampler with Salamander samples
// --------------------------------------------------------------------

const sampler = new Tone.Sampler({
  urls: {
    'A2': 'A2.mp3',
    'C3': 'C3.mp3',
    'D#3': 'Ds3.mp3', // correct: use sharps for valid Tone.js note keys
    'F#3': 'Fs3.mp3',
  },
  baseUrl: 'https://tonejs.github.io/audio/salamander/',
  release: 1,
}).toDestination()

const isLoaded = ref(false)

// Wait for all Tone.js buffers (samples) to load
Tone.loaded().then(() => {
  isLoaded.value = true
  generateQuestion()
})

// --------------------------------------------------------------------
// 🎸 Open-position guitar chords (realistic voicings)
// --------------------------------------------------------------------
const openDiminishedChords: Record<string, string[]> = {
  // -------------------------
  // Half-diminished (m7♭5)
  // -------------------------
  Bm7b5: ['B2', 'F#3', 'A3', 'D4'],
  Em7b5: ['E2', 'Bb2', 'D3', 'G3'],
  Am7b5: ['A2', 'Eb3', 'G3', 'C4'],
  // -------------------------
  // Fully diminished (dim7)
  // -------------------------
  Bdim7: ['B2', 'D3', 'F3', 'Ab3'],

  Edim7: ['E2', 'G2', 'Bb2', 'Db3'],
  Adim7: ['A2', 'C3', 'Eb3', 'Gb3'],

}

// --------------------------------------------------------------------
// 🧠 App State
// --------------------------------------------------------------------
const currentChord = ref<{ name: string, notes: string[] } | null>(null)
const options = ref<string[]>([])
const selectedAnswer = ref<string | null>(null)
const score = ref({ correct: 0, total: 0 })

// Utility: shuffle helper
const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5)

// 🔊 Chord playback + quiz logic
function getRandomOpenChord() {
  const chordNames = Object.keys(openDiminishedChords)
  const randomChord = chordNames[Math.floor(Math.random() * chordNames.length)]
  const notes = openDiminishedChords[randomChord]
  return { name: randomChord, notes }
}

async function playChord(notes: string[]) {
  if (!isLoaded.value) {
    console.warn('Sampler not loaded yet!')
    return
  }
  await Tone.start() // ensures audio context is resumed on user gesture
  sampler.triggerAttackRelease(notes, '2n')
}

function generateQuestion() {
  const chordNames = Object.keys(openDiminishedChords)

  // Pick a random correct chord
  const correctChord = getRandomOpenChord()

  // Choose 3 wrong chords
  const wrongChords = shuffle(
    chordNames.filter(name => name !== correctChord.name),
  ).slice(0, 3)

  const allOptions = shuffle([correctChord.name, ...wrongChords])

  currentChord.value = correctChord
  options.value = allOptions
  selectedAnswer.value = null

  playChord(correctChord.notes)
  // console.log(currentChord.value)
}

function handleAnswer(answer: string) {
  selectedAnswer.value = answer
  const isCorrect = answer === currentChord.value?.name
  score.value = {
    correct: score.value.correct + (isCorrect ? 1 : 0),
    total: score.value.total + 1,
  }
}

function handleNext() {
  generateQuestion()
}

// onMounted(() => {
//   console.log("🔊 Waiting for Tone.js sampler to load...")
// })
</script>

<template>
  <main class="mx-auto h-screen max-w-3xl flex flex-col items-center justify-center text-center">
    <h1 class="mb-4 text-2xl font-bold">
      🎸 Open Chord Recognition Test
    </h1>

    <div class="max-w-md w-full border rounded-xl p-6">
      <div v-if="!isLoaded" class="mb-3 text-sm text-gray-500">
        ⏳ Loading sounds... please wait
      </div>

      <template v-else>
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
              'bg-green-500 text-white': selectedAnswer === option && option === currentChord?.name,
              'bg-red-500 text-white': selectedAnswer === option && option !== currentChord?.name,
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
            <strong>{{ currentChord?.name }}</strong>
          </p>
          <button
            class="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
            @click="handleNext"
          >
            Next
          </button>
        </div>
      </template>
    </div>
  </main>
</template>
