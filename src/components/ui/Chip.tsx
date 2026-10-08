import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onChange'> {
  children: ReactNode
  pressed: boolean
  onPressedChange: (pressed: boolean) => void
}

export function Chip({
  children,
  pressed,
  onPressedChange,
  className = '',
  onClick,
  ...props
}: ChipProps) {
  return (
    <button
      aria-pressed={pressed}
      className={`ui-chip${pressed ? ' is-pressed' : ''}${className ? ` ${className}` : ''}`}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) onPressedChange(!pressed)
      }}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
