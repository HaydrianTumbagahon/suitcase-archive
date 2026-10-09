import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { CharacterFilters, Role } from '../types'
import { CharacterFilterPanel } from './CharacterFilterPanel'

interface FilterBarProps {
  filters: CharacterFilters
  rarities: number[]
  commonRoles: Role[]
  additionalRoles: Role[]
  resultCount: number
  activeFilterCount: number
  hasFilters: boolean
  onChange: (filters: CharacterFilters) => void
  onClear: () => void
}

export function FilterBar({
  filters,
  rarities,
  commonRoles,
  additionalRoles,
  resultCount,
  activeFilterCount,
  hasFilters,
  onChange,
  onClear,
}: FilterBarProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const closePanel = useCallback(() => {
    const panel = rootRef.current?.querySelector('.filter-bar__panel')
    if (panel?.contains(document.activeElement)) toggleRef.current?.focus({ preventScroll: true })
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return

    const openedAt = window.scrollY
    const handleOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closePanel()
    }
    const handlePageScroll = () => {
      if (Math.abs(window.scrollY - openedAt) > 40) closePanel()
    }

    document.addEventListener('pointerdown', handleOutsidePointer)
    window.addEventListener('scroll', handlePageScroll, { passive: true })

    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointer)
      window.removeEventListener('scroll', handlePageScroll)
    }
  }, [closePanel, open])

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      closePanel()
    }
  }

  return (
    <section aria-label="Character filters" className="filter-bar" onKeyDown={handleKeyDown} ref={rootRef}>
      <div className="filter-bar__toolbar">
        <button
          aria-controls="character-filter-controls"
          aria-expanded={open}
          className="filter-bar__toggle"
          onClick={() => setOpen((value) => !value)}
          ref={toggleRef}
          type="button"
        >
          <span>Filter the archive</span>
          {activeFilterCount > 0 && <span aria-label={`${activeFilterCount} active ${activeFilterCount === 1 ? 'filter' : 'filters'}`} className="filter-bar__count">{activeFilterCount}</span>}
        </button>
        <p aria-live="polite" className="filter-bar__results">
          {resultCount} {resultCount === 1 ? 'arcanist' : 'arcanists'} found
        </p>
        {hasFilters && (
          <button className="filter-bar__clear" onClick={onClear} type="button">Clear all</button>
        )}
      </div>
      <CharacterFilterPanel
        additionalRoles={additionalRoles}
        commonRoles={commonRoles}
        filters={filters}
        onChange={onChange}
        open={open}
        rarities={rarities}
      />
    </section>
  )
}
