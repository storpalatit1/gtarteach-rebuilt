<script setup lang="ts">
import { availableLocales, loadLanguageAsync } from '~/modules/i18n'

const { t, locale } = useI18n()

async function toggleLocales() {
  // change to some real logic
  const locales = availableLocales
  const newLocale = locales[(locales.indexOf(locale.value) + 1) % locales.length]
  await loadLanguageAsync(newLocale)
  locale.value = newLocale
}
</script>

<template>
  <div class="bg-gray-100 text-gray-800 dark:bg-[#242424] dark:text-white w-full" style="text-align: center;">
    Gtarteech-Rebuilt
        <button icon-btn :title="t('button.toggle_dark')" @click="toggleDark()">
      <div i="carbon-sun dark:carbon-moon" />
    </button>
    <div class="bg-gray-200 dark:bg-[#363636] flex justify-center items-center py-3">
      <RouterLink icon-btn to="/" :title="t('button.home')" class="category">
        Home
      </RouterLink>
      <RouterLink icon-btn to="/chords" :title="t('button.chords')" class="category">
        Chords
      </RouterLink>
      <RouterLink icon-btn to="/notes" :title="t('button.notes')" class="category">
        Notes
      </RouterLink>
      <RouterLink icon-btn to="/about" :title="t('button.about')" class="category">
        About
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.category {
  padding: 0 2rem;
  transition: color 0.3s;
}

.category:hover {
  text-decoration: underline;
}
</style>