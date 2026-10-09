import type { HTMLAttributes, ReactNode } from 'react'

interface PanelProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

export function Panel({ children, className = '', ...props }: PanelProps) {
  return (
    <article className={`ui-panel${className ? ` ${className}` : ''}`} {...props}>
      {children}
    </article>
  )
}
