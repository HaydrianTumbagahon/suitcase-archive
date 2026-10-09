import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { filterTierRecords, getCharacter, site, tierColumns, tierScale } from '../../data'
import type { Role, TierRecord } from '../../types'
import { Chip, Rarity, SmartImage } from '../ui'
import { useScrollLock } from '../../scroll/useScrollLock'

export function TierList({ role, onRoleChange }: { role: Role | null; onRoleChange: (role: Role | null) => void }) {
  const [selected, setSelected] = useState<TierRecord | null>(null)
  const returnFocusRef = useRef<HTMLButtonElement | null>(null)
  const wasOpenRef = useRef(false)
  const copy = site.metaPage
  const records = filterTierRecords(role ?? undefined)
  useScrollLock(selected !== null)

  useEffect(() => {
    if (selected) {
      wasOpenRef.current = true
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false
      returnFocusRef.current?.focus()
    }
  }, [selected])

  const openDetails = (entry: TierRecord, trigger: HTMLButtonElement) => {
    returnFocusRef.current = trigger
    setSelected(entry)
  }

  return (
    <>
      <div aria-label={copy.filterRoles} className="meta-filter-chips" role="group">
        <Chip onPressedChange={() => onRoleChange(null)} pressed={role === null}>{copy.allRoles}</Chip>
        {site.roles.map((value) => (
          <Chip key={value} onPressedChange={() => onRoleChange(role === value ? null : value)} pressed={role === value}>{value}</Chip>
        ))}
      </div>
      <div aria-label="Character tier placements" className="meta-tier-grid">
        <div className="meta-tier-grid__header">
          <span aria-hidden="true" />
          {tierColumns.map((column) => <h3 key={column.id} title={column.blurb}>{column.label}</h3>)}
        </div>
        {tierScale.map((band) => {
          const bandRecords = records.filter((entry) => entry.tier === band.id)
          return (
            <section aria-label={`Tier ${band.id}: ${band.label}`} className="meta-tier-grid__row" key={band.id}>
              <h3 className="meta-tier-grid__tier">
                <span>{band.id}</span>
                <small>{band.label}</small>
                {band.minRarity && <small>{band.minRarity}★+</small>}
              </h3>
              {tierColumns.map((column) => {
                const cellRecords = bandRecords.filter((entry) => entry.column === column.id)
                return (
                  <div aria-label={`${band.id} ${column.label}`} className={`meta-tier-grid__cell${cellRecords.length ? '' : ' is-empty'}`} key={column.id}>
                    {cellRecords.length
                      ? <TierPortraits onSelect={openDetails} records={cellRecords} />
                      : <span className="sr-only">{copy.noTierEntries}</span>}
                  </div>
                )
              })}
            </section>
          )
        })}
      </div>
      {selected && <TierReasonDialog entry={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

function TierPortraits({ records, onSelect }: { records: TierRecord[]; onSelect: (entry: TierRecord, trigger: HTMLButtonElement) => void }) {
  return (
    <div className="meta-tier-row__portraits">
      {records.map((entry) => {
        const character = getCharacter(entry.characterId)
        if (!character) return null
        return <button aria-label={`${site.metaPage.openTierDetails} ${character.name}`} className="meta-tier-character" key={entry.characterId} onClick={(event) => onSelect(entry, event.currentTarget)} type="button">
          <SmartImage alt={`${character.name} portrait`} aspectRatio="3:4" className="meta-tier-character__image" fit="contain" label={character.name} src={character.image} />
          <span>{character.name}</span>
        </button>
      })}
    </div>
  )
}

function TierReasonDialog({ entry, onClose }: { entry: TierRecord; onClose: () => void }) {
  const character = getCharacter(entry.characterId)
  const dialogRef = useRef<HTMLDivElement>(null)
  const copy = site.metaPage

  useEffect(() => {
    dialogRef.current?.querySelector<HTMLElement>('button')?.focus()
  }, [])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    if (event.key !== 'Tab') return
    const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not(:disabled):not([tabindex="-1"]), a[href]',
    ) ?? [])
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  if (!character) return null
  return (
    <div className="meta-modal" onKeyDown={handleKeyDown}>
      <button aria-label={copy.closeTierDetails} className="meta-modal__scrim" onClick={onClose} tabIndex={-1} type="button" />
      <div aria-labelledby="meta-tier-modal-title" aria-modal="true" className="meta-modal__dialog" ref={dialogRef} role="dialog" tabIndex={-1}>
        <button aria-label={copy.closeTierDetails} className="meta-modal__close" onClick={onClose} type="button">×</button>
        <div className="meta-modal__content" data-lenis-prevent>
          <p className="scene-label">{entry.tier} · {copy.draft}</p>
          <h2 id="meta-tier-modal-title">{character.name}</h2>
          <p className="meta-modal__rarity"><Rarity value={character.rarity} /></p>
          <SmartImage alt={`${character.name} portrait`} aspectRatio="3:4" className="meta-modal__portrait" fit="contain" label={character.name} src={character.image} />
          <h3>{copy.tierReasonLabel}</h3>
          <p>{entry.reason || copy.unratedReason}</p>
          <Link className="ui-button ui-button--primary" onClick={onClose} to={`/characters/${character.id}`}>{copy.openProfile}</Link>
        </div>
      </div>
    </div>
  )
}
