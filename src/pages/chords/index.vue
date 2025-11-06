<template>
  <main class="mx-auto h-screen max-w-4xl items-center justify-between text-center">
    <div py-1 />
    <div class="text-size-12">
      <span>Select the excersize!</span>
    </div>
    <div py-4 />

    <div class="h-3/5 w-full border-1.5 border-blue-400 rounded-lg dark:border-1.5 dark:border-gray-100">
      <div class="grid grid-cols-3 h-3/4 w-full place-items-center gap-1 p-1">
        <div class="h-full w-full">
          Beginner: <div py-1 />
          <ul class="list-disc pl-6 space-y-3">
            <li class="border-1.5 border-blue-400 rounded-lg p-3 dark:border-2 dark:border-gray-100">
              <RouterLink icon-btn to="/chords/basicMajorChordsVisual">
                Basic Major Chords Visual Test
              </RouterLink>
            </li>
            <li class="border-1.5 border-blue-400 rounded-lg p-3 dark:border-2 dark:border-gray-100">
              <RouterLink icon-btn to="/chords/basicMinorChordsVisual">
                Basic Minor Chords Visual Test
              </RouterLink>
            </li>
            <li class="border-1.5 border-blue-400 rounded-lg p-3 dark:border-2 dark:border-gray-100">
              <RouterLink icon-btn to="/chords/basicChordsVisual">
                Basic Chords Visual Test
              </RouterLink>
            </li>
          </ul>
        </div>
        <div class="h-full w-full">
          Intermediate:
          <ul class="list-disc pl-6 space-y-3">
            <li class="border-1.5 border-blue-400 rounded-lg p-3 dark:border-2 dark:border-gray-100">
              Basic Major 7th's Chords Visual Test
            </li>
            <li class="border-1.5 border-blue-400 rounded-lg p-3 dark:border-2 dark:border-gray-100">
              Basic Minor 7th's Chords Visual Test
            </li>
          </ul>
        </div>

        <div class="h-full w-full">
          Advanced:
          <ul class="list-disc pl-6 space-y-3">
            <li class="border-1.5 border-blue-400 rounded-lg p-3 dark:border-2 dark:border-gray-100">
              Basic Major Chords Visual Test
            </li>
            <li class="border-1.5 border-blue-400 rounded-lg p-3 dark:border-2 dark:border-gray-100">
              Basic Minor Chords Visual Test
            </li>
          </ul>
        </div>
      </div>
    </div>
  </main>
</template>
