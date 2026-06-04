import { useState } from 'react'
import { useDarkMode } from '@/hooks/useDarkMode'
import { NavDropdown } from '@/components/NavDropdown'
import { ActionDialog } from '@/components/ActionDialog'
import { downloadAsXls } from '@/lib/export'
import { formatCurrency } from '@/lib/utils'
import { Moon, Sun, Trash2, Download, ClipboardList, ChevronDown } from 'lucide-react'

function readSaved() {
  try {
    return JSON.parse(localStorage.getItem('grablist_saved') || '[]')
  } catch {
    return []
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function SavedListsPage() {
  const { dark, toggle } = useDarkMode()
  const [lists, setLists] = useState(readSaved)
  const [openId, setOpenId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const toggleAccordion = (id) =>
    setOpenId(prev => (prev === id ? null : id))

  const handleDelete = () => {
    const updated = lists.filter(l => l.id !== deleteTarget)
    localStorage.setItem('grablist_saved', JSON.stringify(updated))
    setLists(updated)
    if (openId === deleteTarget) setOpenId(null)
    setDeleteTarget(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <NavDropdown />
          <button
            type="button"
            onClick={toggle}
            title={dark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardList size={18} className="text-muted-foreground" />
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
            Listas Salvas
          </h2>
          {lists.length > 0 && (
            <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full px-2 py-0.5 border border-gray-200 dark:border-gray-700">
              {lists.length}
            </span>
          )}
        </div>

        {lists.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-12 flex flex-col items-center gap-3 text-center">
            <ClipboardList size={40} className="text-gray-300 dark:text-gray-700" />
            <p className="text-sm font-medium text-muted-foreground">Nenhuma lista salva</p>
            <p className="text-xs text-muted-foreground/70">
              Crie uma lista e salve-a para visualizar aqui.
            </p>
          </div>
        ) : (
          lists.map(list => {
            const isOpen = openId === list.id
            const total = list.items.reduce(
              (sum, i) => sum + (i.qty || 0) * (i.unitPrice || 0),
              0
            )

            return (
              <div
                key={list.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
              >
                {/* Gatilho do accordion */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(list.id)}
                  className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                      {list.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Salvo em {formatDate(list.savedAt)} · {list.items.length} {list.items.length === 1 ? 'item' : 'itens'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(total)}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* Conteúdo expandido */}
                {isOpen && (
                  <>
                    {/* Itens */}
                    <div className="border-t border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                      {list.items.map(item => {
                        const itemTotal = (item.qty || 0) * (item.unitPrice || 0)
                        return (
                          <div key={item.id} className="flex items-center gap-3 px-5 py-2.5">
                            <span className="text-base shrink-0">{item.categoryIcon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground truncate">
                                {item.categoryName}
                              </p>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {item.product}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs text-muted-foreground">
                                {item.qty} × {formatCurrency(item.unitPrice)}
                              </p>
                              {itemTotal > 0 && (
                                <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                                  {formatCurrency(itemTotal)}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Ações */}
                    <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                      <button
                        type="button"
                        onClick={() => downloadAsXls(list.items, list.name)}
                        className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-md bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 text-xs font-medium transition-colors"
                      >
                        <Download size={13} />
                        Baixar
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(list.id)}
                        className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-md bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-medium transition-colors"
                      >
                        <Trash2 size={13} />
                        Excluir
                      </button>
                    </div>
                  </>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Diálogo de confirmação de exclusão */}
      {deleteTarget && (
        <ActionDialog
          title="Excluir lista"
          message="Tem certeza que deseja excluir esta lista? Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          confirmVariant="danger"
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
