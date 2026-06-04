import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useDarkMode } from '@/hooks/useDarkMode'
import { catalog } from '@/data/catalog'
import { CategorySection } from '@/components/CategorySection'
import { CatalogSearchResults } from '@/components/CatalogSearchResults'
import { ProductModal } from '@/components/ProductModal'
import { CartList } from '@/components/CartList'
import { ActionDialog } from '@/components/ActionDialog'
import { NavDropdown } from '@/components/NavDropdown'
import { downloadAsXls } from '@/lib/export'
import { formatCurrency } from '@/lib/utils'
import { Moon, Sun, Search, X, ShoppingCart, CheckCircle2 } from 'lucide-react'

const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36)

export function ListPage() {
  const { dark, toggle } = useDarkMode()
  const [searchQuery, setSearchQuery] = useState('')
  const [modalState, setModalState] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [showCartDrawer, setShowCartDrawer] = useState(false)

  // Diálogos de ação
  const [saveDialog, setSaveDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [savedToast, setSavedToast] = useState(null)

  useEffect(() => {
    if (!savedToast) return
    const t = setTimeout(() => setSavedToast(null), 3000)
    return () => clearTimeout(t)
  }, [savedToast])

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

  const handleSaveConfirm = (name) => {
    const saved = JSON.parse(localStorage.getItem('grablist_saved') || '[]')
    saved.push({ id: uid(), name, items: cartItems, savedAt: new Date().toISOString() })
    localStorage.setItem('grablist_saved', JSON.stringify(saved))
    setSavedToast(name)
  }

  const handleDeleteConfirm = () => {
    setCartItems([])
    setShowCartDrawer(false)
  }

  const handleDownload = () => {
    downloadAsXls(cartItems)
  }

  const cartActions = {
    onSave: () => setSaveDialog(true),
    onDelete: () => setDeleteDialog(true),
    onDownload: handleDownload,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <NavDropdown />
          <div className="flex items-center gap-1 sm:gap-4">
            {/* Botão da lista — apenas mobile */}
            {hasCart && (
              <button
                type="button"
                onClick={() => setShowCartDrawer(true)}
                title="Ver lista"
                className="relative lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart size={18} />
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-green-600 text-white text-[10px] font-bold px-0.5 leading-none">
                  {cartItems.length}
                </span>
              </button>
            )}

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
        <div className={hasCart ? 'grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start' : 'max-w-4xl mx-auto'}>
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

          {/* Painel lateral — apenas desktop */}
          {hasCart && (
            <div className="hidden lg:block lg:sticky lg:top-[116px]">
              <CartList
                items={cartItems}
                onRemove={handleRemoveFromCart}
                onEdit={handleEditItem}
                {...cartActions}
              />
            </div>
          )}
        </div>
      </div>

      {/* Drawer da lista — apenas mobile */}
      {showCartDrawer && createPortal(
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCartDrawer(false)}
          />
          <div className="relative bg-white dark:bg-gray-900 rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl">
            {/* Alça visual */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>

            {/* Header do sheet */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart size={15} className="text-muted-foreground" />
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                  Minha Lista
                </span>
                <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full px-2 py-0.5 border border-gray-200 dark:border-gray-700">
                  {cartItems.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowCartDrawer(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Conteúdo rolável */}
            <div className="flex-1 overflow-y-auto">
              <CartList
                items={cartItems}
                onRemove={handleRemoveFromCart}
                onEdit={(item) => {
                  setShowCartDrawer(false)
                  handleEditItem(item)
                }}
                {...cartActions}
              />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Diálogo — Salvar lista */}
      {saveDialog && (
        <ActionDialog
          title="Salvar lista"
          withInput
          inputLabel="Nome da lista"
          inputPlaceholder="Ex: Compras de sábado"
          confirmLabel="Salvar"
          cancelLabel="Cancelar"
          onConfirm={handleSaveConfirm}
          onClose={() => setSaveDialog(false)}
        />
      )}

      {/* Diálogo — Excluir lista */}
      {deleteDialog && (
        <ActionDialog
          title="Excluir lista"
          message="Tem certeza que deseja excluir todos os itens da lista? Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          confirmVariant="danger"
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteDialog(false)}
        />
      )}

      {/* Toast — lista salva */}
      {savedToast && createPortal(
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium px-4 py-3 rounded-xl shadow-2xl animate-fade-in-up pointer-events-none">
          <CheckCircle2 size={16} className="text-green-400 dark:text-green-600 shrink-0" />
          <span>Lista <strong>"{savedToast}"</strong> salva com sucesso!</span>
        </div>,
        document.body
      )}

      {/* Modal de produto */}
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
