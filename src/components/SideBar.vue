<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const chordRoutes = [
  '/chords',
  '/chords/listBasic',
  '/chords/testGraphic1',
  '/chords/testAudio1'
]
const noteRoutes = [
  '/notes',
  '/notes/fretboard',
  '/notes/openStringTest',
  '/notes/fretboardMemorizationTest'
]
</script>

<template>
  <section class="w-1/4 bg-gray-300 dark:bg-[#3a3a3a] p-4 overflow-y-auto">
    <div v-if="route.path === '/'">
      <p>Your exercises will be displayed on this list:</p>
    </div>

    <div v-else-if="chordRoutes.includes(route.path)">
      <ul>
        <RouterLink icon-btn to="/chords/listBasic">Basic list of chords</RouterLink><div py-1/>
        <RouterLink icon-btn to="/chords/testGraphic1">Basic chords visual test #1</RouterLink><div py-1/>
        <RouterLink icon-btn to="/chords/testAudio1">Basic chords audio test #1</RouterLink><div py-1/>
      </ul>
    </div>

    <div v-else-if="noteRoutes.includes(route.path)">
      <ul>
        <RouterLink icon-btn to="/notes/fretboard">Interactive fretboard</RouterLink><div py-1/>
         <RouterLink icon-btn to="/notes/openStringTest">Open String Test</RouterLink> <div py-1/>
         <RouterLink icon-btn to="/notes/fretboardMemorizationTest">Fretboard memorization test</RouterLink>
      </ul>
    </div>
  </section>
</template>