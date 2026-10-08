import type { CSSProperties, HTMLAttributes } from 'react'

export type StickerTone = 'brass' | 'oxblood' | 'verdigris' | 'parchment'

interface StickerProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: StickerTone
  tilt?: number
}

export function Sticker({
  tone = 'brass',
  tilt = -2,
  className = '',
  style,
  ...props
}: StickerProps) {
  return (
    <span
      className={`ui-sticker ui-sticker--${tone}${className ? ` ${className}` : ''}`}
      style={{ ...style, transform: `rotate(${tilt}deg)` } as CSSProperties}
      {...props}
    />
  )
}
