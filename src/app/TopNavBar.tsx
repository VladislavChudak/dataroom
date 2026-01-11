import { useAuthContext } from '@/features/auth/hooks/useAuthContext'
import { AppLogo } from '@/components/shared/AppLogo'
import { SearchBar } from '@/components/shared/SearchBar'
import { UserMenu } from '@/components/shared/UserMenu'
import { Button } from '@/components/ui/button'
import { Menu, Search } from 'lucide-react'
import { useState } from 'react'

interface TopNavBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onMenuClick?: () => void
}

export function TopNavBar({ searchQuery, onSearchChange, onMenuClick }: TopNavBarProps) {
  const { user, signOut } = useAuthContext()
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      // Error is already handled in useAuth hook with toast notification
    }
  }

  return (
    <header className="border-border flex h-14 items-center justify-between border-b px-2 md:h-16 md:px-4">
      {/* Mobile: Menu button, Logo, Search toggle, User menu */}
      <div className="flex w-full items-center justify-between md:hidden">
        {!showMobileSearch ? (
          <>
            <div className="flex items-center gap-2">
              {onMenuClick && (
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onMenuClick}>
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <AppLogo size="sm" variant="square" />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setShowMobileSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              <UserMenu user={user} onSignOut={handleSignOut} />
            </div>
          </>
        ) : (
          <div className="flex w-full items-center gap-2">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search..."
                autoFocus
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowMobileSearch(false)
                onSearchChange('')
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Desktop: Logo, Search, User menu */}
      <div className="hidden w-full items-center justify-between md:flex">
        {/* Logo */}
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <AppLogo size="sm" variant="square" />
          <h1 className="text-base font-semibold lg:text-lg">Dataroom Manager</h1>
        </div>

        {/* Search bar */}
        <div className="mx-4 max-w-2xl flex-1 lg:mx-8">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search across all datarooms..."
          />
        </div>

        {/* User menu */}
        <div className="flex items-center gap-2">
          <UserMenu user={user} onSignOut={handleSignOut} />
        </div>
      </div>
    </header>
  )
}
