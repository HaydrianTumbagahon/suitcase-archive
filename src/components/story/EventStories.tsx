import { Link } from 'react-router-dom'
import { events } from '../../data'
import type { EventRecord } from '../../types'
import { Panel, SceneHeading, Sticker } from '../ui'
import { SpoilerReveal } from './SpoilerReveal'

interface EventStoriesProps {
  labels: {
    title: string
    revealSpoilers: string
    hideSpoilers: string
    unverified: string
    featuredLabel: string
    mentionsLabel: string
  }
  expandedFor: (id: string) => boolean
  toggleSpoiler: (id: string) => void
}

export function EventStories({ labels, expandedFor, toggleSpoiler }: EventStoriesProps) {
  return (
    <section aria-labelledby="event-stories-heading" className="story-page__section" id="event-stories">
      <SceneHeading id="event-stories-heading" title={labels.title} />
      <div className="story-page__cards">
        {events.map((event) => <EventCard
          event={event}
          expanded={expandedFor(`event-${event.id}`)}
          key={event.id}
          labels={labels}
          onToggle={() => toggleSpoiler(`event-${event.id}`)}
        />)}
      </div>
    </section>
  )
}

interface EventCardProps {
  event: EventRecord
  expanded: boolean
  onToggle: () => void
  labels: EventStoriesProps['labels']
}

function EventCard({ event, expanded, onToggle, labels }: EventCardProps) {
  return (
    <Panel className="story-event-card" id={event.id}>
      <div className="story-record__heading">
        {event.version && <Sticker tone="brass" tilt={1}>{event.version}</Sticker>}
        {event.draft && <Sticker tone="verdigris" tilt={-1}>DRAFT</Sticker>}
      </div>
      <h3>{event.headline}</h3>
      <p className="story-record__subtitle">{event.title}</p>
      <p className="story-event-card__tone">{event.tone ?? labels.unverified}</p>
      <SpoilerReveal
        contentNotes={event.contentNotes}
        expanded={expanded}
        hideLabel={labels.hideSpoilers}
        id={`spoiler-event-${event.id}`}
        onToggle={onToggle}
        revealLabel={labels.revealSpoilers}
        text={event.summary ?? labels.unverified}
      />
      <blockquote className="story-critique">{event.critique}</blockquote>
      {event.featuredNames.length > 0 && <div className="story-tag-list">
        <span className="story-tag-list__label">{labels.featuredLabel}</span>
        {event.featuredNames.map((person) => person.characterId
          ? <Link className="story-tag" key={`${person.name}-${person.characterId}`} to={`/characters/${person.characterId}`}>{person.name}</Link>
          : <span className="story-tag story-tag--plain" key={person.name}>{person.name}</span>)}
      </div>}
      {event.otherNames.length > 0 && <div className="story-tag-list">
        <span className="story-tag-list__label">{labels.mentionsLabel}</span>
        {event.otherNames.map((mention) => <span className="story-tag story-tag--plain" key={mention}>{mention}</span>)}
      </div>}
    </Panel>
  )
}
