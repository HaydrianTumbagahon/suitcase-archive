import type { ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  label?: string
  className?: string
}

export function Marquee({ children, label = 'Archive announcement', className = '' }: MarqueeProps) {
  return (
    <div
      aria-label={label}
      className={`ui-marquee${className ? ` ${className}` : ''}`}
      role="region"
    >
      <div className="ui-marquee__track">
        <div className="ui-marquee__copy">{children}</div>
        <div aria-hidden="true" className="ui-marquee__copy ui-marquee__copy--duplicate">
          {children}
        </div>
      </div>
    </div>
  )
}
