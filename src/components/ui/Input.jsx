import { forwardRef } from 'react'
import { cn } from '@/utils'

export const Input = forwardRef(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className,
  wrapperClassName,
  ...props
}, ref) => (
  <div className={cn('flex flex-col gap-1', wrapperClassName)}>
    {label && (
      <label className="text-sm font-medium text-slate-700">
        {label}
        {props.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          {leftIcon}
        </div>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-3 py-2 rounded-lg border text-sm placeholder:text-slate-400 transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400',
          'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
          error ? 'border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-400' : 'border-surface-border bg-white',
          leftIcon  && 'pl-9',
          rightIcon && 'pr-9',
          className
        )}
        {...props}
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          {rightIcon}
        </div>
      )}
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
    {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
  </div>
))

Input.displayName = 'Input'

export const Textarea = forwardRef(({ label, error, hint, className, wrapperClassName, ...props }, ref) => (
  <div className={cn('flex flex-col gap-1', wrapperClassName)}>
    {label && (
      <label className="text-sm font-medium text-slate-700">
        {label}
        {props.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <textarea
      ref={ref}
      className={cn(
        'w-full px-3 py-2 rounded-lg border text-sm placeholder:text-slate-400 transition-all duration-150 resize-vertical min-h-[100px]',
        'focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400',
        error ? 'border-red-400 bg-red-50' : 'border-surface-border bg-white',
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
    {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
  </div>
))

Textarea.displayName = 'Textarea'
