<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
})
const user = useUserStore()
const name = ref(user.savedName)

const router = useRouter()
function go() {
  if (name.value)
    router.push(`/hi/${encodeURIComponent(name.value)}`)
}

const { t } = useI18n()
useHead({
  title: () => t('button.home'),
})
</script>

<template>
  <div>
      This project was made for the Rocksoft internship project, by Patryk on the Vitesse template, running on the Vue.js framework.  
    <div py-4 />
    
<!--    
    
    <TheInput
      v-model="name"
      :placeholder="t('intro.whats-your-name')"
      autocomplete="false"
      @keydown.enter="go"
    />
    <label class="hidden" for="input">{{ t('intro.whats-your-name') }}</label>

    <div>
      <button
        m-3 text-sm btn
        :disabled="!name"
        @click="go"
      >
        {{ t('button.go') }}
      </button>
    </div> -->
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>


<!-- <template>
    <div id = "main">a</div>
</template>

<style scoped>
#main{
  background-color: blue;
  width: 100%;
  height: 100%;
}</style> -->