import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { checkIsAdmin, signInWithGoogle as authSignInWithGoogle, signOut as authSignOut } from '../lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  // Prevent double-init from both getSession + onAuthStateChange firing
  const initialised = useRef(false)

  const verifyAdmin = useCallback(async (u) => {
    if (!u?.email) {
      setIsAdmin(false)
      return false
    }
    const result = await checkIsAdmin(u.email)
    setIsAdmin(result)
    return result
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    let subscription = null

    async function init() {
      // Step 1: read persisted session from localStorage (instant, no network)
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)
        await verifyAdmin(session.user)
      } else {
        setUser(null)
        setIsAdmin(false)
      }

      // Only stop loading after session is confirmed
      setLoading(false)
      initialised.current = true

      // Step 2: subscribe to future auth changes
      const { data } = supabase.auth.onAuthStateChange(async (event, sess) => {
        // Skip the first INITIAL_SESSION event — we already handled it above
        if (!initialised.current) return

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(sess?.user ?? null)
          if (sess?.user) await verifyAdmin(sess.user)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setIsAdmin(false)
        } else if (event === 'INITIAL_SESSION') {
          // Already handled above — ignore
        }
      })

      subscription = data.subscription
    }

    init()

    return () => {
      subscription?.unsubscribe()
    }
  }, [verifyAdmin])

  const signInWithGoogle = useCallback(async () => {
    return authSignInWithGoogle()
  }, [])

  const signOut = useCallback(async () => {
    await authSignOut()
    setUser(null)
    setIsAdmin(false)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}