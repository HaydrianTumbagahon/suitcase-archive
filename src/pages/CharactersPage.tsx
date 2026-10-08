import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CharacterCard } from '../components/CharacterCard'
import { FilterBar } from '../components/FilterBar'
import { filterAndSortCharacters, characters, site } from '../data'
import { AFFLATUS_VALUES, DAMAGE_VALUES } from '../types'
import type { CharacterFilters, CharacterSort, Role } from '../types'
import { Button } from '../components/ui'
import { PageFrame } from '../site/PageFrame'

const rarities = [...new Set(characters.flatMap(({ rarity }) => rarity === null ? [] : [rarity]))].sort((a, b) => a - b)
const sortValues: CharacterSort[] = ['name', 'release-new', 'release-old', 'rarity', 'tier']
const filterParams = ['q', 'afflatus', 'rarity', 'damage', 'role', 'sort']

function parseFilters(params: URLSearchParams): CharacterFilters {
  const rarity = Number(params.get('rarity'))
  const rawSort = params.get('sort')
  const afflatus = AFFLATUS_VALUES.find((value) => value === params.get('afflatus'))
  const damage = DAMAGE_VALUES.find((value) => value === params.get('damage'))
  return {
    search: params.get('q') || undefined,
    afflatus,
    rarity: rarities.includes(rarity) ? rarity : undefined,
    damage,
    roles: params.getAll('role').filter((role): role is Role => site.roles.some((candidate) => candidate === role)),
    sort: sortValues.find((sort) => sort === rawSort) ?? 'name',
  }
}

export default function CharactersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const serializedParams = searchParams.toString()
  const filters = useMemo(() => parseFilters(new URLSearchParams(serializedParams)), [serializedParams])
  const matches = useMemo(() => filterAndSortCharacters(filters), [filters])

  const updateFilters = (patch: CharacterFilters) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      for (const key of filterParams) next.delete(key)
      const updated = { ...parseFilters(current), ...patch }
      if (updated.search) next.set('q', updated.search)
      if (updated.afflatus) next.set('afflatus', updated.afflatus)
      if (updated.rarity !== undefined) next.set('rarity', String(updated.rarity))
      if (updated.damage) next.set('damage', updated.damage)
      updated.roles?.forEach((role) => next.append('role', role))
      if (updated.sort && updated.sort !== 'name') next.set('sort', updated.sort)
      return next
    }, { replace: true })
  }

  const clearFilters = () => setSearchParams((current) => {
    const next = new URLSearchParams(current)
    filterParams.forEach((key) => next.delete(key))
    return next
  }, { replace: true })
  const hasFilters = Boolean(filters.search || filters.afflatus || filters.rarity !== undefined
    || filters.damage || filters.roles?.length || (filters.sort && filters.sort !== 'name'))

  return (
    <PageFrame
      scene="SCENE 02 — DOSSIER ROOM"
      serial="INDEX / 001"
      title="Characters"
      intro="Browse the arcanists in the archive. Unconfirmed details remain marked as unverified."
    >
      <FilterBar filters={filters} onChange={updateFilters} rarities={rarities} roles={site.roles} />
      <div className="character-results">
        <div className="character-results__heading">
          <div>
            <p aria-live="polite" className="record-count">{matches.length} {matches.length === 1 ? 'arcanist' : 'arcanists'} found</p>
            <p className="character-archive-note">
              Archive holds {characters.length} of ~{site.totalCrewMembers} crew members. More arriving.
            </p>
          </div>
          <Button onClick={clearFilters} variant="secondary">Clear all</Button>
        </div>
      {matches.length > 0 ? (
        <ul className="character-grid">
          {matches.map((character) => (
            <li className="character-grid__item" key={character.id}>
              <CharacterCard character={character} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="character-empty">
          <span aria-hidden="true">⌕</span>
          <h2>The archive has no such arcanist</h2>
          <p>Try another name or clear the filters to return to the full index.</p>
          {hasFilters && <Button onClick={clearFilters} variant="secondary">Clear filters</Button>}
        </div>
      )}
      </div>
    </PageFrame>
  )
}
