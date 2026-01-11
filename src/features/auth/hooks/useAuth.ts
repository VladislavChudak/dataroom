import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { toast } from 'sonner'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      toast.success(`Welcome, ${result.user.displayName || 'User'}!`)
      return result.user
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign in cancelled')
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Pop-up blocked. Please allow pop-ups for this site.')
      } else {
        toast.error('Failed to sign in. Please try again.')
      }
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      toast.success('Signed out successfully')
    } catch (error) {
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
