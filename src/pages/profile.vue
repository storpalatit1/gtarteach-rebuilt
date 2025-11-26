<script setup>
import { ref, watchEffect } from 'vue'
import { supabase } from '../lib/supabase'
import { currentUser } from '../lib/useUser'

const correctAnswers = ref(null)
const longestStreak = ref(null)
const currentStreak = ref(null)
const xp = ref(null)
const lvl = ref(null)

function xpForLevel(level) {
  return 100 + (level - 1) * 150 + level * level * 20
}

const xpProgress = computed(() => {
  const needed = xpForLevel(lvl.value)
  if (needed === 0)
    return 0
  return Math.floor((xp.value / needed) * 100)
})

watchEffect(async () => {
  if (!currentUser.value)
    return

  const { data: stats } = await supabase
    .from('stats')
    .select('*')
    .eq('user_id', currentUser.value.id)
    .single()

  if (stats) {
    correctAnswers.value = stats.correct_answers
    longestStreak.value = stats.longest_streak
    currentStreak.value = stats.current_streak
    xp.value = stats.xp
    lvl.value = stats.lvl
  }
})
</script>

<template>
  <main class="mx-auto mt-5 h-screen max-w-4xl items-center justify-between text-center">
    <div v-if="currentUser">
      <h1 class="text-2xl">
        Welcome {{ currentUser.email.split('@')[0] }}!
      </h1>
      <br>
      You have <strong>{{ correctAnswers }}</strong> correct answers!
      <br>
      Your longest streak is <strong>{{ longestStreak }}</strong>!
      <br>
      Your current streak is <strong>{{ currentStreak }}</strong>!
      <br>
      <div mt-2 />
      level {{ lvl }}
      <div class="h-4 w-full rounded bg-gray-300">
        <div
          class="h-4 rounded bg-blue-500 transition-all duration-300"
          :style="{ width: `${xpProgress}%` }"
        />
      </div>

      <p class="mt-1 text-sm">
        {{ xp }}/{{ xpForLevel(lvl) }} XP ({{ xpProgress }}%)
      </p>
    </div>
  </main>
</template>
