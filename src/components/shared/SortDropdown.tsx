import { type SortConfig, type SortField, type SortOrder } from '@/lib/sorting'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

interface SortDropdownProps {
  sortConfig: SortConfig
  onSortChange: (config: SortConfig) => void
  itemCount: number
}

interface SortOption {
  field: SortField
  order: SortOrder
  label: string
  icon: typeof ArrowUp | typeof ArrowDown
}

const SORT_OPTIONS: SortOption[] = [
  { field: 'name', order: 'asc', label: 'Name (A-Z)', icon: ArrowUp },
  { field: 'name', order: 'desc', label: 'Name (Z-A)', icon: ArrowDown },
  { field: 'modified', order: 'desc', label: 'Modified (Newest)', icon: ArrowDown },
  { field: 'modified', order: 'asc', label: 'Modified (Oldest)', icon: ArrowUp },
  { field: 'size', order: 'desc', label: 'Size (Largest)', icon: ArrowDown },
  { field: 'size', order: 'asc', label: 'Size (Smallest)', icon: ArrowUp },
]

export function SortDropdown({ sortConfig, onSortChange, itemCount }: SortDropdownProps) {
  const getSortLabel = () => {
    const fieldLabels: Record<SortField, string> = {
      name: 'Name',
      modified: 'Modified',
      size: 'Size',
    }
    const Icon = sortConfig.order === 'asc' ? ArrowUp : ArrowDown

    return (
      <span className="flex items-center">
        {fieldLabels[sortConfig.field]}
        <Icon className="ml-1 h-4 w-4" />
      </span>
    )
  }

  return (
    <div className="mb-3 flex items-center justify-between px-1">
      <span className="text-muted-foreground text-sm">
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            {getSortLabel()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {SORT_OPTIONS.map((option) => {
            const Icon = option.icon
            return (
              <DropdownMenuItem
                key={`${option.field}-${option.order}`}
                onClick={() => onSortChange({ field: option.field, order: option.order })}
              >
                <Icon className="mr-2 h-4 w-4" />
                {option.label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
