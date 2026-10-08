import type { ButtonHTMLAttributes, Ref } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  ref?: Ref<HTMLButtonElement>
}

export function Button({ variant = 'primary', className = '', ref, ...props }: ButtonProps) {
  return (
    <button
      className={`ui-button ui-button--${variant}${className ? ` ${className}` : ''}`}
      ref={ref}
      {...props}
    />
  )
}
