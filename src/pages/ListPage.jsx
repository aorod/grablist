import { useState, useMemo } from 'react'
import { useDarkMode } from '@/hooks/useDarkMode'
import { catalog } from '@/data/catalog'
import { CategorySection } from '@/components/CategorySection'
import { CatalogSearchResults } from '@/components/CatalogSearchResults'
import { ProductModal } from '@/components/ProductModal'
import { CartList } from '@/components/CartList'
import { formatCurrency } from '@/lib/utils'
import { Moon, Sun, Search, X } from 'lucide-react'

const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36)

export function ListPage() {
  const { dark, toggle } = useDarkMode()
  const [searchQuery, setSearchQuery] = useState('')
  const [modalState, setModalState] = useState(null)
  const [cartItems, setCartItems] = useState([])

  const hasCart = cartItems.length > 0
  const cartTotal = cartItems.reduce((sum, i) => sum + (i.qty || 0) * (i.unitPrice || 0), 0)

  const addedSet = useMemo(
    () => new Set(cartItems.map(i => `${i.categoryId}:${i.product}`)),
    [cartItems]
  )

  const handleProductClick = ({ product, category }) => {
    setModalState({ product, category, initialQty: 1, initialUnitPrice: '' })
  }

  const handleEditItem = (item) => {
    setModalState({
      product: { name: item.product },
      category: { id: item.categoryId, name: item.categoryName, icon: item.categoryIcon },
      editId: item.id,
      initialQty: item.qty,
      initialUnitPrice: item.unitPrice,
    })
  }

  const handleModalAdd = ({ qty, unitPrice }) => {
    if (modalState.editId) {
      setCartItems(prev =>
        prev.map(item =>
          item.id === modalState.editId ? { ...item, qty, unitPrice } : item
        )
      )
    } else {
      setCartItems(prev => [...prev, {
        id: uid(),
        product: modalState.product.name,
        categoryId: modalState.category.id,
        categoryName: modalState.category.name,
        categoryIcon: modalState.category.icon,
        qty,
        unitPrice,
      }])
    }
  }

  const handleRemoveFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header fixo */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={`${import.meta.env.BASE_URL}grablisticon.png`} alt="GrabList" className="w-10 h-10 object-contain" />
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">GrabList</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggle}
              title={dark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="text-right">
              <p className="text-xs text-muted-foreground leading-none mb-0.5">Total</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400 leading-none">
                {formatCurrency(cartTotal)}
              </p>
            </div>
          </div>
        </div>

        {/* Campo de pesquisa */}
        <div className="max-w-6xl mx-auto px-4 pb-3">
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-3 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar produto..."
              className="w-full h-9 pl-9 pr-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className={hasCart ? 'grid grid-cols-[1fr_300px] gap-6 items-start' : 'max-w-4xl mx-auto'}>
          {/* Coluna principal */}
          <div className="space-y-4">
            {searchQuery.trim() ? (
              <CatalogSearchResults
                query={searchQuery}
                addedSet={addedSet}
                onProductClick={handleProductClick}
              />
            ) : (
              catalog.map(cat => (
                <CategorySection
                  key={cat.id}
                  category={cat}
                  addedSet={addedSet}
                  onProductClick={handleProductClick}
                />
              ))
            )}
          </div>

          {/* Painel lateral da lista */}
          {hasCart && (
            <div className="sticky top-[116px]">
              <CartList
                items={cartItems}
                onRemove={handleRemoveFromCart}
                onEdit={handleEditItem}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalState && (
        <ProductModal
          product={modalState.product}
          category={modalState.category}
          initialQty={modalState.initialQty}
          initialUnitPrice={modalState.initialUnitPrice}
          isEditing={!!modalState.editId}
          onAdd={handleModalAdd}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  )
}
