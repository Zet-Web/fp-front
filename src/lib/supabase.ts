import { createClient, Session } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing env variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    debug: false
  }
})

let authReadyResolver: (session: Session | null) => void
let initialSessionFetched = false

export const authReady = new Promise<Session | null>((resolve) => {
  authReadyResolver = resolve
});

(async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      authReadyResolver(null)
    } else {
      authReadyResolver(session)
    }
    initialSessionFetched = true
  } catch (err) {
    console.error('❌ [Auth Init] Exception during session hydration:', err)
    authReadyResolver(null)
    initialSessionFetched = true
  }
})()

export function getAuthReadyState() {
  return initialSessionFetched
}

export type { User, Session } from '@supabase/supabase-js'