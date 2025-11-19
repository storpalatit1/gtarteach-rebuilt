<script setup>
import Fretboard from '../components/FretboardInteractive.vue'
</script>

<template>
  <div py-5 />
  <Fretboard :frets="13" />

  <RouterView />
</template>
