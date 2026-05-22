import React from 'react'

export default function Badge({ children, className = '' }) {
  return (
    <span className={`text-xs px-3 py-1 rounded-full ${className}`}>
      {children}
    </span>
  )
}
