<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMsg = ref('')

async function handleSignup() {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })

  if (error) {
    errorMsg.value = error.message
  }
  else {
    router.replace('/')
  }
}
</script>

<template>
  <main class="mx-auto max-w-4xl p-4 text-center space-y-6">
    <h1 class="mb-4 flex items-center justify-center gap-2 text-2xl font-bold">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="m11.9 12.1l4.514-4.514M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4zM6 16l2 2m.23-8.15A3 3 0 0 1 11 8a5 5 0 0 1 5 5a3 3 0 0 1-1.85 2.77l-.92.38A2 2 0 0 0 12 18a4 4 0 0 1-4 4a6 6 0 0 1-6-6a4 4 0 0 1 4-4a2 2 0 0 0 1.85-1.23z"
        />
      </svg>
      Sign Up
    </h1>

    <!-- Centered bordered container -->
    <div class="mx-auto max-w-md w-full p-6 text-left space-y-4">
      <div class="text-black dark:text-white">
        Email: (has to be confirmed after signing up)<br>
        <input v-model="email" class="w-full border rounded p-2" placeholder="email">
      </div>

      <div class="text-black dark:text-white">
        Password:<br>
        <input v-model="password" type="password" class="w-full border rounded p-2" placeholder="password">
      </div>

      <button class="w-full rounded bg-blue-500 p-2 text-white" @click="handleSignup">
        Sign Up
      </button>

      <p class="text-red-500">
        {{ errorMsg }}
      </p>
    </div>
  </main>
</template>
