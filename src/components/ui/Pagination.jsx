import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils'

export const Pagination = ({ page, totalPages, onChange, className }) => {
  if (totalPages <= 1) return null

  const pages = []
  const delta = 2
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) pages.push(i)

  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-surface-border text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages[0] > 1 && (
        <>
          <PageBtn n={1} active={page === 1} onClick={() => onChange(1)} />
          {pages[0] > 2 && <span className="px-1 text-slate-400">…</span>}
        </>
      )}

      {pages.map(n => (
        <PageBtn key={n} n={n} active={page === n} onClick={() => onChange(n)} />
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="px-1 text-slate-400">…</span>}
          <PageBtn n={totalPages} active={page === totalPages} onClick={() => onChange(totalPages)} />
        </>
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg border border-surface-border text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

const PageBtn = ({ n, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      'min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors',
      active
        ? 'bg-brand-500 text-white shadow-sm'
        : 'border border-surface-border text-slate-600 hover:bg-slate-50'
    )}
  >
    {n}
  </button>
)
