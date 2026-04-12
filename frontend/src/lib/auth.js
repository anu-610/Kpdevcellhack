import { supabase, isSupabaseConfigured } from './supabase'

// ─── Admin email cache ────────────────────────────────────────────────────────
// Prevents repeated DB hits on every page load / auth check.
// Cache entries expire after 5 minutes automatically.
const adminCache = new Map()

/**
 * Check if an email is in the admin whitelist
 */
export async function checkIsAdmin(email) {
  if (!email || !isSupabaseConfigured) return false

  // Return cached result if available
  if (adminCache.has(email)) return adminCache.get(email)

  try {
    const { data, error } = await supabase
      .from('admin_emails')
      .select('email')
      .eq('email', email.toLowerCase())
      .single()

    if (error) {
      console.error('Admin check error:', error)
      adminCache.set(email, false)
      setTimeout(() => adminCache.delete(email), 5 * 60 * 1000)
      return false
    }

    const result = !!data
    adminCache.set(email, result)
    // Clear cache entry after 5 minutes so stale access can't persist
    setTimeout(() => adminCache.delete(email), 5 * 60 * 1000)
    return result
  } catch (err) {
    console.error('Admin check exception:', err)
    return false
  }
}

/**
 * Manually clear the admin cache for a specific email.
 * Call this after sign-out so the next login gets a fresh check.
 */
export function clearAdminCache(email) {
  if (email) adminCache.delete(email)
  else adminCache.clear()
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  if (!isSupabaseConfigured) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/admin'
    }
  })
  return { data, error }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  if (!isSupabaseConfigured) {
    return { error: null }
  }

  // Clear admin cache on sign-out so next login gets a fresh DB check
  clearAdminCache()

  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Get the current session
 */
export async function getSession() {
  if (!isSupabaseConfigured) {
    return { data: { session: null }, error: null }
  }

  const { data, error } = await supabase.auth.getSession()
  return { data, error }
}

/**
 * Get the current user
 */
export async function getUser() {
  if (!isSupabaseConfigured) {
    return { data: { user: null }, error: null }
  }

  const { data, error } = await supabase.auth.getUser()
  return { data, error }
}