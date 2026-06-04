import { cn } from '@/lib/utils'

export function PriceInput({ value, onChange, transparent = false }) {
  const base = 'flex items-center w-24 sm:w-28 shrink-0 rounded-md overflow-hidden transition-colors min-h-[2.75rem] lg:min-h-[2rem]'
  const style = transparent
    ? 'border border-transparent hover:border-input focus-within:border-input dark:hover:border-gray-600 dark:focus-within:border-gray-600'
    : 'border border-input dark:border-gray-600 bg-transparent dark:bg-gray-900'

  return (
    <div className={cn(base, style)}>
      <span className="pl-2.5 pr-1 text-xs text-muted-foreground select-none shrink-0">R$</span>
      <input
        type="number"
        value={value ?? ''}
        min={0}
        step={0.01}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        placeholder="0,00"
        className="w-0 flex-1 pr-2 text-right text-sm bg-transparent border-none outline-none py-2 lg:py-1"
      />
    </div>
  )
}
