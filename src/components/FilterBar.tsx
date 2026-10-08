import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { DAMAGE_VALUES } from '../types'
import type { CharacterFilters, CharacterSort, Role } from '../types'
import { AFFLATUS_VALUES } from '../types'
import { useScrollLock } from '../scroll/useScrollLock'
import { Chip } from './ui'

interface FilterBarProps {
  filters: CharacterFilters
  rarities: number[]
  roles: Role[]
  onChange: (filters: CharacterFilters) => void
}

export function FilterBar({ filters, rarities, roles, onChange }: FilterBarProps) {
  const [open, setOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)
  useScrollLock(open)
  const selectedRoles = filters.roles ?? []

  useEffect(() => {
    if (open) drawerRef.current?.querySelector<HTMLElement>('input, button, select')?.focus()
    else if (wasOpen.current) toggleRef.current?.focus()
    wasOpen.current = open
  }, [open])

  const handleDrawerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }
    if (event.key !== 'Tab') return
    const items = Array.from(drawerRef.current?.querySelectorAll<HTMLElement>(
      'input:not(:disabled), button:not(:disabled), select:not(:disabled)',
    ) ?? [])
    const first = items[0]
    const last = items[items.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  return (
    <section aria-label="Character filters" className="filter-bar">
      <button
        aria-controls="character-filter-controls"
        aria-expanded={open}
        className="filter-bar__toggle"
        onClick={() => setOpen((value) => !value)}
        ref={toggleRef}
        type="button"
      >
        {open ? 'Close filters' : 'Filter & sort'}
      </button>
      <div
        aria-labelledby="filter-drawer-heading"
        aria-modal={open || undefined}
        className={`filter-bar__drawer${open ? ' is-open' : ''}`}
        data-lenis-prevent
        id="character-filter-controls"
        onKeyDown={handleDrawerKeyDown}
        ref={drawerRef}
        role={open ? 'dialog' : undefined}
      >
        <div className="filter-bar__top">
          <p id="filter-drawer-heading">Filter the archive</p>
          <button aria-label="Close filters" className="filter-bar__close" onClick={() => setOpen(false)} type="button">×</button>
        </div>
        <label className="filter-bar__search">
          <span>Name search</span>
          <input
            onChange={(event) => onChange({ search: event.currentTarget.value || undefined })}
            placeholder="Search dossiers"
            type="search"
            value={filters.search ?? ''}
          />
        </label>
        <div aria-label="Filter by Afflatus" className="filter-group" role="group">
          <span>Afflatus</span>
          <Chip onPressedChange={(pressed) => pressed && onChange({ afflatus: undefined })} pressed={!filters.afflatus}>All</Chip>
          {AFFLATUS_VALUES.map((value) => (
            <Chip key={value} onPressedChange={(pressed) => onChange({ afflatus: pressed ? value : undefined })} pressed={filters.afflatus === value}>{value}</Chip>
          ))}
        </div>
        <div aria-label="Filter by rarity" className="filter-group" role="group">
          <span>Rarity</span>
          <Chip onPressedChange={(pressed) => pressed && onChange({ rarity: undefined })} pressed={filters.rarity === undefined}>All</Chip>
          {rarities.map((value) => (
            <Chip key={value} onPressedChange={(pressed) => onChange({ rarity: pressed ? value : undefined })} pressed={filters.rarity === value}>{value}★</Chip>
          ))}
        </div>
        <div aria-label="Filter by damage type" className="filter-group" role="group">
          <span>Damage</span>
          <Chip onPressedChange={(pressed) => pressed && onChange({ damage: undefined })} pressed={!filters.damage}>All</Chip>
          {DAMAGE_VALUES.map((value) => (
            <Chip key={value} onPressedChange={(pressed) => onChange({ damage: pressed ? value : undefined })} pressed={filters.damage === value}>{value}</Chip>
          ))}
        </div>
        <div aria-label="Filter by role" className="filter-group" role="group">
          <span>Role</span>
          {roles.map((role) => {
            const pressed = selectedRoles.includes(role)
            return (
              <Chip
                key={role}
                onPressedChange={(next) => onChange({ roles: next
                  ? [...selectedRoles, role]
                  : selectedRoles.filter((item) => item !== role) })}
                pressed={pressed}
              >
                {role}
              </Chip>
            )
          })}
        </div>
        <label className="filter-bar__sort">
          <span>Sort by</span>
          <select onChange={(event) => onChange({ sort: event.currentTarget.value as CharacterSort })} value={filters.sort ?? 'name'}>
            <option value="name">Name A–Z</option>
            <option value="release-new">Release version · Newest</option>
            <option value="release-old">Release version · Oldest</option>
            <option value="rarity">Rarity · Highest</option>
            <option value="tier">My Tier</option>
          </select>
        </label>
      </div>
      {open && <button aria-label="Close filter drawer" className="filter-bar__scrim" onClick={() => setOpen(false)} type="button" />}
    </section>
  )
}
