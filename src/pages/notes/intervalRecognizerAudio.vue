<script setup lang="ts">
import * as Tone from 'tone'
import { ref } from 'vue'

// --------------------------------------------------------------------
// 🎵 Tone.js setup — Sampler with Salamander piano samples
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
// 🎼 Interval Data
// --------------------------------------------------------------------
const intervals = [
  { name: 'Minor 2nd', semitones: 1 },
  { name: 'Major 2nd', semitones: 2 },
  { name: 'Minor 3rd', semitones: 3 },
  { name: 'Major 3rd', semitones: 4 },
  { name: 'Perfect 4th', semitones: 5 },
  { name: 'Tritone', semitones: 6 },
  { name: 'Perfect 5th', semitones: 7 },
  { name: 'Minor 6th', semitones: 8 },
  { name: 'Major 6th', semitones: 9 },
  { name: 'Minor 7th', semitones: 10 },
  { name: 'Major 7th', semitones: 11 },
  { name: 'Octave', semitones: 12 },
]

// starting note pool
const notePool = ['A2', 'C3', 'D#3', 'F#3']

// --------------------------------------------------------------------
// 🧠 App State
// --------------------------------------------------------------------
const currentInterval = ref<{ name: string, semitones: number, notes: string[] } | null>(null)
const options = ref<string[]>([])
const selectedAnswer = ref<string | null>(null)
const quizMode = ref<'melodic' | 'harmonic'>('melodic')
const score = ref({ correct: 0, total: 0 })
const isCorrect = ref<boolean | null>(null)
const goTo = ref(false)
// computed version of the correct notes
const correctIntervalString = computed(() => {
  return currentInterval.value?.name || ''
})

// Utility
const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5)

function getRandomInterval() {
  return intervals[Math.floor(Math.random() * intervals.length)]
}

function transpose(note: string, semitones: number) {
  const midi = Tone.Frequency(note).toMidi()
  return Tone.Frequency(midi + semitones, 'midi').toNote()
}

async function playInterval(notes: string[]) {
  if (!isLoaded.value)
    return

  await Tone.start()

  if (quizMode.value === 'harmonic') {
    sampler.triggerAttackRelease(notes, '2n')
  }
  else {
    sampler.triggerAttackRelease(notes[0], '4n')
    setTimeout(() => {
      sampler.triggerAttackRelease(notes[1], '4n')
    }, 400)
  }
}

function generateQuestion() {
  isCorrect.value = null
  const interval = getRandomInterval()

  const root = notePool[Math.floor(Math.random() * notePool.length)]
  const upper = transpose(root, interval.semitones)

  const notes = [root, upper]

  const wrongAnswers = shuffle(
    intervals.filter(i => i.name !== interval.name),
  ).slice(0, 3)

  options.value = shuffle([interval.name, ...wrongAnswers.map(i => i.name)])
  currentInterval.value = { ...interval, notes }
  selectedAnswer.value = null

  playInterval(notes)
}

function handleAnswer(answer: string) {
  selectedAnswer.value = answer
  isCorrect.value = answer === currentInterval.value?.name

  score.value = {
    correct: score.value.correct + (isCorrect.value ? 1 : 0),
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
</script>

<template>
  <main v-if="goTo === false" class="mx-auto h-screen max-w-3xl flex flex-col items-center justify-center text-center">
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
      <span>Interval Recognizer</span>
    </div>

    <div class="max-w-md w-full border rounded-xl p-6">
      <div v-if="!isLoaded" class="mb-3 text-sm text-gray-500">
        ⏳ Loading sounds... please wait
      </div>

      <template v-else>
        <!-- Mode Selector -->
        <div class="mb-4">
          <label class="mr-2 font-semibold">Mode:</label>
          <select v-model="quizMode" class="border rounded px-2 py-1">
            <option value="melodic">
              Melodic (one after another)
            </option>
            <option value="harmonic">
              Harmonic (played together)
            </option>
          </select>
        </div>

        <h4 class="mb-3 text-lg font-semibold">
          What interval is this?
        </h4>

        <div class="mb-3 flex justify-center">
          <button
            class="border border-blue-400 rounded-md bg-blue-400 px-4 py-2 dark:border-gray-400 dark:bg-transparent"
            @click="playInterval(currentInterval?.notes || [])"
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
            class="border border-blue-400 rounded-lg px-2 py-2 transition dark:border-gray-200"
            :class="{
              'bg-green-500 text-white': selectedAnswer === option && option === currentInterval?.name,
              'bg-red-500 text-white': selectedAnswer === option && option !== currentInterval?.name,
              'hover:bg-gray-100 dark:hover:bg-gray-800': !selectedAnswer,
            }"
            :disabled="!!selectedAnswer"
            @click="handleAnswer(option)"
          >
            {{ option }}
          </button>
        </div>

        <div class="mt-2 text-sm text-size-2xl text-gray-600 dark:text-gray-300">
          Score: {{ score.correct }} correct out of {{ score.total }}
        </div>

        <div v-if="selectedAnswer" class="mt-3">
          <p class="text-sm">
            The correct answer was:
            <strong>{{ currentInterval?.name }}</strong>
          </p>
          <button
            class="mt-1 rounded-lg bg-blue-400 px-4 py-2 text-white dark:bg-gray-600 hover:bg-blue-600 disabled:opacity-100 dark:hover:bg-gray-300"

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
    <Progression difficulty="Advanced" :is-correct="isCorrect" :correct-answer="correctIntervalString" />
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
