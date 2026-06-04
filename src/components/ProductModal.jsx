import { useState } from 'react'
import { createPortal } from 'react-dom'
import { QuantityInput } from '@/components/QuantityInput'
import { PriceInput } from '@/components/PriceInput'
import { formatCurrency } from '@/lib/utils'
import { Check, X } from 'lucide-react'

export function ProductModal({ product, category, initialQty = 1, initialUnitPrice = '', isEditing = false, onAdd, onClose }) {
  const [qty, setQty] = useState(initialQty)
  const [unitPrice, setUnitPrice] = useState(initialUnitPrice)
  const total = (qty || 0) * (unitPrice || 0)

  const handleAdd = () => {
    onAdd({ qty, unitPrice })
    onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl w-full max-w-sm mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Nome do produto */}
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">{product.name}</h2>

          {/* Campos */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Qtd.</p>
              <QuantityInput value={qty} onChange={setQty} />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Preço</p>
              <PriceInput value={unitPrice} onChange={setUnitPrice} />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total</p>
              <span className={`w-24 h-9 flex items-center justify-center text-sm font-semibold shrink-0 ${
                total > 0 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground/40'
              }`}>
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Botões */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-md bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white text-xs font-medium transition-colors"
            >
              <Check size={13} />
              {isEditing ? 'Salvar' : 'Adicionar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-medium transition-colors"
            >
              <X size={13} />
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
