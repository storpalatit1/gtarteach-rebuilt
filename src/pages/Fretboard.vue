<script setup>
import Fretboard from '../components/FretboardInteractive.vue'
</script>

<template>
  <Fretboard :frets="13" />

  <RouterView />
</template>
