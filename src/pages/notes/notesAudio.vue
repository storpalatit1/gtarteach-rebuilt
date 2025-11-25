<script setup lang="ts">
import * as Tone from 'tone'
import { ref, watch } from 'vue'

// --------------------------------------------------------------------
// 🎵 Tone.js Sampler
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
// 🎵 Quiz State
// --------------------------------------------------------------------
const stringOpenNotes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']
const strings = 6
const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const currentNote = ref<string | null>(null)
const currentNoteRoot = ref('')
const selectedAnswer = ref<string | null>(null)
const quizMode = ref<'melodic' | 'harmonic'>('melodic')

const score = ref({ correct: 0, total: 0 })

const startFret = ref(0)
const endFret = ref(12)
const goTo = ref(false)
const userNote = ref('')
const correct = ref<boolean | null>(null)

// --------------------------------------------------------------------
// 🔊 Play Audio
// --------------------------------------------------------------------
async function playAudio(notes: string[]) {
  if (!isLoaded.value)
    return
  await Tone.start()

  if (quizMode.value === 'harmonic') {
    sampler.triggerAttackRelease(notes, '2n')
  }
  else {
    sampler.triggerAttackRelease(notes[0], '2n')
  }
}

// --------------------------------------------------------------------
// 🎵 Convert String + Fret → Note Name
// --------------------------------------------------------------------
function getNoteName(stringIndex: number, fretIndex: number): string {
  const openNote = stringOpenNotes[stringIndex - 1] // FIXED index
  const match = openNote.match(/([A-G]#?)(\d)/)

  if (!match)
    return 'N/A'

  const [, noteName, octaveStr] = match
  let octave = Number.parseInt(octaveStr)
  let semitone = noteNames.indexOf(noteName) + fretIndex

  while (semitone >= 12) {
    semitone -= 12
    octave++
  }

  return `${noteNames[semitone]}${octave}`
}

// --------------------------------------------------------------------
// 🎯 Generate Question
// --------------------------------------------------------------------
function generateQuestion() {
  correct.value = null

  const string = Math.floor(Math.random() * strings) + 1 // 1–6
  const fret
    = Math.floor(Math.random() * (endFret.value - startFret.value + 1))
      + startFret.value

  const note = getNoteName(string, fret)
  currentNote.value = note

  selectedAnswer.value = null
  userNote.value = ''
}

// --------------------------------------------------------------------
// 📝 Handle Answer
// --------------------------------------------------------------------
function handleAnswer() {
  selectedAnswer.value = userNote.value.trim()

  currentNoteRoot.value
    = currentNote.value?.replace(/\d+$/, '') ?? ''

  const user = userNote.value.trim().toUpperCase()
  const right = currentNoteRoot.value.toUpperCase()

  correct.value = user === right

  score.value = {
    correct: score.value.correct + (correct.value ? 1 : 0),
    total: score.value.total + 1,
  }
}

// Reset when fret range changes
watch(startFret, () => {
  score.value.correct = 0
  score.value.total = 0
  generateQuestion()
})

watch(endFret, () => {
  score.value.correct = 0
  score.value.total = 0
  generateQuestion()
})

function goToNext() {
  goTo.value = false
  generateQuestion()
}

// Go to next question
function handleNext() {
  goTo.value = true
}
</script>

<template>
  <main v-if="goTo === false" class="mx-auto h-screen max-w-3xl flex flex-col items-center justify-center text-center">
    <div class="flex items-center gap-2 text-xl font-semibold">
      <svg
        xmlns="http://www.w3.org/2000/svg" width="20" height="20"
        viewBox="0 0 24 24" class="text-blue-400 dark:text-gray-100"
      >
        <path
          fill="currentColor"
          d="M12 3v10.55c-.59-.34-1.27-.55-2-.55c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4V7h4V3z"
        />
      </svg>
      <span>Note Recognizer</span>
    </div>

    <div class="max-w-md w-full p-6">
      <div v-if="!isLoaded" class="mb-3 text-sm text-gray-500">
        ⏳ Loading sounds... please wait
      </div>

      <template v-else>
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

        <!-- Fret selection -->
        Fretboard note selection range:
        <div class="mx-auto w-1/2 border border-blue-400 rounded-lg py-2 dark:border-white">
          <input v-model.number="startFret" type="number" min="0" max="12" class="w-16 text-center">
          <input v-model.number="endFret" type="number" min="0" max="12" class="w-16 text-center">
        </div>

        <div class="my-3 w-full border border-blue-400 rounded-md px-2 py-2 dark:border-white">
          <input
            v-model="userNote"
            placeholder="Format: F#"
            class="w-full bg-transparent outline-none"
          >
        </div>

        <button
          class="mr-1 rounded-md bg-blue-200 px-4 py-2 dark:border dark:border-gray-400 dark:bg-transparent"
          :disabled="userNote.length === 0 || correct !== null"
          @click="handleAnswer"
        >
          Submit
        </button>

        <button
          class="rounded-lg bg-blue-400 px-4 py-2 text-white dark:bg-gray-600 hover:bg-blue-600 dark:hover:bg-gray-300"
          @click="generateQuestion"
        >
          Reroll
        </button>

        <div class="mt-2 text-sm text-size-2xl text-gray-600 dark:text-gray-300">
          Score: {{ score.correct }} correct out of {{ score.total }}
        </div>

        <div v-if="selectedAnswer" class="mt-3">
          <p class="text-sm">
            <strong v-if="correct" class="text-green-500">Correct</strong>
            <strong v-else class="text-red-500">Incorrect</strong>
            – Correct answer: <strong>{{ currentNoteRoot }}</strong>
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
  <main v-else class="h-screen flex flex-col items-center justify-center text-center">
    <div py-2 />
    <Progression difficulty="Intermediate" :is-correct="userNote === currentNoteRoot" />
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
