import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { filterTierRecords, getCharacter, site } from '../../data'
import type { Role, TierRecord } from '../../types'
import { Chip, SmartImage } from '../ui'
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
      <div className="meta-tier-list">
        {copy.tierBands.map((band) => (
          <TierBand key={band.label} label={band.label} records={records.filter((entry) => entry.tier === band.label)} tone={band.tone} onSelect={openDetails} />
        ))}
        <details className="meta-tier-row meta-tier-row--unrated">
          <summary>
            <span aria-hidden="true" className="meta-tier-row__letter">?</span>
            <span className="meta-tier-row__title">{copy.tierUnrated}</span>
            <span className="meta-tier-row__count">{records.filter((entry) => entry.tier === 'Unrated').length}</span>
          </summary>
          <TierPortraits onSelect={openDetails} records={records.filter((entry) => entry.tier === 'Unrated')} />
          {records.every((entry) => entry.tier !== 'Unrated') && <p className="meta-tier-row__empty">{copy.noTierEntries}</p>}
        </details>
      </div>
      {selected && <TierReasonDialog entry={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

function TierBand({ label, tone, records, onSelect }: {
  label: string
  tone: string
  records: TierRecord[]
  onSelect: (entry: TierRecord, trigger: HTMLButtonElement) => void
}) {
  return (
    <section aria-label={`Tier ${label}`} className={`meta-tier-row meta-tier-row--${tone}`}>
      <h3 aria-label={label} className="meta-tier-row__title"><span aria-hidden="true" className="meta-tier-row__letter">{label}</span></h3>
      <TierPortraits onSelect={onSelect} records={records} />
      {records.length === 0 && <p className="meta-tier-row__empty">{site.metaPage.noTierEntries}</p>}
    </section>
  )
}

function TierPortraits({ records, onSelect }: { records: TierRecord[]; onSelect: (entry: TierRecord, trigger: HTMLButtonElement) => void }) {
  return (
    <div className="meta-tier-row__portraits">
      {records.map((entry) => {
        const character = getCharacter(entry.characterId)
        if (!character) return null
        return <button aria-label={`${site.metaPage.openTierDetails} ${character.name}`} className="meta-tier-character" key={entry.characterId} onClick={(event) => onSelect(entry, event.currentTarget)} type="button">
          <SmartImage alt={`${character.name} portrait`} aspectRatio="3:4" className="meta-tier-character__image" label={character.name} src={character.image} />
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
          <p className="scene-label">{entry.tier === 'Unrated' ? copy.tierUnrated : entry.tier} · {copy.draft}</p>
          <h2 id="meta-tier-modal-title">{character.name}</h2>
          <SmartImage alt={`${character.name} portrait`} aspectRatio="3:4" className="meta-modal__portrait" label={character.name} src={character.image} />
          <h3>{copy.tierReasonLabel}</h3>
          <p>{entry.reason || copy.unratedReason}</p>
          <Link className="ui-button ui-button--primary" onClick={onClose} to={`/characters/${character.id}`}>{copy.openProfile}</Link>
        </div>
      </div>
    </div>
  )
}
