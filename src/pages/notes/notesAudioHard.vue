<script setup lang="ts">
import * as Tone from 'tone'
import { ref } from 'vue'

// --------------------------------------------------------------------
// 🎵 Sampler
// --------------------------------------------------------------------
const sampler = new Tone.Sampler({
  urls: {
    'A2': 'A2.mp3',
    'C3': 'C3.mp3',
    'D#3': 'Ds3.mp3',
    'F#3': 'Fs3.mp3',
  },
  baseUrl: 'https://tonejs.github.io/audio/salamander/',
  release: 1,
}).toDestination()

const isLoaded = ref(false)

Tone.loaded().then(() => {
  isLoaded.value = true
  generateQuestion()
})

// --------------------------------------------------------------------
// 🎵 Quiz Data
// --------------------------------------------------------------------
const stringOpenNotes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']
const strings = 6

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

const currentNote = ref<string | null>(null)
const selectedAnswer = ref<string | null>(null)
const correct = ref<boolean | null>(null)

const score = ref({ correct: 0, total: 0 })
const startFret = 0
const endFret = 12

const userNote = ref('')

// --------------------------------------------------------------------
// 🔊 Audio
// --------------------------------------------------------------------
async function playAudio(notes: string[]) {
  if (!isLoaded.value)
    return
  await Tone.start()

  sampler.triggerAttackRelease(notes[0], '2n')
}

// --------------------------------------------------------------------
// 🎵 Guitar Note Calculation
// --------------------------------------------------------------------
function getNoteName(stringIndex: number, fretIndex: number): string {
  // stringIndex is 1–6, so map to 0–5
  const openNote = stringOpenNotes[stringIndex - 1]

  const match = openNote.match(/([A-G]#?)(\d)/)
  if (!match)
    return 'N/A'

  const [, name, octaveStr] = match
  let octave = Number.parseInt(octaveStr)
  let semitone = noteNames.indexOf(name) + fretIndex

  while (semitone >= 12) {
    semitone -= 12
    octave++
  }

  return `${noteNames[semitone]}${octave}`
}

// --------------------------------------------------------------------
// 🎯 New Question
// --------------------------------------------------------------------
function generateQuestion() {
  correct.value = null

  const string = Math.floor(Math.random() * strings) + 1
  const fret = Math.floor(Math.random() * (endFret - startFret + 1)) + startFret

  currentNote.value = getNoteName(string, fret)

  selectedAnswer.value = null
  userNote.value = ''
}

// --------------------------------------------------------------------
// 📝 Answer Handler
// --------------------------------------------------------------------
function handleAnswer() {
  selectedAnswer.value = userNote.value.trim()

  correct.value
    = selectedAnswer.value.toUpperCase() === currentNote.value?.toUpperCase()

  score.value = {
    correct: score.value.correct + (correct.value ? 1 : 0),
    total: score.value.total + 1,
  }
}

function handleNext() {
  generateQuestion()
}
</script>

<template>
  <main class="mx-auto h-screen max-w-3xl flex flex-col items-center justify-center text-center">
    <!-- Header -->
    <div class="flex items-center gap-2 text-xl font-semibold">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        class="text-blue-400 dark:text-gray-100"
      >
        <path
          fill="currentColor"
          d="M12 3v10.55c-.59-.34-1.27-.55-2-.55c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4V7h4V3z"
        />
      </svg>
      <span>Note Recognizer</span>
    </div>

    <!-- Main Card -->
    <div class="max-w-md w-full border rounded-xl p-6">
      <div v-if="!isLoaded" class="mb-3 text-sm text-gray-500">
        ⏳ Loading sounds... please wait
      </div>

      <template v-else>
        <h4 class="mb-3 text-lg font-semibold">
          What note is this?
        </h4>

        <!-- Play Button -->
        <div class="mb-3 flex justify-center">
          <button
            class="border border-blue-400 rounded-md bg-blue-400 px-4 py-2 dark:border-gray-400 dark:bg-transparent"
            @click="playAudio([currentNote])"
          >
            <div class="flex items-center gap-2 font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
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

        <!-- Input -->
        <div class="my-3 w-full border border-blue-400 rounded-md px-2 py-2 dark:border-white">
          <input
            v-model="userNote"
            placeholder="Format: F#3"
            class="w-full bg-transparent outline-none"
          >
        </div>

        <!-- Buttons -->
        <button
          class="mr-1 rounded-md bg-blue-200 px-4 py-2 dark:border dark:border-gray-400 dark:bg-transparent"
          :disabled="correct !== null"
          @click="handleAnswer"
        >
          Submit
        </button>

        <button
          class="rounded-lg bg-blue-400 px-4 py-2 text-white dark:bg-gray-600 hover:bg-blue-600 dark:hover:bg-gray-300"
          @click="generateQuestion()"
        >
          Reroll
        </button>

        <!-- Score -->
        <div class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Score: <strong>{{ score.correct }}</strong> / {{ score.total }}
        </div>

        <!-- Result + Next -->
        <div v-if="selectedAnswer" class="mt-3">
          <p class="text-sm">
            <strong v-if="correct" class="text-green-500">Correct</strong>
            <strong v-else class="text-red-500">Incorrect</strong>
            — Correct answer: <strong>{{ currentNote }}</strong>
          </p>

          <button
            class="mt-2 rounded-lg bg-blue-400 px-4 py-2 text-white dark:bg-gray-600 hover:bg-blue-600 dark:hover:bg-gray-300"
            @click="handleNext"
          >
            Next
          </button>
        </div>
      </template>
    </div>
  </main>
</template>
