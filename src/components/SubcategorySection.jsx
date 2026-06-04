import { useState } from 'react'
import { useList } from '@/hooks/useList'
import { ItemRow } from '@/components/ItemRow'
import { AddItemForm } from '@/components/AddItemForm'
import { Plus } from 'lucide-react'

export function SubcategorySection({ subcategory, categoryId }) {
  const [showForm, setShowForm] = useState(false)
  const { addItem } = useList()

  const handleAdd = (item) => {
    addItem(categoryId, subcategory.id, item)
    setShowForm(false)
  }

  const hasItems = subcategory.items.length > 0
  const showHeaders = hasItems || showForm

  return (
    <div className="px-4 py-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
        {subcategory.name}
      </h3>

      {/* Cabeçalho das colunas (visível quando há itens OU form aberto) */}
      {showHeaders && (
        <div className="hidden md:flex items-center gap-2 px-2 mb-1 text-xs text-muted-foreground/60 select-none">
          <span className="flex-1">Produto</span>
          <span className="w-28 text-center">Qtd</span>
          <span className="w-28 text-center">Preço</span>
          <span className="w-24 text-center">Total</span>
          <span className="w-48 shrink-0" />
        </div>
      )}

      {/* Itens adicionados */}
      {hasItems && (
        <div className="space-y-0.5 mb-2">
          {subcategory.items.map(item => (
            <ItemRow
              key={item.id}
              item={item}
              categoryId={categoryId}
              subcategoryId={subcategory.id}
            />
          ))}
        </div>
      )}

      {/* Form de adição ou botão */}
      {showForm ? (
        <AddItemForm onAdd={handleAdd} onCancel={() => setShowForm(false)} categoryId={categoryId} />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors py-1"
        >
          <Plus size={13} />
          Adicionar item
        </button>
      )}
    </div>
  )
}
