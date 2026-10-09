import { useState } from 'react'
import { Link } from 'react-router-dom'
import { filterManusRecords, getEvent, getStoryRecord, site } from '../../data'
import type { ManusRecord } from '../../types'
import { Panel, SceneHeading, Sticker } from '../ui'
import { SpoilerReveal } from './SpoilerReveal'

interface ManusCardsProps {
  labels: {
    title: string
    revealSpoilers: string
    hideSpoilers: string
    unverified: string
    searchLabel: string
    searchPlaceholder: string
    empty: string
    appearancesLabel: string
  }
  expandedFor: (id: string) => boolean
  toggleSpoiler: (id: string) => void
}

export function ManusCards({ labels, expandedFor, toggleSpoiler }: ManusCardsProps) {
  const [query, setQuery] = useState('')
  const records = filterManusRecords(query)

  return (
    <section aria-labelledby="manus-heading" className="story-page__section" id="manus-vindictae">
      <SceneHeading id="manus-heading" title={labels.title} />
      <p className="story-page__intro">{site.manusPageNote.summary}</p>
      <label className="story-manus-search">
        <span>{labels.searchLabel}</span>
        <input onChange={(event) => setQuery(event.target.value)} placeholder={labels.searchPlaceholder} type="search" value={query} />
      </label>
      {records.length > 0
        ? <div className="story-page__cards">
          {records.map((record) => <ManusCard
            expanded={expandedFor(`manus-${record.id}`)}
            key={record.id}
            labels={labels}
            onToggle={() => toggleSpoiler(`manus-${record.id}`)}
            record={record}
          />)}
        </div>
        : <p className="empty-state">{labels.empty}</p>}
    </section>
  )
}

interface ManusCardProps {
  record: ManusRecord
  expanded: boolean
  onToggle: () => void
  labels: ManusCardsProps['labels']
}

function ManusCard({ record, expanded, onToggle, labels }: ManusCardProps) {
  return (
    <Panel className="story-manus-card">
      <div className="story-record__heading">
        <span className="scene-label">{record.rank ?? labels.unverified} · {record.title ?? labels.unverified}</span>
        {record.draft && <Sticker tone="verdigris" tilt={1}>DRAFT</Sticker>}
      </div>
      <h3>{record.name}</h3>
      <SpoilerReveal
        expanded={expanded}
        hideLabel={labels.hideSpoilers}
        id={`spoiler-manus-${record.id}`}
        onToggle={onToggle}
        revealLabel={labels.revealSpoilers}
        text={record.blurb ?? labels.unverified}
      />
      <p className="story-tag-list__label">{labels.appearancesLabel}</p>
      <AppearanceList record={record} unverified={labels.unverified} />
    </Panel>
  )
}

function AppearanceList({ record, unverified }: { record: ManusRecord; unverified: string }) {
  if (!record.appearances?.length) return <p className="character-meta">{unverified}</p>
  return (
    <div className="story-tag-list">
      {record.appearances.map((id) => {
        const story = getStoryRecord(id)
        const event = getEvent(id)
        const title = story?.title ?? event?.title ?? unverified
        return story || event
          ? <Link className="story-tag" key={id} to={`/story#${id}`}>{title}</Link>
          : <span className="story-tag story-tag--plain" key={id}>{title}</span>
      })}
    </div>
  )
}
