import { useState } from 'react'
import { site } from '../../data'
import type { Afflatus, DamageType, Role } from '../../types'

export type IconCategory = 'afflatus' | 'damage' | 'role'
export type IconValue = Afflatus | DamageType | Role

interface IconProps {
  category: IconCategory
  value: IconValue
  className?: string
}

export function Icon({ category, value, className = '' }: IconProps) {
  const key = value.toLowerCase().replace(/[^a-z0-9]/g, '')
  const imagePath = category === 'role'
    ? site.icons.roles[key]
    : site.icons[category][key as keyof typeof site.icons[typeof category]]
  const [failedPath, setFailedPath] = useState<string | null>(null)

  return (
    <span className={`ui-icon${className ? ` ${className}` : ''}`}>
      {imagePath && imagePath !== failedPath && (
        <img
          alt=""
          aria-hidden="true"
          decoding="async"
          height={20}
          onError={() => setFailedPath(imagePath)}
          src={imagePath}
          width={20}
        />
      )}
      <span>{value}</span>
    </span>
  )
}
