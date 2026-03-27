import { cn } from '@/utils'

const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10', xl: 'w-16 h-16' }

export const Spinner = ({ size = 'md', className, fullScreen = false }) => {
  const spinner = (
    <svg
      className={cn('animate-spin text-brand-500', sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          <p className="text-sm text-slate-500 font-medium animate-pulse-soft">Loading…</p>
        </div>
      </div>
    )
  }

  return spinner
}

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner size="lg" />
  </div>
)

export const InlineLoader = ({ text = 'Loading…' }) => (
  <div className="flex items-center gap-2 text-slate-500 text-sm py-8 justify-center">
    <Spinner size="sm" />
    <span>{text}</span>
  </div>
)
