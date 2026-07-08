import React from 'react'

export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm shadow-slate-200/70 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
