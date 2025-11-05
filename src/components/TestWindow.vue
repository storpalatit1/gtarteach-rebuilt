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
  }
})
var answered = ref(null);
var isCorrect = null;
var nextQuestionFlag = false;
// This will hold the randomly selected question
const currentQuestion = ref(null);
function setFlag()
{
  if(!nextQuestionFlag)
{
  nextQuestionFlag=true;
}
}
function getRandomQuestion() {
  if (answered.value && nextQuestionFlag) {

    answered.value = null
    isCorrect = null
    nextQuestionFlag = false
    emit('question-rerolled');
  }

  let questions = []

  // Handle single test
  if (typeof props.test === 'string') {
    questions = data.questions[props.type][props.test]
  }

  // Handle multiple tests
  else if (Array.isArray(props.test)) {
    for (const testName of props.test) {
      const set = data.questions[props.type][testName]
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

function checkAnswerNote(){
  answered.value = true;
    console.log(props.selectedAnswer, currentQuestion.value);
    if(props.selectedAnswer.name==currentQuestion.value.answer && props.selectedAnswer.string == currentQuestion.value.gString)
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
// ✅ Update question whenever props change
watch(() => [props.type, props.test], () => {
  getRandomQuestion()
})

// ✅ Or when the component first mounts
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
    <p v-if="currentQuestion.answer == 'E' || currentQuestion.answer == 'E2'">
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
<!-- <script setup>
import Correct from '../components/Correct.vue'
import AudioPlayer from '../components/AudioPlayer.vue'
import { useRouter } from 'vue-router';
</script> 
<template>

        <div id = "TestContainer">
          <div v-if="isCorrect == null"> 
                <h1 id = "headliner">{{currentQuestion.question}}</h1>
                  <div id = "forMedia" v-if="currentQuestion.type=='image'">
                  <img id = "displayImage" :src="currentQuestion.media"/>
                  </div>
                  <div v-else id = "displaySound">
                     <AudioPlayer :audioPath="currentQuestion.media" />
                  </div>
                  <div id = "forQuestions">
                    <ul>
                        <li 
                            v-for="(option, index) in currentQuestion.options" 
                            :key="index" class = "Choices"
                            @click="checkAnswer(option)"
                        >
                            {{ option }}
                        </li>
                        </ul>
                  </div>
                  <div style="clear:both"></div>
          </div>
            <div v-else>
                  <div v-if="isCorrect==true">
                      <div class = "feedback correct">
                        <h1>CORRECT!</h1>
                        <h2>{{timer}}</h2>
                      </div>
                </div>
                <div v-else>
                        <div class = "feedback incorrect">
                        <h1>INCORRECT!</h1>
                        <h2>{{timer}}</h2>
                      </div>
                </div>
              </div>
          
            
           
        </div>

</template>

<script>
import router from '@/router';
export default {
  props: {
    questionOffSet: {
      type: Number,
      required: true
    },
    howManyQuestions :{
      type: Number,
      required: true
    }
  },
  data() {
    return {
      currentQuestion: {},
      isCorrect: null,
      timer: 3
    };
  },
  methods:{
    checkAnswer(option){
      console.log(option, this.currentQuestion.answer)
      if(option == this.currentQuestion.answer)
      {
        console.log("correct")
        this.isCorrect = true
        console.log(this.isCorrect)

      }
      else{
      console.log("incorrect")
      this.isCorrect = false
      console.log(this.isCorrect)
      }
              for (let i = 1; i <= 3; i++) {
              setTimeout(() => {
                this.timer--;
              }, i * 1000); // 3 second delay
            }
            setTimeout(() => {
              const pageAdress = window.location
        router.go(pageAdress);
            }, 3000);
        
    }
  },
  mounted() {
    fetch("http://localhost:3000/questions")
      .then(res => res.json())
      .then(data => {
        console.log('Fetched JSON:', data);
        const questions = data;
        const randomIndex = Math.floor(Math.random() * this.howManyQuestions) + this.questionOffSet; // question range
        this.currentQuestion = questions[randomIndex];
        this.currentQuestion.options.sort(() => Math.random() - 0.5);
        console.log(this.currentQuestion.options);
        
      })
      .catch(err => console.log(err.message));
      
  }

  
};
</script>
<style scoped>
.feedback{
  width: 100%;
  height: 100vh;
  background-color: black;
}

.correct{
 width: 100%;
  height: 35vh;
  background-color: green;
  border-radius: 5%;
}

.incorrect{
width: 100%;
  height: 35vh;
  background-color: red;
  border-radius: 5%;
}
.Choices{
    background-color: #777;
    text-align: center;
    list-style-type: none;
    line-height: 500%;
    border-radius: 15%;
    margin-bottom: 2%;
}
.Choices:hover{
    background-color: #999;

}
#forMedia{
    float:left;
    width: 50%;
    height: 100%;
}
#forQuestions{
    float:left;
    width: 50%;
    height: 100%;
}
#displayImage{
    padding-left: 10%;
    width: 60%;
}
#displaySound{
     float:left;
    width: 50%;
    height: 100%;
    padding-left: 10%;  
    padding-top: 5%;
    font-size: 1000%;
}
#headliner{
    text-align: center;
}
#TestContainer{
  width: 100%;
  height: 80%;
  background-color: #666;
  border-radius: 5%;

}
h1{
  text-align: center;
}
h2{
  text-align: center;
}
</style> -->