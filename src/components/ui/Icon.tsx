import type { SVGProps } from 'react'
import type { Afflatus, DamageType, Role } from '../../types'

export type IconCategory = 'afflatus' | 'damage' | 'role' | 'rarity'

export type IconValue = Afflatus | DamageType | Role
  | number
  | '2' | '3' | '4' | '5' | '6' | '2-star' | '3-star' | '4-star' | '5-star' | '6-star'

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  category: IconCategory
  value: IconValue
  label?: string
  size?: number
}

const iconPaths: Record<string, string> = {
  beast: 'M12 3 4 8l2 11 6 3 6-3 2-11-8-5Zm-4 8h.01M16 11h.01M9 16c2 1 4 1 6 0',
  mineral: 'm12 3 8 6-3 11H7L4 9l8-6Zm0 0v17m-8-11 8 5 8-5',
  plant: 'M12 21V11m0 5c-5 0-8-3-8-8 5 0 8 3 8 8Zm0-3c0-5 3-8 8-8 0 5-3 8-8 8Z',
  star: 'm12 2 2.7 6.3 6.8.6-5.2 4.5 1.6 6.7-5.9-3.6-5.9 3.6 1.6-6.7L2.5 8.9l6.8-.6L12 2Z',
  spirit: 'M12 3c4 4 7 7 7 11a7 7 0 1 1-14 0c0-4 3-7 7-11Zm0 8c-2 2-3 3-3 5a3 3 0 0 0 6 0c0-2-1-3-3-5Z',
  intellect: 'M12 3a7 7 0 0 0-4 13v3h8v-3a7 7 0 0 0-4-13Zm-3 19h6m-5-6h4M12 1v2m9 2-2 2M3 5l2 2m14 8h3M2 15h3',
  reality: 'M4 4h16v16H4zM8 8h8v8H8z',
  mental: 'M12 3a7 7 0 0 0-4 13v4h8v-4a7 7 0 0 0-4-13Zm-3 7h.01M15 10h.01M9 14c2 1 4 1 6 0',
  dps: 'm14 4 6 6M4 20l5-1 11-11-4-4L5 15l-1 5Zm2-2 2 2',
  support: 'M12 3v18M3 12h18M5.6 5.6l12.8 12.8m0-12.8L5.6 18.4',
  healer: 'M12 21s-8-5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6-8 11-8 11Zm0-12v6m-3-3h6',
  burstdmg: 'm13 2 2 7h7l-6 4 2 8-6-5-6 5 2-8-6-4h7l2-7Z',
  subdps: 'm14 4 6 6M4 20l5-1 11-11-4-4L5 15l-1 5Zm2-2 2 2',
  maincarry: 'm14 4 6 6M4 20l5-1 11-11-4-4L5 15l-1 5Zm2-2 2 2',
  dynamo: 'M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1m0-14.2L17 7M7 17l-2.1 2.1M12 7l2 5h-4l2 5',
  extraaction: 'M5 8h11l-3-3m6 11H8l3 3m8-3a7 7 0 0 0-2-5M5 8a7 7 0 0 0 2 5',
  burn: 'M12 22a7 7 0 0 0 7-7c0-3-2-5-4-7 0 3-2 4-2 4 0-5-3-8-6-10 1 5-3 7-3 13a8 8 0 0 0 8 7Z',
  poison: 'M12 22s8-8 8-13a8 8 0 0 0-16 0c0 5 8 13 8 13Zm-2-13h.01M14 9h.01M9 13c2 1 4 1 6 0',
  dispeller: 'M4 19 16 7m-4-4 9 9-4 4-9-9 4-4Zm-8 8 8 8',
  assassination: 'M4 20 19 5m-5-2 7 7m-9-2 4 4',
  sustain: 'M12 3 20 6v6c0 5-3 8-8 10-5-2-8-5-8-10V6l8-3Zm-4 9 3 3 5-6',
  barrier: 'M4 4h16v16H4zM8 8h8v8H8z',
  teambuffs: 'M12 3v18m-9-9h18m-14-6 10 12M17 6 7 18',
  conduit: 'M5 5h4v4H5zm10 10h4v4h-4zM9 7h6m2 2v6M7 9v6m2 2h6',
  riposte: 'M5 4h6v6H5zm8 10 6-6m-3 0h3v3m-7-1 4 4-4 4-4-4',
  shield: 'M12 3 20 6v6c0 5-3 8-8 10-5-2-8-5-8-10V6l8-3Zm-4 9 3 3 5-6',
  lingeringglow: 'M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1m0-14.2L17 7M7 17l-2.1 2.1M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
  allrounder: 'm12 2 2.7 6.3 6.8.6-5.2 4.5 1.6 6.7-5.9-3.6-5.9 3.6 1.6-6.7L2.5 8.9l6.8-.6L12 2Z',
  fallback: 'M12 2 22 12 12 22 2 12 12 2Zm-3 10h6',
}

const allowedValues: Record<IconCategory, readonly string[]> = {
  afflatus: ['beast', 'mineral', 'plant', 'star', 'spirit', 'intellect'],
  damage: ['reality', 'mental'],
  role: [
    'dps', 'burstdmg', 'healer', 'support', 'subdps', 'maincarry', 'dynamo', 'extraaction',
    'burn', 'poison', 'dispeller', 'assassination', 'sustain', 'barrier', 'teambuffs',
    'conduit', 'riposte', 'shield', 'lingeringglow', 'allrounder',
  ],
  rarity: [],
}

function rarityPath(value: string) {
  const count = Number(value.match(/\d+/)?.[0])
  if (!Number.isInteger(count) || count < 2 || count > 6) return iconPaths.fallback
  return Array.from({ length: count }, (_, index) => {
    const columns = count > 3 ? Math.ceil(count / 2) : count
    const rows = count > 3 ? 2 : 1
    const column = index % columns
    const row = Math.floor(index / columns)
    const x = 12 + (column - (columns - 1) / 2) * 7
    const y = rows === 1 ? 12 : 9 + row * 7
    return `M${x} ${y - 3}l.9 2 2.2.3-1.6 1.5.4 2.2-1.9-1-1.9 1 .4-2.2-1.6-1.5 2.2-.3L${x} ${y - 3}Z`
  }).join(' ')
}

export function Icon({
  category,
  value,
  label,
  size = 24,
  className = '',
  ...props
}: IconProps) {
  const key = String(value).toLowerCase().trim().replace(/[\s_-]+/g, '')
  const path = category === 'rarity'
    ? rarityPath(key)
    : allowedValues[category].includes(key) ? iconPaths[key] : iconPaths.fallback

  return (
    <svg
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`ui-icon${className ? ` ${className}` : ''}`}
      fill="none"
      height={size}
      role={label ? 'img' : undefined}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      <path d={path} />
    </svg>
  )
}
