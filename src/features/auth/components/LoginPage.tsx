import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { AppLogo } from '@/components/shared/AppLogo'
import { GoogleIcon } from '@/components/shared/GoogleIcon'

export function LoginPage() {
  const { signInWithGoogle } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-background flex h-screen flex-col items-center justify-center">
      <div className="bg-card w-full max-w-md space-y-8 rounded-lg p-8 shadow-lg">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <AppLogo size="lg" />
          <div className="text-center">
            <h1 className="text-2xl font-bold">Dataroom Manager</h1>
            <p className="text-muted-foreground mt-2">
              Securely store, manage, and share company documents
            </p>
          </div>
        </div>

        {/* Sign in section */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Sign in to continue</h2>
            <p className="text-muted-foreground text-sm">
              Use your Google account to access your datarooms
            </p>
          </div>

          <Button
            onClick={handleSignIn}
            disabled={isLoading}
            size="lg"
            className="w-full gap-2"
            variant="outline"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-muted-foreground text-center text-xs">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          <p className="mt-2">
            This app works with any Google account. No special access required.
          </p>
        </div>
      </div>
    </div>
  )
}
