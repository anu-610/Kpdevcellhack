import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured =
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  !supabaseUrl.includes('your_supabase') &&
  !supabaseAnonKey.includes('your_supabase')

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storageKey: 'kp-dev-cell-auth',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
)

/**
 * ensureFreshSession — call this before every mutation.
 *
 * ROOT CAUSE OF "STUCK ON SAVING":
 * The Supabase JWT expires after 1 hour. If the admin opens the panel,
 * leaves the tab idle, then comes back and clicks Save, the token is
 * expired. Supabase JS v2 does NOT auto-refresh until the NEXT request,
 * so the first mutation after expiry hangs/fails silently because the
 * RLS policy rejects the stale JWT.
 *
 * Fix: before every insert/update/delete, check the expiry and force
 * a refresh if within 5 minutes of expiry. This costs ~50ms and makes
 * all subsequent mutations work reliably.
 */
export async function ensureFreshSession() {
  if (!isSupabaseConfigured) return false
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return false

    const expiresAt = session.expires_at // seconds
    const nowSec = Math.floor(Date.now() / 1000)

    if (expiresAt - nowSec < 300) {
      // Token expires in < 5 min — refresh proactively
      const { error } = await supabase.auth.refreshSession()
      if (error) {
        console.warn('Session refresh failed:', error.message)
        return false
      }
    }
    return true
  } catch (err) {
    console.warn('ensureFreshSession error:', err)
    return false
  }
}