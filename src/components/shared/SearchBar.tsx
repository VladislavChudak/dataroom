import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  autoFocus,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)
  const debouncedValue = useDebounce(localValue, 500)

  // Propagate debounced changes to parent
  useEffect(() => {
    onChange(debouncedValue)
  }, [debouncedValue, onChange])

  const handleClear = () => {
    setLocalValue('')
  }

  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        autoFocus={autoFocus}
        className="bg-secondary/50 border-border focus:ring-ring h-10 w-full rounded-md border pr-10 pl-10 focus:ring-2 focus:outline-none"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-1 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
