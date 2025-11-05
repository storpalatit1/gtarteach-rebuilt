---
title: About
---

<script setup>
const { t } = useI18n()
useHead({ title: () => t('button.about') })
</script>

<div class="text-center">
  <!-- You can use Vue components inside markdown -->
  <div i-carbon-dicom-overlay class="text-4xl -mb-6 m-auto" />
  <h3>{{ t('button.about') }}</h3>
</div>
This is a project made by Patryk during his internship at Rocksoft
This project was made on [Vitesse](https://github.com/antfu/vitesse) template on [Vite](https://github.com/vitejs/vite)
<route lang="yaml">
meta:
  layout: about
</route>
