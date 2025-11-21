<script setup lang="ts">
import * as Tone from 'tone'
import { ref } from 'vue'

// --------------------------------------------------------------------
// 🎵 Tone.js Sampler — Salamander Piano
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
// 🎵 Note Recognition Quiz
// --------------------------------------------------------------------
// const notePool = ['A2', 'C3', 'D#3', 'F#3']
const notes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']
const currentNote = ref<string | null>(null)
const options = ref<string[]>([])
const selectedAnswer = ref<string | null>(null)
const quizMode = ref<'melodic' | 'harmonic'>('melodic') // melodic = play once
const score = ref({ correct: 0, total: 0 })

// --------------------------------------------------------------------
// 🔊 Audio Playback
// --------------------------------------------------------------------
async function playAudio(notes: string[]) {
  if (!isLoaded.value)
    return
  await Tone.start()

  if (quizMode.value === 'harmonic') {
    // play simultaneously
    sampler.triggerAttackRelease(notes, '2n')
  }
  else {
    // melodic (single note)
    sampler.triggerAttackRelease(notes[0], '2n')
  }
}

// --------------------------------------------------------------------
// 🎯 Generate Question
// --------------------------------------------------------------------
function generateQuestion() {
  const note = notes[Math.floor(Math.random() * notes.length)]

  currentNote.value = note
  selectedAnswer.value = null

  // Create random multiple-choice options
  const shuffled = [...notes].sort(() => Math.random() - 0.5)
  options.value = shuffled

  playAudio([note])
}

// --------------------------------------------------------------------
// 📝 Handle Answer
// --------------------------------------------------------------------
function handleAnswer(answer: string) {
  selectedAnswer.value = answer
  const isCorrect = answer === currentNote.value

  score.value = {
    correct: score.value.correct + (isCorrect ? 1 : 0),
    total: score.value.total + 1,
  }
}

function handleNext() {
  generateQuestion()
}
</script>

<template>
  <main class="mx-auto h-screen max-w-3xl flex flex-col items-center justify-center text-center">
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

    <div class="max-w-md w-full border rounded-xl p-6">
      <div v-if="!isLoaded" class="mb-3 text-sm text-gray-500">
        ⏳ Loading sounds... please wait
      </div>

      <template v-else>
        <!-- Mode Selector -->

        <h4 class="mb-3 text-lg font-semibold">
          What note is this?
        </h4>

        <div class="mb-3 flex justify-center">
          <button
            class="border border-blue-400 rounded-md bg-blue-400 px-4 py-2 text-white dark:border-gray-200 dark:bg-black"
            @click="playAudio([currentNote])"
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

        <!-- Options -->
        <div class="grid grid-cols-2 mb-4 gap-3">
          <button
            v-for="option in options"
            :key="option"
            class="border border-blue-400 rounded-lg px-2 py-2 transition dark:border-gray-200"
            :class="{
              'bg-green-500 text-white': selectedAnswer === option && option === currentNote,
              'bg-red-500 text-white': selectedAnswer === option && option !== currentNote,
              'hover:bg-gray-100': !selectedAnswer,
            }"
            :disabled="!!selectedAnswer"
            @click="handleAnswer(option)"
          >
            {{ option }}
          </button>
        </div>

        <!-- Score -->
        <div class="mt-2 text-sm text-size-2xl text-gray-600 dark:text-gray-300">
          Score: {{ score.correct }} correct out of {{ score.total }}
        </div>

        <!-- Next Button -->
        <div v-if="selectedAnswer" class="mt-3">
          <p class="text-sm">
            The correct answer was: <strong>{{ currentNote }}</strong>
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
