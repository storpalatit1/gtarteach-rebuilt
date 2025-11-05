<script setup>
import { ref } from 'vue'
import AudioPlayer from '../../components/AudioPlayer.vue'
const playerRef = ref()

function playChord(chord) {
    console.log("playing");
  // The src could come from your data (e.g., `/sounds/${chord}.mp3`)
  playerRef.value.initAudio(`../../../public/chords/${chord}Chord.mp3`);
}
</script>

<template>
  <div>
    <h2>Chord List</h2>
      <div class="flex flex-wrap gap-5">
        <div @click="playChord('A')" class="flex flex-col items-left" >
           <div class = "chord">
            <div class = "bg-gray-100 text-gray-800 dark:bg-[#111111] dark:text-white w-2/5 text-center">A major</div>
                <img src = "../../../public/chords/graphic/AChord.png" class = "w-2/5"></img>
                </div>
        </div>   
        <div @click="playChord('C')" class="flex flex-col items-left" >
           <div class = "chord">
            <div class = "bg-gray-100 text-gray-800 dark:bg-[#111111] dark:text-white w-2/5 text-center">C major</div>
                <img src = "../../../public/chords/graphic/CChord.png" class = "w-2/5"></img>
                </div>
        </div>   
        <div @click="playChord('D')" class="flex flex-col items-left" >
           <div class = "chord">
            <div class = "bg-gray-100 text-gray-800 dark:bg-[#111111] dark:text-white w-2/5 text-center">D major</div>
                <img src = "../../../public/chords/graphic/DChord.png" class = "w-2/5"></img>
                </div>
        </div>   
        <div @click="playChord('Am')" class="flex flex-col items-left" >
           <div class = "chord">
            <div class = "bg-gray-100 text-gray-800 dark:bg-[#111111] dark:text-white w-2/5 text-center">A minor</div>
                <img src = "../../../public/chords/graphic/AmChord.png" class = "w-2/5"></img>
                </div>
        </div>   
        <div @click="playChord('E')" class="flex flex-col items-left" >
           <div class = "chord">
            <div class = "bg-gray-100 text-gray-800 dark:bg-[#111111] dark:text-white w-2/5 text-center">E major</div>
                <img src = "../../../public/chords/graphic/EChord.png" class = "w-2/5"></img>
                </div>
        </div>      
        <div @click="playChord('Em')" class="flex flex-col items-left" >
          <div class = "chord">
            <div class = "bg-gray-100 text-gray-800 dark:bg-[#111111] dark:text-white w-2/5 text-center">E minor</div>
                <img src = "../../../public/chords/graphic/EmChord.png" class = "w-2/5"></img>
                </div>
        </div>      
        <div @click="playChord('G')" class="flex flex-col items-left" >
          <div class = "chord">
            <div class = "bg-gray-100 text-gray-800 dark:bg-[#111111] dark:text-white w-2/5 text-center">G major</div>
                <img src = "../../../public/chords/graphic/GChord.png" class = "w-2/5"></img>
            </div>
        </div>         
        </div>
    <AudioPlayer ref="playerRef" />
  </div>
</template>

<style scoped>
.chord:hover{
width: 110%;
}
</style>