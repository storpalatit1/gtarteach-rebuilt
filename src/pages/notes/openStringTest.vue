<script setup>
import { ref } from 'vue'
import TestWindow from '~/components/TestWindow.vue'
import Fretboard from '../notes/fretboard.vue'

const selectedAnswer = reactive({
  name: null,
  octave: null,
  string: null,
})
const answeredPage = ref(false)

function hideFretboard() {
  answeredPage.value = true
  // console.log(answeredPage.value)
}
function reappearFretboard() {
  answeredPage.value = false
}

function selectAnswer(note) {
  selectedAnswer.name = note.name
  selectedAnswer.octave = note.octave
  selectedAnswer.string = note.gString
  // console.log(selectedAnswer);
}
</script>

<template>
  <div v-if="answeredPage" />
  <div v-else>
    <Fretboard @note-pressed="selectAnswer" />
  </div>
  <TestWindow type="notes" test="test1" :selected-answer="selectedAnswer" @answer-submited="hideFretboard" @question-rerolled="reappearFretboard" />
</template>
