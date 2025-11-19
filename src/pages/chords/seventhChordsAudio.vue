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
const seventhChords: Record<string, string[]> = {
  // --- Major 7th ---
  Cmaj7: ['C3', 'E3', 'G3', 'B3', 'E4'], // x32000
  Amaj7: ['A2', 'E3', 'G#3', 'C#4', 'E4'], // x02120
  Dmaj7: ['D3', 'A3', 'C#4', 'F#4'], // xx0222
  Emaj7: ['E2', 'B2', 'E3', 'G#3', 'D#4', 'E4'], // 021100 (corrected open voicing)
  Gmaj7: ['G2', 'B2', 'D3', 'F#3', 'B3', 'G4'], // 320002

  // --- Dominant 7th ---
  C7: ['C3', 'E3', 'G3', 'Bb3', 'C4', 'E4'], // x32310 (corrected no high C5/E5)
  A7: ['A2', 'E3', 'G3', 'C#4', 'E4'], // x02020
  D7: ['D3', 'A3', 'C4', 'F#4'], // xx0212
  E7: ['E2', 'B2', 'E3', 'G#3', 'D4', 'E4'], // 020100
  G7: ['G2', 'B2', 'D3', 'F3', 'B3', 'G4'], // 320001

  // --- Minor 7th ---
  Am7: ['A2', 'E3', 'G3', 'C4', 'E4'], // x02010
  Dm7: ['D3', 'A3', 'C4', 'F4'], // xx0211
  Em7: ['E2', 'B2', 'D3', 'G3', 'B3', 'E4'], // 020000

  // Real open-position-compatible Gm7 (your version was impossible)
  Gm7: ['G2', 'D3', 'F3', 'Bb3', 'D4', 'G4'], // 353333 → notes only
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
  const chordNames = Object.keys(seventhChords)
  const randomChord = chordNames[Math.floor(Math.random() * chordNames.length)]
  const notes = seventhChords[randomChord]
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
  const chordNames = Object.keys(seventhChords)

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
    <h1 class="mb-4 flex items-center gap-2 text-2xl font-bold">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m11.9 12.1l4.514-4.514M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4zM6 16l2 2m.23-8.15A3 3 0 0 1 11 8a5 5 0 0 1 5 5a3 3 0 0 1-1.85 2.77l-.92.38A2 2 0 0 0 12 18a4 4 0 0 1-4 4a6 6 0 0 1-6-6a4 4 0 0 1 4-4a2 2 0 0 0 1.85-1.23z" />
      </svg>
      Open Chord Recognition Test
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
            <div class="flex items-center gap-2 font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                  <rect width="16" height="20" x="4" y="2" rx="2" />
                  <path d="M12 6h.01" />
                  <circle cx="12" cy="14" r="4" />
                  <path d="M12 14h.01" />
                </g>
              </svg>
              Play again
            </div>
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
