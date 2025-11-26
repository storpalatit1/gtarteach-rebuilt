<script setup lang="ts">
import { currentUser } from '../lib/useUser'

defineOptions({
  name: 'IndexPage',
})

const { t } = useI18n()

useHead({
  title: () => t('button.home'),
})
</script>

<template>
  <main class="mx-auto max-w-4xl p-4 text-center space-y-6">
    <div v-if="currentUser">
      <h1 class="text-4xl font-bold">
        Welcome {{ currentUser.email.split("@")[0] }}!
      </h1>
      Head to profile
      <div py-1 />
      <RouterLink to="/profile" class="mx-auto rounded-md bg-blue-500 pb-1 pl-5 pr-5 pt-1 dark:bg-gray-200 dark:text-black">
        Profile
      </RouterLink>
    </div>

    <h1 class="text-3xl font-bold">
      Master Your Guitar Fundamentals
    </h1>

    <p class="mx-auto max-w-2xl text-lg opacity-80">
      Build your essential skills. A solid foundation for chord recognition,
      note identification, and fretboard mastery.
    </p>

    <div class="grid grid-cols-1 w-full gap-4 sm:grid-cols-2">
      <RouterLink
        to="/chords"
        class="category flex items-center gap-4 border-2 border-blue-400 rounded-xl p-4 text-left transition-all dark:border-gray-100 hover:underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 24 24"
          class="shrink-0 text-blue-400 dark:text-gray-100"
        >
          <path
            fill="currentColor"
            d="M21 11.01L3 11v2h18zM3 16h12v2H3zM21 6H3v2.01L21 8z"
          />
        </svg>

        <span class="text-xl font-semibold">
          Visit the chord recognition exercises
        </span>
      </RouterLink>

      <RouterLink
        to="/notes"
        class="category flex items-center gap-4 border-2 border-blue-400 rounded-xl p-4 text-left transition-all dark:border-gray-100 hover:underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 24 24"
          class="shrink-0 text-blue-400 dark:text-gray-100"
        >
          <path
            fill="currentColor"
            d="M17 20c-.29 0-.56-.06-.76-.15c-.71-.37-1.21-.88-1.71-2.38c-.51-1.56-1.47-2.29-2.39-3c-.79-.61-1.61-1.24-2.32-2.53C9.29 10.98 9 9.93 9 9c0-2.8 2.2-5 5-5s5 2.2 5 5h2c0-3.93-3.07-7-7-7S7 5.07 7 9c0 1.26.38 2.65 1.07 3.9c.91 1.65 1.98 2.48 2.85 3.15c.81.62 1.39 1.07 1.71 2.05c.6 1.82 1.37 2.84 2.73 3.55A4 4 0 0 0 21 18h-2c0 1.1-.9 2-2 2M7.64 2.64L6.22 1.22C4.23 3.21 3 5.96 3 9s1.23 5.79 3.22 7.78l1.41-1.41C6.01 13.74 5 11.49 5 9s1.01-4.74 2.64-6.36M11.5 9a2.5 2.5 0 0 0 5 0a2.5 2.5 0 0 0-5 0"
          />
        </svg>

        <span class="text-xl font-semibold">
          Visit the note recognition exercises
        </span>
      </RouterLink>

      <RouterLink
        to="/scales"
        class="category flex items-center gap-4 border-2 border-blue-400 rounded-xl p-4 text-left transition-all dark:border-gray-100 hover:underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 24 24"
          class="shrink-0 text-blue-400 dark:text-gray-100"
        >
          <path
            fill="currentColor"
            d="M19.5 9.5c-1.03 0-1.9.62-2.29 1.5h-2.92c-.39-.88-1.26-1.5-2.29-1.5s-1.9.62-2.29 1.5H6.79c-.39-.88-1.26-1.5-2.29-1.5a2.5 2.5 0 0 0 0 5c1.03 0 1.9-.62 2.29-1.5h2.92c.39.88 1.26 1.5 2.29 1.5s1.9-.62 2.29-1.5h2.92c.39.88 1.26 1.5 2.29 1.5a2.5 2.5 0 0 0 0-5"
          />
        </svg>

        <span class="text-xl font-semibold">
          Visit the scales exercises
        </span>
      </RouterLink>

      <RouterLink
        to="/fretboard"
        class="category flex items-center gap-4 border-2 border-blue-400 rounded-xl p-4 text-left transition-all dark:border-gray-100 hover:underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 24 24"
          class="shrink-0 text-blue-400 dark:text-gray-100"
        >
          <path
            fill="currentColor"
            d="M12 3v10.55c-.59-.34-1.27-.55-2-.55c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4V7h4V3z"
          />
        </svg>

        <span class="text-xl font-semibold">
          Visit the interactive fretboard
        </span>
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
@keyframes expand {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.02);
  }
}

.category:hover {
  animation: expand 0.25s ease forwards;
}
</style>
