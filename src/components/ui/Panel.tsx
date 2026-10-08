import type { HTMLAttributes, ReactNode } from 'react'

interface PanelProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  serial?: string | number
}

function formatSerial(serial: string | number) {
  const value = String(serial)
  return `No. ${value.padStart(4, '0')}`
}

export function Panel({ children, serial, className = '', ...props }: PanelProps) {
  return (
    <article className={`ui-panel${className ? ` ${className}` : ''}`} {...props}>
      {serial !== undefined && <span className="ui-panel__serial">{formatSerial(serial)}</span>}
      {children}
    </article>
  )
}
