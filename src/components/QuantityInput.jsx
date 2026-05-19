import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function QuantityInput({ value, onChange, transparent = false }) {
  const dec = () => onChange(Math.max(0, parseFloat(value || 0) - 1))
  const inc = () => onChange(parseFloat(value || 0) + 1)

  const base = 'flex items-center w-28 shrink-0 rounded-md overflow-hidden transition-colors'
  const style = transparent
    ? 'border border-transparent hover:border-input focus-within:border-input dark:hover:border-gray-600 dark:focus-within:border-gray-600'
    : 'border border-input dark:border-gray-600 bg-transparent dark:bg-gray-900'

  return (
    <div className={cn(base, style)}>
      <button
        type="button"
        onClick={dec}
        disabled={parseFloat(value) <= 0}
        className="w-7 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
      >
        <Minus size={11} />
      </button>

      <input
        type="number"
        value={value}
        min={0}
        step={0.1}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className="w-0 flex-1 text-center text-sm bg-transparent border-none outline-none py-1"
      />

      <button
        type="button"
        onClick={inc}
        className="w-7 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0"
      >
        <Plus size={11} />
      </button>
    </div>
  )
}
