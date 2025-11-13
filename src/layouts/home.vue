<template>
  <div class="bg-gray-0 text-gray-0 h-full w-full overflow-y-auto p-4 dark:bg-[#000]">
    <header class="flex flex-wrap items-center justify-between px-4 py-3">
      <!-- Left side -->
      <div class="flex items-center gap-2 text-xl font-semibold">
        <span>Gtarteech-Rebuilt</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          class="text-blue-400 dark:text-gray-100"
        >
          <path
            fill="currentColor"
            d="M12 3v10.55c-.59-.34-1.27-.55-2-.55c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4V7h4V3z"
          />
        </svg>
      </div>

      <!-- Right side -->
      <nav class="flex flex-wrap items-center gap-4 text-base">
        <RouterLink icon-btn to="/">
          Home
        </RouterLink>
        <RouterLink icon-btn to="/chords">
          Chords
        </RouterLink>
        <RouterLink icon-btn to="/notes">
          Notes
        </RouterLink>
        <RouterLink icon-btn to="/scales">
          Scales
        </RouterLink>
        <RouterLink icon-btn to="/fretboard">
          Fretboard
        </RouterLink>
        <button icon-btn title="toggle dark" @click="toggleDark()">
          <div i="carbon-sun dark:carbon-moon" />
        </button>
      </nav>
    </header>

    <hr class="h-2px border-0 bg-blue-400 dark:bg-gray-100">
    <RouterView />
  </div>
</template>
