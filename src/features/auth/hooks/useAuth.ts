import { useEffect, useState } from 'react'
import type { User, AuthError } from 'firebase/auth'
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { toast } from 'sonner'

// Detect if user is on mobile device
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for redirect result first (for mobile auth)
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result?.user) {
          toast.success(`Welcome, ${result.user.displayName || 'User'}!`)
        }
      } catch (err) {
        const error = err as AuthError
        if (error.code === 'auth/popup-closed-by-user') {
          toast.error('Sign in cancelled')
        } else if (error.code === 'auth/unauthorized-domain') {
          toast.error(
            'This domain is not authorized. Please configure Firebase authorized domains.'
          )
        } else if (error.code !== 'auth/cancelled-popup-request') {
          toast.error(`Sign in failed: ${error.message}`)
        }
      }
    }

    checkRedirectResult()

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    const mobile = isMobile()

    try {
      // Try popup authentication first
      const result = await signInWithPopup(auth, googleProvider)
      toast.success(`Welcome, ${result.user.displayName || 'User'}!`)
      return result.user
    } catch (err) {
      const error = err as AuthError

      // On mobile, if popup fails, try redirect instead
      const shouldTryRedirect =
        mobile &&
        (error.code === 'auth/popup-blocked' ||
          error.code === 'auth/popup-closed-by-user' ||
          error.code === 'auth/cancelled-popup-request')

      if (shouldTryRedirect) {
        try {
          await signInWithRedirect(auth, googleProvider)
          return
        } catch (redirectErr) {
          const redirectError = redirectErr as AuthError
          handleAuthError(redirectError)
          throw redirectError
        }
      }

      // Handle other errors
      handleAuthError(error)
      throw error
    }
  }

  const handleAuthError = (error: AuthError) => {
    switch (error.code) {
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        toast.error('Sign in cancelled')
        break
      case 'auth/popup-blocked':
        toast.error('Pop-up blocked. Please allow pop-ups for this site.')
        break
      case 'auth/unauthorized-domain':
        toast.error('This domain is not authorized. Please configure Firebase authorized domains.')
        break
      default:
        toast.error('Failed to sign in. Please try again.')
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      toast.success('Signed out successfully')
    } catch (err) {
      const error = err as AuthError
      toast.error('Failed to sign out')
      throw error
    }
  }

  return {
    user,
    loading,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
  }
}
