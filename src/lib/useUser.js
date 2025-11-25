import { ref } from 'vue'
import { supabase } from './supabase'

export const currentUser = ref(null)

supabase.auth.onAuthStateChange((event, session) => {
  currentUser.value = session?.user || null
})
