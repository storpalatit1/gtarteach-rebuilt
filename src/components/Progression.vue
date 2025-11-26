<script setup>
import { onMounted, ref } from 'vue'
import { supabase } from '~/lib/supabase'
import { currentUser } from '~/lib/useUser'

const props = defineProps({
  isCorrect: {
    type: Boolean,
    default: null,
  },
  difficulty: String,

})
const displayNewXP = ref(0)
const displayXP = ref(0)
const displayStreak = ref(0)
const userLvl = ref(0)
const displayStreakDifference = ref(0)
const xpProgress = computed(() => {
  const needed = xpForLevel(userLvl.value)
  if (needed === 0)
    return 0
  return Math.floor((displayXP.value / needed) * 100)
})

async function getStats() {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .eq('user_id', currentUser.value.id)
    .single()

  if (error)
    console.error(error)
  return data
}

function xpForLevel(level) {
  return 100 + (level - 1) * 150 + level * level * 20
}

function baseXpReward() {
  switch (props.difficulty) {
    case 'Beginner': return 10
    case 'Intermediate': return 20
    case 'Advanced': return 35
    default: return 0
  }
}

function calculateStreakReward(stats) {
  const baseXP = baseXpReward()

  // Streak multiplier formula
  const multiplier = stats.current_streak > 0
    ? 1 + stats.current_streak * 0.5
    : 1

  const totalXP = Math.floor(baseXP * multiplier)
  return totalXP
}

function checkStreak(stats) {
  if (stats.longest_streak > stats.current_streak) {
    const difference = Math.abs(stats.longest_streak - stats.current_streak)
    if (difference <= 10) {
      displayStreakDifference.value = difference
    }
    else {
      displayStreakDifference.value = 0
    }
  }
}

function applyLevelProgression(stats, earnedXP) {
  let newLevel = stats.lvl
  let newXP = stats.xp + earnedXP

  while (newXP >= xpForLevel(newLevel)) {
    newXP -= xpForLevel(newLevel)
    newLevel++
  }

  return { newXP, newLevel }
}

async function incrementCorrect() {
  if (currentUser) {
    const stats = await getStats()
    if (!stats)
      return

    const earnedXP = calculateStreakReward(stats)
    const { newXP, newLevel } = applyLevelProgression(stats, earnedXP)

    await supabase
      .from('stats')
      .update({
        correct_answers: stats.correct_answers + 1,
        xp: newXP,
        lvl: newLevel,
      })
      .eq('user_id', currentUser.value.id)

    displayNewXP.value = earnedXP
    displayXP.value = newXP
    userLvl.value = newLevel
  }
}

async function incrementStreak() {
  if (currentUser) {
    const stats = await getStats()
    const newStreak = stats.current_streak + 1
    checkStreak(stats)
    await supabase
      .from('stats')
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(stats.longest_streak, newStreak),
      })
      .eq('user_id', currentUser.value.id)

    displayStreak.value = newStreak
  }
}

async function wrongAnswer() {
  if (currentUser) {
    const stats = await getStats()
    const updateLongest
      = stats.current_streak > stats.longest_streak
        ? stats.current_streak
        : stats.longest_streak

    await supabase
      .from('stats')
      .update({
        current_streak: 0,
        longest_streak: updateLongest,
      })
      .eq('user_id', currentUser.value.id)

    displayStreak.value = 0
  }
}

async function displayData() {
  const stats = await getStats()
  if (!stats)
    return

  displayXP.value = stats.xp
  userLvl.value = stats.lvl
  displayStreak.value = stats.current_streak
}

async function handleXP() {
  if (props.isCorrect) {
    await incrementCorrect()
    await incrementStreak()
  }
  else {
    await wrongAnswer()
  }
}

onMounted(() => {
  if (currentUser) {
    displayData()
    handleXP()
  }
})
</script>

<template>
  <div v-if="currentUser" class="mx-auto max-w-2xl w-full text-center">
    <h1 v-if="props.isCorrect === true" class="text-2xl text-green">
      Correct!
    </h1>
    <h1 v-else class="text-2xl text-red">
      Incorrect!
    </h1>

    <h1>Added: {{ displayNewXP }} xp!</h1>

    <h1>Level {{ userLvl }}</h1>

    <div class="mx-auto max-w-3xl w-[95%]">
      <div class="h-4 rounded bg-gray-300">
        <div
          class="h-4 rounded bg-blue-500 transition-all duration-300"
          :style="{ width: `${xpProgress}%` }"
        />
      </div>
    </div>

    <p class="mt-1 text-sm">
      {{ displayXP }}/{{ xpForLevel(userLvl) }} XP ({{ xpProgress }}%)
    </p>

    <h1>Current streak: {{ displayStreak }}</h1>
    <h1 v-if="displayStreakDifference">
      {{ displayStreakDifference }} more to beat your longest streak! Keep going!
    </h1>
  </div>
  <div v-else py-5>
    <h1 v-if="props.isCorrect === true" class="text-2xl text-green">
      Correct!
    </h1>
    <h1 v-else class="text-2xl text-red">
      Incorrect!
    </h1>
    <h1>Log in to unlock progress tracking! </h1>
  </div>
</template>
