import { Pencil, Trash2, Save, Trash, Download } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export function CartList({ items, onRemove, onEdit, onSave, onDelete, onDownload }) {
  const grandTotal = items.reduce((sum, i) => sum + (i.qty || 0) * (i.unitPrice || 0), 0)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Cabeçalho */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <span className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
          Lista
        </span>
        <span className={`text-sm font-bold ${grandTotal > 0 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground/40'}`}>
          {formatCurrency(grandTotal)}
        </span>
      </div>

      {/* Botões de ação */}
      {(onSave || onDelete || onDownload) && (
        <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              title="Salvar lista"
              className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-md bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-medium transition-colors"
            >
              <Save size={13} />
              Salvar
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              title="Excluir lista"
              className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-md bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-medium transition-colors"
            >
              <Trash size={13} />
              Excluir
            </button>
          )}
          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              title="Baixar lista em Excel"
              className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-md bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 text-xs font-medium transition-colors"
            >
              <Download size={13} />
              Baixar
            </button>
          )}
        </div>
      )}

      {/* Itens */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-1 px-4 py-2.5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
                <span>{item.categoryIcon}</span>
                <span className="truncate">{item.categoryName}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {item.product}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.qty} × {formatCurrency(item.unitPrice)}
                {item.unitPrice > 0 && (
                  <span className="ml-1 font-semibold text-green-600 dark:text-green-400">
                    = {formatCurrency(item.qty * item.unitPrice)}
                  </span>
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onEdit(item)}
              className="shrink-0 h-7 w-7 flex items-center justify-center rounded-md text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <Pencil size={13} />
            </button>

            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="shrink-0 h-7 w-7 flex items-center justify-center rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
