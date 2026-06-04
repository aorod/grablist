import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export function ActionDialog({
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  confirmVariant = 'default',
  withInput = false,
  inputLabel = '',
  inputPlaceholder = '',
  onConfirm,
  onClose,
}) {
  const [inputValue, setInputValue] = useState('')

  const canConfirm = !withInput || inputValue.trim().length > 0

  const handleConfirm = () => {
    if (!canConfirm) return
    onConfirm(withInput ? inputValue.trim() : undefined)
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {message && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
          )}

          {withInput && (
            <div className="space-y-1.5">
              {inputLabel && (
                <p className="text-xs text-muted-foreground">{inputLabel}</p>
              )}
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleConfirm()}
                placeholder={inputPlaceholder}
                autoFocus
                className="w-full h-9 px-3 rounded-md border border-input dark:border-gray-600 bg-transparent text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 dark:bg-gray-800 transition-colors"
              />
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!canConfirm}
              className={`flex-1 h-9 rounded-md text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                confirmVariant === 'danger'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {confirmLabel}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-9 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors"
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
