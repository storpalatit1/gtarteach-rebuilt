<script setup>
import Fretboard from '../notes/fretboard.vue'
import TestWindow from '~/components/TestWindow.vue' 
import { ref } from 'vue'
const selectedAnswer = reactive({
  name: null,
  octave: null,
  string: null,
})
var answeredPage = ref(false);

function hideFretboard()
{
    answeredPage.value = true;
    console.log(answeredPage.value);   
}
function reappearFretboard()
{
    answeredPage.value = false;
}


function selectAnswer(note)
{
    selectedAnswer.name = note.name;
    selectedAnswer.octave = note.octave;
    selectedAnswer.string = note.gString;
    // console.log(selectedAnswer); 
}

</script>

<template>
        <div v-if="answeredPage">
        </div>
        <div v-else>
        <Fretboard @note-pressed="selectAnswer" :modifiers="'blindfold'"></Fretboard>
        </div>
        <TestWindow :type="'notes'" :test="['test1', 'test2','test3','test4','test5']" :selectedAnswer="selectedAnswer" :modifiers="'free'" @answer-submited="hideFretboard" @question-rerolled="reappearFretboard"></TestWindow>
</template>