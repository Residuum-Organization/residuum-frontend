import React from 'react'

export default function Label({ children, className = '', ...props }) {
  return (
    <span
      className={`text-sm text-gray-500 ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
