import { Link } from 'react-router-dom'
import { events, getCharacter } from '../../data'
import type { EventRecord } from '../../types'
import { Panel, SceneHeading, Sticker } from '../ui'
import { SpoilerReveal } from './SpoilerReveal'

interface EventStoriesProps {
  labels: {
    scene: string
    sceneNumber: string
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
      <SceneHeading id="event-stories-heading" label={labels.scene} scene={labels.sceneNumber} title={labels.title} />
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
        <Sticker tone="brass" tilt={1}>{event.version ?? labels.unverified}</Sticker>
        {event.draft && <Sticker tone="verdigris" tilt={-1}>DRAFT</Sticker>}
      </div>
      <h3>{event.title}</h3>
      <p className="story-event-card__tone">{event.tone ?? labels.unverified}</p>
      <SpoilerReveal
        expanded={expanded}
        hideLabel={labels.hideSpoilers}
        id={`spoiler-event-${event.id}`}
        onToggle={onToggle}
        revealLabel={labels.revealSpoilers}
        text={event.summary ?? labels.unverified}
      />
      {event.featuredCharacters.length > 0 && <div className="story-tag-list">
        <span className="story-tag-list__label">{labels.featuredLabel}</span>
        {event.featuredCharacters.map((id) => <Link className="story-tag" key={id} to={`/characters/${id}`}>{getCharacter(id)?.name ?? labels.unverified}</Link>)}
      </div>}
      {event.mentions.length > 0 && <div className="story-tag-list">
        <span className="story-tag-list__label">{labels.mentionsLabel}</span>
        {event.mentions.map((mention) => <span className="story-tag story-tag--plain" key={mention}>{mention}</span>)}
      </div>}
    </Panel>
  )
}
