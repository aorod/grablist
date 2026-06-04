import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronDown, Plus, BookOpen } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Criar Lista', path: '/', icon: Plus },
  { label: 'Visualizar Listas', path: '/saved', icon: BookOpen },
]

export function NavDropdown() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  const go = (path) => {
    navigate(path)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <img
          src={`${import.meta.env.BASE_URL}grablisticon.png`}
          alt="GrabList"
          className="w-10 h-10 object-contain"
        />
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">GrabList</h1>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-52 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden z-20">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
            const active = pathname === path
            return (
              <button
                key={path}
                type="button"
                onClick={() => go(path)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  active
                    ? 'bg-primary/5 dark:bg-primary/10 text-primary font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={15} className={active ? 'text-primary' : 'text-muted-foreground'} />
                {label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
