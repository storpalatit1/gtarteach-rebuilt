<script setup>
import data from '~/../data/questions.json' 
import { ref } from 'vue'
import AudioPlayer from '~/components/AudioPlayer.vue'
import { NAVIGATION_RESULTS_KEY } from 'unplugin-vue-router/runtime'

const emit = defineEmits(['answer-submited'],['question-rerolled'])

const playerRef = ref()
// Choose which section to draw from
const props = defineProps({
  type: {
    type: String,
    required: true
  },
 test: {
    type: [String, Array],
    required: true
  },
  selectedAnswer:{
    type : Object,
    required:false
  },
  modifiers:{
    type: String,
    required:false
  }
})
var answered = ref(null);
var isCorrect = null;
var nextQuestionFlag = false;


const currentQuestion = ref(null);
function setFlag()
{
  if(!nextQuestionFlag)
{
  nextQuestionFlag=true;
}
}function getRandomQuestion() {
  if (answered.value && nextQuestionFlag) {
    answered.value = null
    isCorrect = null
    nextQuestionFlag = false
    emit('question-rerolled')
  }

  let questions = []

  if (typeof props.test === 'string') {
    const set = data.questions?.[props.type]?.[props.test]
    if (Array.isArray(set)) questions = set
  }


  else if (Array.isArray(props.test)) {
    for (const testName of props.test) {
      const set = data.questions?.[props.type]?.[testName]
      if (Array.isArray(set)) questions.push(...set)
    }
  }

  if (questions.length === 0) {
    console.warn('No questions found for:', props.test)
    return
  }

  const randomIndex = Math.floor(Math.random() * questions.length)
  currentQuestion.value = questions[randomIndex]
  console.log('Selected:', currentQuestion.value)
  nextQuestionFlag = false
}
console.log(props.modifiers);
function checkAnswerNote(){
  answered.value = true;
    console.log(props.selectedAnswer, currentQuestion.value);
    console.log(props.selectedAnswer.name, props.selectedAnswer.string, currentQuestion.value.answer, currentQuestion.value.gString);
    if(props.modifiers==='free')
    {
       console.log("Modifier");
      if(props.selectedAnswer.name==currentQuestion.value.answer)
    {
      console.log("Correct");
      isCorrect = true;
    }
    else
    {
      console.log("Incorrect");
      isCorrect = false;
    }
    }
    else if(props.selectedAnswer.name==currentQuestion.value.answer && props.selectedAnswer.string == currentQuestion.value.gString)
    {
      console.log("Correct");
      isCorrect = true;
    }
    else
    {
       console.log("Incorrect");  
       isCorrect = false;
    }
    emit('answer-submited', isCorrect);
}

function checkAnswer(userAnswer, currentQuestion) {

  answered.value = true;
    console.log(userAnswer, currentQuestion.answer);
    if(currentQuestion.answer == userAnswer)
    {
        console.log("Correct");
        isCorrect = true;
    }
    else
    {
        console.log("Incorrect");
        isCorrect = false;
    }
    getRandomQuestion();
}

watch(() => [props.type, props.test], () => {
  getRandomQuestion()
})

onMounted(() => {
  getRandomQuestion()
})
</script>

<template>
  <div v-if="!answered">
  <div v-if="props.type==='graphic'">
    
    <h2>Random {{ props.type }} Question</h2>
    
    <div v-if="currentQuestion">
      <p>{{ currentQuestion.question }}</p>
      <img
        v-if="currentQuestion.image"
        :src="currentQuestion.image"
        class="w-1/4"
      />
      <ul>
        <li
          v-for="option in currentQuestion.options"
          :key="option"
          class="cursor-pointer hover:underline"
         @click="checkAnswer(option, currentQuestion)">
          {{ option }}
        </li>
      </ul>
    </div>

    <button
      @click="getRandomQuestion"
      class="mt-4 px-4 py-2 bg-gray-400 dark:bg-[#484848] text-white hover:bg-gray-600"
    >
      Reroll question
    </button>
  </div>
  <div v-else-if="props.type==='audio'">

   <h2>Random {{ props.type }} Question</h2>    
    
    <div v-if="currentQuestion">
      <p>{{ currentQuestion.question }}</p>
      <img v-if="currentQuestion.audio" src="/ic-baseline-speaker.svg" alt="Speaker Icon" class="w-1/4 rounded-lg" fill="#000000" d="M10 10h4v4h-4z"   />
        <audio
        v-if="currentQuestion.audio"
        :src="currentQuestion.audio"
        controls
      ></audio>
 
      <ul>
        <li
          v-for="option in currentQuestion.options"
          :key="option"
          class="cursor-pointer hover:underline"
         @click="checkAnswer(option, currentQuestion)" >
          {{ option }}
        </li>
      </ul>
    </div>

    <button
      @click="getRandomQuestion"
      class="mt-4 px-4 py-2 bg-gray-400 dark:bg-[#484848] text-white hover:bg-gray-600"
    >
      Reroll question
    </button>
  </div>
 <div v-else-if="props.type === 'notes'">
  <div v-if="currentQuestion">
    <div py-2/>
    <p v-if="currentQuestion.answer == 'E' || currentQuestion.answer == 'E2' && currentQuestion.gString==='1' || currentQuestion.gString==='6'">
        Find {{ currentQuestion.answer }} on the {{ currentQuestion.gString }} string
    </p>
    <p v-else>
       Find {{ currentQuestion.answer }}  
    </p>
    
    <div py-2/>
    <button
      @click="checkAnswerNote()"
      class="mt-4 px-4 py-2 bg-gray-400 dark:bg-[#484848] text-white hover:bg-gray-600"
    >
      Submit your answer
    </button>
  </div>
  <div v-else>
    Loading question...
  </div>
</div>
  </div>  
  <div v-else>
      <div v-if="isCorrect">CORRECT</div>
      <div v-else>INCORRECT</div> 
<button
     @click="() => { setFlag(); getRandomQuestion();}"
      class="mt-4 px-4 py-2 bg-gray-400 dark:bg-[#484848] text-white hover:bg-gray-600"
    >
      Next question
    </button>
      
  </div>
</template>