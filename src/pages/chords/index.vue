<template>
  <main class="mx-auto h-screen max-w-4xl items-center justify-between text-center">
    <div py-1 />
    <div class="text-size-12">
      <span>Select the exercise !</span>
    </div>
    <div py-4 />
    <div class="w-full">
      <div class="grid grid-cols-1 w-full place-items-start gap-4 p-4 lg:grid-cols-3 sm:grid-cols-2">
        <div class="w-full space-y-3">
          <div class="flex items-center gap-2 font-bold">
            <div class="h-8 w-1 rounded-full bg-green" />
            <span>Beginner:</span>
          </div>

          <ul class="list-none space-y-3">
            <li class="border-2 border-blue-400 rounded-lg p-2 dark:border-gray-100 sm:p-3">
              <RouterLink class="icon-btn" to="/chords/basicMajorChordsVisual">
                Basic Major Chords Visual Test
              </RouterLink>
            </li>
            <li class="border-2 border-blue-400 rounded-lg p-2 dark:border-gray-100 sm:p-3">
              <RouterLink class="icon-btn" to="/chords/basicMinorChordsVisual">
                Basic Minor Chords Visual Test
              </RouterLink>
            </li>
            <li class="border-2 border-blue-400 rounded-lg p-2 dark:border-gray-100 sm:p-3">
              <RouterLink class="icon-btn" to="/chords/basicChordsVisual">
                Basic Chords Visual Test
              </RouterLink>
            </li>
            <li class="border-2 border-blue-400 rounded-lg p-2 dark:border-gray-100 sm:p-3">
              <RouterLink class="icon-btn" to="/chords/basicChordsAudio">
                Basic Chords Listening Test
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Intermediate -->
        <div class="w-full space-y-3">
          <div class="flex items-center gap-2 font-bold">
            <div class="h-8 w-1 rounded-full bg-blue" />
            <span>Intermediate:</span>
          </div>

          <ul class="list-none space-y-3">
            <li class="border-2 border-blue-400 rounded-lg p-2 dark:border-gray-100 sm:p-3">
              <RouterLink class="icon-btn" to="/chords/basicSeventhChordsVisual">
                Basic 7th's Chords
              </RouterLink>
            </li>
            <li class="border-2 border-blue-400 rounded-lg p-2 dark:border-gray-100 sm:p-3">
              <RouterLink class="icon-btn" to="/chords/seventhChordsAudio">
                Basic 7th's Listening Chords
              </RouterLink>
            </li>
            <li class="border-2 border-blue-400 rounded-lg p-2 dark:border-gray-100 sm:p-3">
              <RouterLink class="icon-btn" to="/chords/basicDiminishedChordsVisual">
                Basic Diminished Chords
              </RouterLink>
            </li>
            <li class="border-2 border-blue-400 rounded-lg p-2 dark:border-gray-100 sm:p-3">
              <RouterLink class="icon-btn" to="/chords/basicDiminishedChordsAudio">
                Basic Diminished Chords Listening Test
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Advanced -->
        <div class="w-full space-y-3">
          <div class="flex items-center gap-2 font-bold">
            <div class="h-8 w-1 rounded-full bg-red" />
            <span>Advanced:</span>
          </div>

          <ul class="list-none space-y-3">
            <li class="border-2 border-blue-400 rounded-lg p-2 dark:border-gray-100 sm:p-3">
              <RouterLink class="icon-btn" to="/chords/allChordsVisual">
                All Chords Visual Test
              </RouterLink>
            </li>
            <li class="border-2 border-blue-400 rounded-lg p-2 dark:border-gray-100 sm:p-3">
              <RouterLink class="icon-btn" to="/chords/allChordsAudio">
                All Chords Audio Test
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="py-5" />

    <div class="flex items-center justify-center">
      <div class="max-w-sm w-full">
        <RouterLink
          icon-btn to="/trueOrFalse"
          class="block border-blue-800 rounded-md bg-blue-800 py-4 text-center text-size-5 text-white space-y-3 dark:border-white dark:bg-black dark:text-white"
        >
          True or False, every category
        </RouterLink>
      </div>
    </div>
  </main>
</template>
