import { Link } from 'react-router-dom'
import { crossovers } from '../../data'
import type { CrossoverRecord } from '../../types'
import { Panel, SceneHeading, Sticker } from '../ui'
import { SpoilerReveal } from './SpoilerReveal'

interface CrossoverStoriesProps {
  labels: {
    title: string
    revealSpoilers: string
    hideSpoilers: string
    featuredLabel: string
    mentionsLabel: string
  }
  expandedFor: (id: string) => boolean
  toggleSpoiler: (id: string) => void
}

export function CrossoverStories({ labels, expandedFor, toggleSpoiler }: CrossoverStoriesProps) {
  return (
    <section aria-labelledby="crossover-stories-heading" className="story-page__section" id="crossovers">
      <SceneHeading id="crossover-stories-heading" title={labels.title} />
      <div className="story-page__cards">
        {crossovers.map((crossover) => <CrossoverCard
          crossover={crossover}
          expanded={expandedFor(`crossover-${crossover.id}`)}
          key={crossover.id}
          labels={labels}
          onToggle={() => toggleSpoiler(`crossover-${crossover.id}`)}
        />)}
      </div>
    </section>
  )
}

interface CrossoverCardProps {
  crossover: CrossoverRecord
  expanded: boolean
  onToggle: () => void
  labels: CrossoverStoriesProps['labels']
}

function CrossoverCard({ crossover, expanded, onToggle, labels }: CrossoverCardProps) {
  return (
    <Panel className="story-crossover-card">
      <div className="story-record__heading">
        <Sticker tone="brass" tilt={1}>{crossover.franchise}</Sticker>
      </div>
      <h3>{crossover.headline}</h3>
      <p className="story-record__subtitle">{crossover.title}</p>
      <p className="story-event-card__tone">{crossover.location ?? ''}</p>
      <SpoilerReveal
        contentNotes={crossover.contentNotes}
        expanded={expanded}
        hideLabel={labels.hideSpoilers}
        id={`spoiler-crossover-${crossover.id}`}
        onToggle={onToggle}
        revealLabel={labels.revealSpoilers}
        text={crossover.summary}
      />
      <blockquote className="story-critique">{crossover.critique}</blockquote>
      {crossover.featuredNames.length > 0 && <div className="story-tag-list">
        <span className="story-tag-list__label">{labels.featuredLabel}</span>
        {crossover.featuredNames.map((person) => person.characterId
          ? <Link className="story-tag" key={`${person.name}-${person.characterId}`} to={`/characters/${person.characterId}`}>{person.name}</Link>
          : <span className="story-tag story-tag--plain" key={person.name}>{person.name}</span>)}
      </div>}
      {crossover.otherNames.length > 0 && <div className="story-tag-list">
        <span className="story-tag-list__label">{labels.mentionsLabel}</span>
        {crossover.otherNames.map((name) => <span className="story-tag story-tag--plain" key={name}>{name}</span>)}
      </div>}
    </Panel>
  )
}
