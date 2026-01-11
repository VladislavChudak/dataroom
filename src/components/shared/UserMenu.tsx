import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UserMenuProps {
  user: {
    displayName?: string | null
    email?: string | null
    photoURL?: string | null
  } | null
  onSignOut: () => void
}

export function UserMenu({ user, onSignOut }: UserMenuProps) {
  const userInitial = user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.displayName || 'User'}</p>
            <p className="text-muted-foreground text-xs">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} className="gap-2 text-red-500">
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
