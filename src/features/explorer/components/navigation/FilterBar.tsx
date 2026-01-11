import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function FilterBar() {
  return (
    <div className="border-border flex h-12 items-center gap-3 border-b px-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            Type
            <Filter className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>All</DropdownMenuItem>
          <DropdownMenuItem>Folders only</DropdownMenuItem>
          <DropdownMenuItem>PDF files only</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            Modified
            <Filter className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>Any time</DropdownMenuItem>
          <DropdownMenuItem>Today</DropdownMenuItem>
          <DropdownMenuItem>Last 7 days</DropdownMenuItem>
          <DropdownMenuItem>Last 30 days</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
