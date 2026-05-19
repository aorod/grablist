import { useMemo, useState } from 'react'
import { catalog } from '@/data/catalog'
import { ChevronDown, ChevronUp } from 'lucide-react'

function ProductBadge({ name, query, isAdded, onClick }) {
  const q = query.trim().toLowerCase()
  const isMatch = q && name.toLowerCase().includes(q)

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
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm border transition-colors hover:opacity-75 ${
        isMatch
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
      }`}
    >
      {name}
    </button>
  )
}

function CategoryBadgeSection({ category, query, addedSet, onProductClick }) {
  const [open, setOpen] = useState(true)
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
          ? <ChevronUp size={16} className="text-muted-foreground" />
          : <ChevronDown size={16} className="text-muted-foreground" />
        }
      </button>

      {open && (
        <div className="px-5 pb-4 flex flex-wrap gap-2">
          {products.map(p => (
            <ProductBadge
              key={p.name}
              name={p.name}
              query={query}
              isAdded={addedSet.has(`${category.id}:${p.name}`)}
              onClick={() => onProductClick({ product: p, category })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CatalogSearchResults({ query, addedSet, onProductClick }) {
  const { matchingCategories, totalProducts } = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return { matchingCategories: [], totalProducts: 0 }

    let total = 0
    const cats = catalog.filter(cat => {
      const count = cat.subcategories
        .flatMap(s => s.products)
        .filter(p => p.name.toLowerCase().includes(q)).length
      total += count
      return count > 0
    })

    return { matchingCategories: cats, totalProducts: total }
  }, [query])

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {matchingCategories.length === 0
          ? `Nenhum produto encontrado para "${query}"`
          : `${matchingCategories.length} ${matchingCategories.length === 1 ? 'segmento' : 'segmentos'} · ${totalProducts} ${totalProducts === 1 ? 'produto' : 'produtos'}`
        }
      </p>
      {matchingCategories.map(cat => (
        <CategoryBadgeSection
          key={cat.id}
          category={cat}
          query={query}
          addedSet={addedSet}
          onProductClick={onProductClick}
        />
      ))}
    </div>
  )
}
