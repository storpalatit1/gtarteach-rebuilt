<script setup lang="ts">
import * as Tone from 'tone'
import { onMounted, ref } from 'vue'
import Progression from '~/components/Progression.vue'

// --------------------------------------------------------------------
// 🎹 Tone.js Sampler
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

// --------------------------------------------------------------------
// 🎸 Open-position guitar chords (realistic voicings)
// --------------------------------------------------------------------
const openChords: Record<string, string[]> = {
  'C Major': ['C3', 'E3', 'G3', 'C4', 'E4'], // x32010
  'A Major': ['A2', 'E3', 'A3', 'C#4', 'E4'], // x02220
  'A Minor': ['A2', 'E3', 'A3', 'C4', 'E4'], // x02210
  'D Major': ['D3', 'A3', 'D4', 'F#4'], // xx0232
  'D Minor': ['D3', 'A3', 'D4', 'F4'], // xx0231
  'E Major': ['E2', 'B2', 'E3', 'G#3', 'B3', 'E4'], // 022100
  'E Minor': ['E2', 'B2', 'E3', 'G3', 'B3', 'E4'], // 022000
  'G Major': ['G2', 'B2', 'D3', 'G3', 'B3', 'G4'], // 320003
}

// --------------------------------------------------------------------
// 🧠 State
// --------------------------------------------------------------------
const currentChord = ref<{ name: string, notes: string[] } | null>(null)
const options = ref<string[]>([])
const selectedAnswer = ref<string | null>(null)
const score = ref({ correct: 0, total: 0 })
const goTo = ref(false)

const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5)

function getRandomOpenChord() {
  const keys = Object.keys(openChords)
  const name = keys[Math.floor(Math.random() * keys.length)]
  return { name, notes: openChords[name] }
}

async function playChord(notes: string[]) {
  await Tone.start()
  sampler.triggerAttackRelease(notes, '2n')
}

function generateQuestion() {
  selectedAnswer.value = null
  const correct = getRandomOpenChord()

  const wrong = shuffle(
    Object.keys(openChords).filter(c => c !== correct.name),
  ).slice(0, 3)

  currentChord.value = correct
  options.value = shuffle([correct.name, ...wrong])

  playChord(correct.notes)
}

function handleAnswer(option: string) {
  if (!currentChord.value)
    return
  selectedAnswer.value = option

  const isCorrect = option === currentChord.value.name
  score.value.total++
  if (isCorrect)
    score.value.correct++
}

function nextStage() {
  goTo.value = false
  generateQuestion()
}

onMounted(async () => {
  await Tone.loaded()
  isLoaded.value = true
  generateQuestion()
})
</script>

<template>
  <!-- QUIZ SCREEN -->
  <main
    v-if="!goTo"
    class="mx-auto h-screen max-w-3xl flex flex-col items-center justify-center text-center"
  >
    <h1 class="mb-4 flex items-center gap-2 text-2xl font-bold">
      Open Chord Recognition Test
    </h1>

    <div class="max-w-md w-full p-6">
      <div v-if="!isLoaded" class="mb-3 text-sm text-gray-500">
        Loading samples...
      </div>

      <template v-else>
        <h4 class="mb-3 text-lg font-semibold">
          What chord is this?
        </h4>

        <div class="mb-3 flex justify-center">
          <button
            class="border border-blue-400 rounded-md px-4 py-2 dark:border-gray-200"
            @click="playChord(currentChord?.notes || [])"
          >
            Play again
          </button>
        </div>

        <div class="grid grid-cols-2 mb-4 gap-3">
          <button
            v-for="option in options"
            :key="option"
            class="border rounded-lg px-2 py-2 transition"
            :class="{
              'bg-green-500 text-white':
                selectedAnswer && option === currentChord?.name,
              'bg-red-500 text-white':
                selectedAnswer === option && option !== currentChord?.name,
              'hover:bg-gray-100': !selectedAnswer,
            }"
            :disabled="!!selectedAnswer"
            @click="handleAnswer(option)"
          >
            {{ option }}
          </button>
        </div>

        <div class="text-sm text-gray-600">
          Score: {{ score.correct }} / {{ score.total }}
        </div>

        <div v-if="selectedAnswer" class="mt-3">
          <p>The correct answer was: <strong>{{ currentChord?.name }}</strong></p>
          <button
            class="mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white"
            @click="goTo = true"
          >
            Continue
          </button>
        </div>
      </template>
    </div>
  </main>

  <!-- RESULT / PROGRESSION SCREEN -->
  <main v-else class="h-screen flex flex-col items-center justify-center text-center">
    <Progression
      difficulty="Beginner"
      :is-correct="selectedAnswer === currentChord?.name"
    />

    <button
      class="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white"
      @click="nextStage"
    >
      Next
    </button>

    <div class="mt-2 text-sm text-gray-600">
      Score: {{ score.correct }} / {{ score.total }}
    </div>
  </main>
</template>
