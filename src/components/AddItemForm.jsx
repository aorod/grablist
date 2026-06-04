import { useState } from 'react'
import { ProductAutocomplete } from '@/components/ProductAutocomplete'
import { QuantityInput } from '@/components/QuantityInput'
import { PriceInput } from '@/components/PriceInput'
import { formatCurrency } from '@/lib/utils'
import { Check, X } from 'lucide-react'

const empty = { product: '', qty: 1, unitPrice: 0 }

export function AddItemForm({ onAdd, onCancel, categoryId }) {
  const [form, setForm] = useState(empty)

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const previewTotal = (form.qty || 0) * (form.unitPrice || 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.product.trim()) return
    onAdd(form)
    setForm(empty)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-1">
      {/* Mobile layout */}
      <div className="flex flex-col gap-2 md:hidden">
        <ProductAutocomplete
          value={form.product}
          onChange={v => set('product', v)}
          onSelect={p => set('qty', p.qty)}
          placeholder="Nome do produto..."
          autoFocus
          categoryId={categoryId}
          className="w-full h-9 px-2 text-sm border border-input rounded-md bg-transparent outline-none focus:ring-1 focus:ring-ring dark:bg-gray-900 dark:border-gray-600"
        />
        <div className="flex items-center gap-2">
          <QuantityInput value={form.qty} onChange={v => set('qty', v)} />
          <PriceInput value={form.unitPrice} onChange={v => set('unitPrice', v)} />
          <span className={`flex-1 text-center text-sm font-semibold ${
            previewTotal > 0 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground/30'
          }`}>
            {formatCurrency(previewTotal)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-md bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white text-sm font-medium transition-colors"
          >
            <Check size={14} />
            Adicionar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors"
          >
            <X size={14} />
            Cancelar
          </button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex items-center gap-2">
        <ProductAutocomplete
          value={form.product}
          onChange={v => set('product', v)}
          onSelect={p => set('qty', p.qty)}
          placeholder="Nome do produto..."
          categoryId={categoryId}
          className="w-full h-8 px-2 text-sm border border-input rounded-md bg-transparent outline-none focus:ring-1 focus:ring-ring dark:bg-gray-900 dark:border-gray-600"
        />
        <QuantityInput value={form.qty} onChange={v => set('qty', v)} />
        <PriceInput value={form.unitPrice} onChange={v => set('unitPrice', v)} />
        <span className={`w-24 text-center text-sm font-semibold shrink-0 ${
          previewTotal > 0 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground/30'
        }`}>
          {formatCurrency(previewTotal)}
        </span>
        <div className="w-48 shrink-0 flex items-center gap-1.5">
          <button
            type="submit"
            className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-md bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white text-xs font-medium transition-colors"
          >
            <Check size={13} />
            Adicionar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-medium transition-colors"
          >
            <X size={13} />
            Cancelar
          </button>
        </div>
      </div>
    </form>
  )
}
