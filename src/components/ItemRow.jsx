import { useList } from '@/hooks/useList'
import { ProductAutocomplete } from '@/components/ProductAutocomplete'
import { QuantityInput } from '@/components/QuantityInput'
import { PriceInput } from '@/components/PriceInput'
import { formatCurrency } from '@/lib/utils'
import { Trash2 } from 'lucide-react'

export function ItemRow({ item, categoryId, subcategoryId }) {
  const { updateItem, removeItem } = useList()

  const update = (field, value) =>
    updateItem(categoryId, subcategoryId, item.id, { [field]: value })

  const total = (item.qty || 0) * (item.unitPrice || 0)

  return (
    <>
      {/* Mobile layout */}
      <div className="flex flex-col gap-1.5 py-2 px-2 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors md:hidden">
        <ProductAutocomplete
          value={item.product}
          onChange={v => update('product', v)}
          onSelect={p => { update('product', p.name); update('qty', p.qty) }}
          categoryId={categoryId}
          className="w-full bg-transparent border-none outline-none text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-1 focus:ring-ring focus:rounded px-1"
          placeholder="Produto"
        />
        <div className="flex items-center gap-2">
          <QuantityInput value={item.qty} onChange={v => update('qty', v)} transparent />
          <PriceInput value={item.unitPrice || ''} onChange={v => update('unitPrice', v)} transparent />
          <span className={`flex-1 text-center text-sm font-semibold ${
            total > 0 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground/40'
          }`}>
            {formatCurrency(total)}
          </span>
          <button
            type="button"
            onClick={() => removeItem(categoryId, subcategoryId, item.id)}
            className="h-8 w-8 flex items-center justify-center rounded-md bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-colors shrink-0"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex items-center gap-2 py-1.5 px-2 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <ProductAutocomplete
          value={item.product}
          onChange={v => update('product', v)}
          onSelect={p => { update('product', p.name); update('qty', p.qty) }}
          categoryId={categoryId}
          className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-1 focus:ring-ring focus:rounded px-1"
          placeholder="Produto"
        />
        <QuantityInput value={item.qty} onChange={v => update('qty', v)} transparent />
        <PriceInput value={item.unitPrice || ''} onChange={v => update('unitPrice', v)} transparent />
        <span className={`w-24 text-center text-sm font-semibold shrink-0 ${
          total > 0 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground/40'
        }`}>
          {formatCurrency(total)}
        </span>
        <div className="w-48 shrink-0 flex items-center justify-end">
          <button
            type="button"
            onClick={() => removeItem(categoryId, subcategoryId, item.id)}
            className="h-8 px-3 flex items-center gap-1.5 rounded-md bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 text-xs font-medium transition-colors"
          >
            <Trash2 size={13} />
            Excluir
          </button>
        </div>
      </div>
    </>
  )
}
