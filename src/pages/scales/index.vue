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
              <RouterLink icon-btn to="/scales/scaleVisualizer">
                Scale visualizer
              </RouterLink>
            </li>
            <li class="border-1.5 border-blue-400 rounded-lg p-3 dark:border-2 dark:border-gray-100">
              <RouterLink icon-btn to="/scales/scaleInterval">
                Scale Interval Identifier
              </RouterLink>
            </li>
            <li class="border-1.5 border-blue-400 rounded-lg p-3 dark:border-2 dark:border-gray-100">
              <RouterLink icon-btn to="/scales/chordFormula">
                Chord formulas
              </RouterLink>
            </li>
            <li class="border-1.5 border-blue-400 rounded-lg p-3 dark:border-2 dark:border-gray-100">
              <RouterLink icon-btn to="/scales/chordNameToFormula">
                Chord Name to Formula
              </RouterLink>
            </li>
          </ul>
        </div>
        <div class="h-full w-full">
          Intermediate:
          <ul class="list-disc pl-6 space-y-3">
            <li class="border-1.5 border-blue-400 rounded-lg p-3 dark:border-2 dark:border-gray-100">
              <RouterLink icon-btn to="/scales/missingNote">
                Missing scale note
              </RouterLink>
            </li>
            <li class="border-1.5 border-blue-400 rounded-lg p-3 dark:border-2 dark:border-gray-100">
              <RouterLink icon-btn to="/scales/nameTheScale">
                Name the Scale
              </RouterLink>
            </li>
            <li class="border-1.5 border-blue-400 rounded-lg p-3 dark:border-2 dark:border-gray-100">
              <RouterLink icon-btn to="/scales/IntervalWithinScale">
                Interval Within Scale, Major-Minor
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="h-full w-full">
          Advanced:
          <ul class="list-disc pl-6 space-y-3">
            <li class="border-1.5 border-blue-400 rounded-lg p-3 dark:border-2 dark:border-gray-100">
              <RouterLink icon-btn to="/scales/IntervalWithinScaleAll">
                Interval Within Scale, all modes
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div py-5 />
    <div class="flex items-center justify-center">
      <div class="h-15 w-1/3 border-2 border-blue-400 rounded-lg text-size-5 text-black dark:border-gray-200 dark:text-white">
        <RouterLink icon-btn to="/trueOrFalse">
          True or False, every category
        </RouterLink>
      </div>
    </div>
  </main>
</template>
