<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
})
// const user = useUserStore()
// const name = ref(user.savedName)

// const router = useRouter()
// function go() {
//   if (name.value)
//     router.push(`/hi/${encodeURIComponent(name.value)}`)
// }

const { t } = useI18n()
useHead({
  title: () => t('button.home'),
})
</script>

<template>
  <main class="mx-auto h-screen max-w-4xl items-center justify-between text-center">
    <div py-1 />
    <div class="text-size-12">
      <span>Master Your Guitar Fundamentals</span>
    </div>
    <div py-2 />
    <div class="text-size-6">
      Build your essential skills. A solid foundation for chord recognition, note identification, and fretboard mastery
    </div>
    <div py-2 />
    <div class="grid grid-cols-2 h-3/4 w-full place-items-center gap-1 p-1">
      <RouterLink icon-btn to="/chords" class="category h-4/5 w-4/5 border-2 border-blue-400 rounded-lg dark:border-2 dark:border-gray-100">
        <div class="h-full w-full pl-2 pt-2">
          <div class="flex items-center gap-2 text-4 font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              class="text-blue-400 dark:text-gray-100"
            >
              <path
                fill="currentColor"
                d="M21 11.01L3 11v2h18zM3 16h12v2H3zM21 6H3v2.01L21 8z"
              />
            </svg>
            Visit the chord recognition excersizes
          </div>
        </div>
      </RouterLink>
      <RouterLink icon-btn to="/notes" class="category h-4/5 w-4/5 border-2 border-blue-400 rounded-lg dark:border-2 dark:border-gray-100">
        <div class="h-full w-full pl-2 pt-2">
          <div class="flex items-center gap-2 text-4 font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              class="text-blue-400 dark:text-gray-100"
            >
              <path
                fill="currentColor"
                d="M17 20c-.29 0-.56-.06-.76-.15c-.71-.37-1.21-.88-1.71-2.38c-.51-1.56-1.47-2.29-2.39-3c-.79-.61-1.61-1.24-2.32-2.53C9.29 10.98 9 9.93 9 9c0-2.8 2.2-5 5-5s5 2.2 5 5h2c0-3.93-3.07-7-7-7S7 5.07 7 9c0 1.26.38 2.65 1.07 3.9c.91 1.65 1.98 2.48 2.85 3.15c.81.62 1.39 1.07 1.71 2.05c.6 1.82 1.37 2.84 2.73 3.55A4 4 0 0 0 21 18h-2c0 1.1-.9 2-2 2M7.64 2.64L6.22 1.22C4.23 3.21 3 5.96 3 9s1.23 5.79 3.22 7.78l1.41-1.41C6.01 13.74 5 11.49 5 9s1.01-4.74 2.64-6.36M11.5 9a2.5 2.5 0 0 0 5 0a2.5 2.5 0 0 0-5 0"
              />
            </svg>
            Visit the note recognition excersizes
          </div>
        </div>
      </RouterLink>
      <RouterLink icon-btn to="/about" class="category h-4/5 w-4/5 border-2 border-blue-400 rounded-lg dark:border-2 dark:border-gray-100">
        <div class="h-full w-full pl-2 pt-2">
          <div class="flex items-center gap-2 text-4 font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              class="text-blue-400 dark:text-gray-100"
            >
              <path
                fill="currentColor"
                d="M19.5 9.5c-1.03 0-1.9.62-2.29 1.5h-2.92c-.39-.88-1.26-1.5-2.29-1.5s-1.9.62-2.29 1.5H6.79c-.39-.88-1.26-1.5-2.29-1.5a2.5 2.5 0 0 0 0 5c1.03 0 1.9-.62 2.29-1.5h2.92c.39.88 1.26 1.5 2.29 1.5s1.9-.62 2.29-1.5h2.92c.39.88 1.26 1.5 2.29 1.5a2.5 2.5 0 0 0 0-5"
              />
            </svg>
            Visit the scales excersizes
          </div>
        </div>
      </RouterLink>
      <RouterLink icon-btn to="/notes/fretboard" class="category h-4/5 w-4/5 border-2 border-blue-400 rounded-lg dark:border-2 dark:border-gray-100">
        <div class="h-full w-full pl-2 pt-2">
          <div class="flex items-center gap-2 text-4 font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              class="text-blue-400 dark:text-gray-100"
            >
              <path
                fill="currentColor"
                d="M12 3v10.55c-.59-.34-1.27-.55-2-.55c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4V7h4V3z"
              />
            </svg>
            Visit the interactive fretboard
          </div>
        </div>
      </RouterLink>
    </div>
  </main>
</template>

<route lang="yaml">
meta:
  layout: home
</route>

<style scoped>
 @keyframes expand {
  0% {
    height: 100%;
    width: 100%;
  }

  100% {
    height: 102%;
    width: 102%;
  }
}

.category {
  transition: transform 0.3s ease;
}

.category:hover {
  animation: expand 0.3s ease forwards;
  text-decoration: underline;
}
</style>
