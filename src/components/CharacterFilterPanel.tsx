import { useState } from 'react'
import { AFFLATUS_VALUES, DAMAGE_VALUES } from '../types'
import type { CharacterFilters, CharacterSort, Role } from '../types'
import { Chip, Icon, Rarity } from './ui'

interface CharacterFilterPanelProps {
  filters: CharacterFilters
  rarities: number[]
  commonRoles: Role[]
  additionalRoles: Role[]
  open: boolean
  onChange: (filters: CharacterFilters) => void
}

export function CharacterFilterPanel({
  filters,
  rarities,
  commonRoles,
  additionalRoles,
  open,
  onChange,
}: CharacterFilterPanelProps) {
  const selectedRoles = filters.roles ?? []
  const selectedRoleSet = new Set(selectedRoles)
  const [showMoreRoles, setShowMoreRoles] = useState(false)
  const revealMoreRoles = showMoreRoles || additionalRoles.some((role) => selectedRoleSet.has(role))
  const renderRole = (role: Role) => (
    <Chip
      key={role}
      onPressedChange={(next) => onChange({ roles: next
        ? [...selectedRoles, role]
        : selectedRoles.filter((item) => item !== role) })}
      pressed={selectedRoleSet.has(role)}
    >
      <Icon category="role" value={role} />
    </Chip>
  )

  return (
    <div
      aria-label="Character filter controls"
      className={`filter-bar__panel${open ? ' is-open' : ''}`}
      data-lenis-prevent
      hidden={!open}
      id="character-filter-controls"
      role="group"
    >
      <div className="filter-row">
        <label className="filter-row__label" htmlFor="character-name-search">Name search</label>
        <input
          className="filter-row__search"
          id="character-name-search"
          onChange={(event) => onChange({ search: event.currentTarget.value || undefined })}
          placeholder="Search dossiers"
          type="search"
          value={filters.search ?? ''}
        />
      </div>
      <div className="filter-row">
        <span className="filter-row__label" id="filter-afflatus-label">Afflatus</span>
        <div aria-labelledby="filter-afflatus-label" className="filter-row__chips" role="group">
          <Chip onPressedChange={(pressed) => pressed && onChange({ afflatus: undefined })} pressed={!filters.afflatus}>All</Chip>
          {AFFLATUS_VALUES.map((value) => (
            <Chip key={value} onPressedChange={(pressed) => onChange({ afflatus: pressed ? value : undefined })} pressed={filters.afflatus === value}><Icon category="afflatus" value={value} /></Chip>
          ))}
        </div>
      </div>
      <div className="filter-row">
        <span className="filter-row__label" id="filter-rarity-label">Rarity</span>
        <div aria-labelledby="filter-rarity-label" className="filter-row__chips" role="group">
          <Chip onPressedChange={(pressed) => pressed && onChange({ rarity: undefined })} pressed={filters.rarity === undefined}>All</Chip>
          {rarities.map((value) => (
            <Chip key={value} onPressedChange={(pressed) => onChange({ rarity: pressed ? value : undefined })} pressed={filters.rarity === value}><Rarity value={value} /></Chip>
          ))}
        </div>
      </div>
      <div className="filter-row">
        <span className="filter-row__label" id="filter-damage-label">Damage</span>
        <div aria-labelledby="filter-damage-label" className="filter-row__chips" role="group">
          <Chip onPressedChange={(pressed) => pressed && onChange({ damage: undefined })} pressed={!filters.damage}>All</Chip>
          {DAMAGE_VALUES.map((value) => (
            <Chip key={value} onPressedChange={(pressed) => onChange({ damage: pressed ? value : undefined })} pressed={filters.damage === value}><Icon category="damage" value={value} /></Chip>
          ))}
        </div>
      </div>
      <div className="filter-row">
        <span className="filter-row__label" id="filter-role-label">Role</span>
        <div aria-labelledby="filter-role-label" className="filter-row__chips" role="group">
          {commonRoles.map(renderRole)}
          {revealMoreRoles && additionalRoles.map(renderRole)}
          {additionalRoles.length > 0 && (
            <button
              aria-expanded={revealMoreRoles}
              className="filter-row__more-roles"
              onClick={() => setShowMoreRoles((shown) => !shown)}
              type="button"
            >
              {revealMoreRoles ? 'Fewer roles' : 'More roles'}
            </button>
          )}
        </div>
      </div>
      <div className="filter-row">
        <label className="filter-row__label" htmlFor="character-sort">Sort by</label>
        <select
          className="filter-row__select"
          id="character-sort"
          onChange={(event) => onChange({ sort: event.currentTarget.value as CharacterSort })}
          value={filters.sort ?? 'name'}
        >
          <option value="name">Name A–Z</option>
          <option value="release-new">Release version · Newest</option>
          <option value="release-old">Release version · Oldest</option>
          <option value="rarity">Rarity · Highest</option>
          <option value="tier">My Tier</option>
        </select>
      </div>
    </div>
  )
}
