import { Link } from 'react-router-dom'
import { filterStoryRecords } from '../../data'
import type { StoryRecord } from '../../types'
import { Chip, Panel, SmartImage, Sticker } from '../ui'
import { SpoilerReveal } from './SpoilerReveal'

interface StoryTimelineProps {
  arc: StoryRecord['arc'] | null
  arcs: StoryRecord['arc'][]
  onArcChange: (arc: StoryRecord['arc'] | null) => void
  expandedFor: (id: string) => boolean
  toggleSpoiler: (id: string) => void
  labels: {
    allArcs: string
    arcFilterLabel: string
    revealSpoilers: string
    hideSpoilers: string
    yearUnverified: string
    locationUnverified: string
    featuredLabel: string
    mentionsLabel: string
    emptyTimeline: string
    unverified: string
  }
}

export function StoryTimeline({ arc, arcs, onArcChange, expandedFor, toggleSpoiler, labels }: StoryTimelineProps) {
  const records = filterStoryRecords(arc ?? undefined)
  return (
    <>
      <div aria-label={labels.arcFilterLabel} className="story-arc-filters" role="group">
        <Chip onPressedChange={() => onArcChange(null)} pressed={arc === null}>{labels.allArcs}</Chip>
        {arcs.map((option) => (
          <Chip key={option} onPressedChange={() => onArcChange(arc === option ? null : option)} pressed={arc === option}>
            {option}
          </Chip>
        ))}
      </div>
      {records.length === 0
        ? <p className="empty-state">{labels.emptyTimeline}</p>
        : <ol className="story-timeline">
          {records.map((entry) => <TimelineRecord
            entry={entry}
            expanded={expandedFor(`story-${entry.id}`)}
            key={entry.id}
            labels={labels}
            onToggle={() => toggleSpoiler(`story-${entry.id}`)}
          />)}
        </ol>}
    </>
  )
}

interface TimelineRecordProps {
  entry: StoryRecord
  expanded: boolean
  onToggle: () => void
  labels: StoryTimelineProps['labels']
}

function TimelineRecord({ entry, expanded, onToggle, labels }: TimelineRecordProps) {
  return (
    <li className="story-timeline__item" id={entry.id}>
      <Panel className="story-timeline__panel">
        <span aria-hidden="true" className="story-timeline__number">{entry.chapterLabel}</span>
        <header className="story-timeline__heading">
          <span className="scene-label">{entry.year ?? labels.yearUnverified} · {entry.location ?? labels.locationUnverified}</span>
          {entry.draft && <Sticker tone="verdigris" tilt={1}>DRAFT</Sticker>}
        </header>
        <h3>{entry.headline}</h3>
        <p className="story-record__subtitle">{entry.title}</p>
        <SmartImage alt={`${entry.title} story artwork`} aspectRatio="16:9" className="story-timeline__image" label={entry.chapterLabel} src={entry.image} />
        <SpoilerReveal
          contentNotes={entry.contentNotes}
          expanded={expanded}
          hideLabel={labels.hideSpoilers}
          id={`spoiler-story-${entry.id}`}
          onToggle={onToggle}
          revealLabel={labels.revealSpoilers}
          text={entry.summary}
        />
        <blockquote className="story-critique">{entry.critique}</blockquote>
        {entry.featuredNames.length > 0 && <div className="story-tag-list">
          <span className="story-tag-list__label">{labels.featuredLabel}</span>
          {entry.featuredNames.map((person) => person.characterId
            ? <Link className="story-tag" key={`${person.name}-${person.characterId}`} to={`/characters/${person.characterId}`}>{person.name}</Link>
            : <span className="story-tag story-tag--plain" key={person.name}>{person.name}</span>)}
        </div>}
        {entry.otherNames.length > 0 && <div className="story-tag-list">
          <span className="story-tag-list__label">{labels.mentionsLabel}</span>
          {entry.otherNames.map((mention) => <span className="story-tag story-tag--plain" key={mention}>{mention}</span>)}
        </div>}
      </Panel>
    </li>
  )
}
