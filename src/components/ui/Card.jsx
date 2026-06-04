import React from 'react'

export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-lg p-5 border border-gray-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
