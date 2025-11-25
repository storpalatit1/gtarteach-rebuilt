import { supabase } from '~/lib/supabase'
import { currentUser } from '~/lib/useUser'

export async function incrementStats() {
  if (!currentUser.value)
    return

  const { error } = await supabase.rpc('increment_correct_answers', {
    user_id: currentUser.value.id,
  })

  if (error)
    console.error('RPC error:', error)
}
