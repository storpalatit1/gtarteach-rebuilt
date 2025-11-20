<template>
  <main class="mx-auto h-screen max-w-4xl items-center justify-between text-center">
    <div py-1 />
    <div class="text-size-12">
      <span>Select the exercise !</span>
    </div>
    <div py-4 />
    <div class="w-full border-2 border-blue-400 rounded-lg dark:border-gray-100">
      <div class="grid grid-cols-1 w-full place-items-start gap-4 p-4 lg:grid-cols-3 sm:grid-cols-2">
        <div class="w-full space-y-3">
          <div class="font-bold">
            Beginner:
          </div>
          <ul class="list-disc pl-6 space-y-3">
            <li class="border-2 border-blue-400 rounded-lg p-2 dark:border-gray-100 sm:p-3">
              <RouterLink icon-btn to="/scales/scaleVisualizer">
                Scale visualizer
              </RouterLink>
            </li>
            <li class="border-2 border-blue-400 rounded-lg p-2 dark:border-gray-100 sm:p-3">
              <RouterLink icon-btn to="/scales/scaleInterval">
                Scale Interval Identifier
              </RouterLink>
            </li>
            <li class="border-2 border-blue-400 rounded-lg p-2 dark:border-gray-100 sm:p-3">
              <RouterLink icon-btn to="/scales/chordFormula">
                Chord formulas
              </RouterLink>
            </li>
            <li class="border-2 border-blue-400 rounded-lg p-2 dark:border-gray-100 sm:p-3">
              <RouterLink icon-btn to="/scales/chordNameToFormula">
                Chord Name to Formula
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="w-full space-y-3">
          <div class="font-bold">
            Intermediate:
          </div>
          <ul class="list-disc pl-6 space-y-3">
            <li class="border-2 border-blue-400 rounded-lg p-2 dark:border-gray-100 sm:p-3">
              <RouterLink icon-btn to="/scales/missingNote">
                Missing scale note
              </RouterLink>
            </li>
            <li class="border-2 border-blue-400 rounded-lg p-2 dark:border-gray-100 sm:p-3">
              <RouterLink icon-btn to="/scales/nameTheScale">
                Name the Scale
              </RouterLink>
            </li>
            <li class="border-2 border-blue-400 rounded-lg p-2 dark:border-gray-100 sm:p-3">
              <RouterLink icon-btn to="/scales/IntervalWithinScale">
                Interval Within Scale, Major-Minor
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="w-full space-y-3">
          <div class="font-bold">
            Advanced:
          </div>
          <ul class="list-disc pl-6 space-y-3">
            <li class="border-2 border-blue-400 rounded-lg p-2 dark:border-gray-100 sm:p-3">
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
      <div class="w-1/2 border-2 border-blue-400 rounded-lg text-size-5 text-black space-y-3 dark:border-gray-200 dark:text-white">
        <RouterLink icon-btn to="/trueOrFalse">
          True or False, every category
        </RouterLink>
      </div>
    </div>
  </main>
</template>
