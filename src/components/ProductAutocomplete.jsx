import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { allProducts, catalog } from '@/data/catalog'
import { cn } from '@/lib/utils'

const subMap = Object.fromEntries(
  catalog.flatMap(c => c.subcategories.map(s => [s.id, s.name]))
)

function HighlightMatch({ text, query }) {
  if (!query.trim()) return <span>{text}</span>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <span>{text}</span>
  return (
    <>
      <span>{text.slice(0, idx)}</span>
      <span className="font-bold text-primary">{text.slice(idx, idx + query.length)}</span>
      <span>{text.slice(idx + query.length)}</span>
    </>
  )
}

export function ProductAutocomplete({ value, onChange, onSelect, className, containerClassName, categoryId, ...props }) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const [dropPos, setDropPos] = useState(null)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase()
    if (!q) return []
    const pool = categoryId
      ? allProducts.filter(p => p.categoryId === categoryId)
      : allProducts
    return pool.filter(p => p.name.toLowerCase().includes(q)).slice(0, 10)
  }, [value, categoryId])

  // Posição do dropdown (portal com fixed para escapar de overflow:hidden)
  useEffect(() => {
    if (open && inputRef.current) {
      const r = inputRef.current.getBoundingClientRect()
      setDropPos({ top: r.bottom + 4, left: r.left, width: Math.max(r.width, 300) })
    }
  }, [open, value])

  // Reset highlight ao mudar sugestões
  useEffect(() => { setHighlighted(0) }, [suggestions.length])

  // Fechar ao clicar fora
  useEffect(() => {
    function onOutside(e) {
      if (
        !inputRef.current?.contains(e.target) &&
        !dropdownRef.current?.contains(e.target)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  const select = (product) => {
    onChange(product.name)
    onSelect?.(product)
    setOpen(false)
  }

  const handleKeyDown = (e) => {
    if (!open || !suggestions.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' && suggestions[highlighted]) {
      e.preventDefault()
      select(suggestions[highlighted])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const dropdown = open && suggestions.length > 0 && dropPos &&
    createPortal(
      <div
        ref={dropdownRef}
        style={{
          position: 'fixed',
          top: dropPos.top,
          left: dropPos.left,
          width: dropPos.width,
          zIndex: 9999,
        }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl overflow-hidden"
      >
        {suggestions.map((product, i) => (
          <button
            key={product.name}
            type="button"
            onMouseDown={e => { e.preventDefault(); select(product) }}
            onMouseEnter={() => setHighlighted(i)}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm text-left transition-colors ${
              i === highlighted
                ? 'bg-primary/10 dark:bg-primary/20'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <span className="text-gray-900 dark:text-gray-100">
              <HighlightMatch text={product.name} query={value} />
            </span>
            <span className="text-xs text-muted-foreground shrink-0 ml-4">
              {subMap[product.subcategoryId]}
            </span>
          </button>
        ))}
      </div>,
      document.body
    )

  return (
    <div className={cn('relative flex-1 min-w-0', containerClassName)}>
      <input
        ref={inputRef}
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => value.trim() && setOpen(true)}
        onKeyDown={handleKeyDown}
        className={className}
        {...props}
      />
      {dropdown}
    </div>
  )
}
