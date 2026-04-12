import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Google SVG Icon
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.26c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
      <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
    </svg>
  )
}

export default function AdminLoginModal({ isOpen, onClose }) {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { signInWithGoogle, isAdmin, user, signOut } = useAuth()

  // Handle redirect when user becomes admin
  useEffect(() => {
    if (isOpen && user && isAdmin) {
      onClose()
      navigate('/admin')
    }
  }, [isOpen, user, isAdmin, onClose, navigate])

  const handleGoogleSignIn = async () => {
    setError(null)
    setLoading(true)
    
    try {
      const { error: signInError } = await signInWithGoogle()
      if (signInError) {
        setError('Failed to initiate sign in. Please try again.')
        setLoading(false)
      }
      // OAuth will redirect, so we don't need to handle success here
    } catch (err) {
      setError('An unexpected error occurred.')
      setLoading(false)
    }
  }

  const handleTryAgain = async () => {
    await signOut()
    setError(null)
  }

  // Check if user signed in but not admin
  const accessDenied = user && !isAdmin

  if (!isOpen) return null

  // Don't render if user is admin (useEffect will handle redirect)
  if (user && isAdmin) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 modal-backdrop"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[400px] bg-[#111111] border border-[#222222] rounded-xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#666666] hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            accessDenied ? 'bg-red-500/10' : 'bg-[#00ff88]/10'
          }`}>
            {accessDenied ? (
              <AlertCircle size={32} className="text-red-500" />
            ) : (
              <Lock size={32} className="text-[#00ff88]" />
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="font-mono text-xl text-white text-center mb-2">
          {accessDenied ? 'Access Denied' : 'Admin Access'}
        </h2>

        {/* Subtext */}
        <p className="text-[#888888] text-sm text-center mb-6">
          {accessDenied 
            ? 'This email is not authorized to access the admin panel.'
            : 'Restricted to authorized personnel only'
          }
        </p>

        {/* Error State */}
        {error && !accessDenied && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Action Button */}
        {accessDenied ? (
          <button
            onClick={handleTryAgain}
            className="w-full py-3 px-4 bg-[#161616] border border-[#333333] rounded-lg text-white font-medium hover:border-[#00ff88] hover:text-[#00ff88] transition-all btn-transition"
          >
            Try Again
          </button>
        ) : (
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 bg-white rounded-lg flex items-center justify-center gap-3 font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        )}

        {/* Footer text */}
        {!accessDenied && (
          <p className="text-[#555555] text-xs text-center mt-4">
            Only whitelisted emails can access admin panel
          </p>
        )}
      </div>
    </div>
  )
}
