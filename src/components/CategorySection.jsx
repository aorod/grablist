import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

function ProductBadge({ name, isAdded, onClick }) {
  if (isAdded) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm border bg-green-600 dark:bg-green-700 text-white border-green-600 dark:border-green-700 cursor-default select-none">
        {name}
      </span>
    )
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center px-3 py-1 rounded-full text-sm border bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 transition-colors hover:opacity-75"
    >
      {name}
    </button>
  )
}

export function CategorySection({ category, addedSet, onProductClick }) {
  const [open, setOpen] = useState(false)
  const products = category.subcategories.flatMap(s => s.products)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{category.icon}</span>
          <span className="font-bold text-gray-800 dark:text-gray-100 uppercase text-sm tracking-wide">
            {category.name}
          </span>
          <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full px-2 py-0.5 border border-gray-200 dark:border-gray-700">
            {products.length}
          </span>
        </div>
        {open
          ? <ChevronDown size={16} className="text-muted-foreground" />
          : <ChevronRight size={16} className="text-muted-foreground" />
        }
      </button>

      {open && (
        <div className="px-5 pt-1 pb-4 flex flex-wrap gap-2">
          {products.map(p => (
            <ProductBadge
              key={p.name}
              name={p.name}
              isAdded={addedSet.has(`${category.id}:${p.name}`)}
              onClick={() => onProductClick({ product: p, category })}
            />
          ))}
        </div>
      )}
    </div>
  )
}
