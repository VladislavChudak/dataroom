import { Search } from 'lucide-react'

interface EmptySearchStateProps {
  searchQuery?: string
}

export function EmptySearchState({ searchQuery }: EmptySearchStateProps) {
  return (
    <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-3 p-4">
      <Search className="h-10 w-10 md:h-12 md:w-12" />
      <div className="px-4 text-center">
        <p className="text-sm font-medium md:text-base">No results found</p>
        {searchQuery && <p className="text-xs md:text-sm">No items match "{searchQuery}"</p>}
        <p className="text-xs md:text-sm">Try a different search term</p>
      </div>
    </div>
  )
}
