import React from 'react'

export default function Badge({ children, className = '', variant = 'neutral' }) {
  const variants = {
    neutral:
      'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]',
    success:
      'border border-emerald-200 bg-emerald-50 text-emerald-700',
    warning:
      'border border-amber-200 bg-amber-50 text-amber-700',
    error:
      'border border-red-200 bg-red-50 text-red-700',
    primary:
      'border border-blue-200 bg-blue-50 text-[var(--color-primary)]',
  }

  return (
    <span className={`inline-flex min-h-6 items-center rounded-full px-3 py-1 text-xs font-bold leading-none ${variants[variant] || variants.neutral} ${className}`}>
      {children}
    </span>
  )
}
