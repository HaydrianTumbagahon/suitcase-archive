import { useCallback, useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import type Lenis from 'lenis'
import { HashLink } from '../scroll/HashLink'
import { Button } from '../components/ui'
import { EventStories } from '../components/story/EventStories'
import { CrossoverStories } from '../components/story/CrossoverStories'
import { ManusCards } from '../components/story/ManusCards'
import { StoryTimeline } from '../components/story/StoryTimeline'
import { PageFrame } from '../site/PageFrame'
import { getStoryArcs, site } from '../data'
import type { StoryRecord } from '../types'

type Arc = StoryRecord['arc']

export default function StoryPage() {
  const [arc, setArc] = useState<Arc | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const progressRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const copy = site.storyPage

  const setProgress = useCallback((progress: number) => {
    if (progressRef.current) progressRef.current.setAttribute('aria-valuenow', String(Math.round(progress * 100)))
    if (progressBarRef.current) progressBarRef.current.style.transform = `scaleX(${progress})`
  }, [])
  const lenis = useLenis()

  useEffect(() => {
    if (lenis) {
      const updateFromLenis = (instance: Lenis) => setProgress(instance.progress)
      updateFromLenis(lenis)
      return lenis.on('scroll', updateFromLenis)
    }
    const updateFromWindow = () => {
      const limit = document.documentElement.scrollHeight - window.innerHeight
      setProgress(limit > 0 ? window.scrollY / limit : 0)
    }
    updateFromWindow()
    window.addEventListener('scroll', updateFromWindow, { passive: true })
    window.addEventListener('resize', updateFromWindow)
    return () => {
      window.removeEventListener('scroll', updateFromWindow)
      window.removeEventListener('resize', updateFromWindow)
    }
  }, [lenis, setProgress])

  const expandedFor = (id: string) => revealed[id] ?? showAll
  const toggleSpoiler = (id: string) => {
    setRevealed((current) => ({ ...current, [id]: !expandedFor(id) }))
  }
  const toggleAll = () => {
    setShowAll((current) => !current)
    setRevealed({})
  }

  return (
    <>
      <div aria-label={copy.scrollProgressLabel} aria-valuemax={100} aria-valuemin={0} aria-valuenow={0} className="story-progress" ref={progressRef} role="progressbar">
        <div className="story-progress__bar" ref={progressBarRef} />
      </div>
      <PageFrame title={copy.pageTitle} intro={copy.intro}>
        <div className="story-controls">
          <nav aria-label={copy.navigationLabel} className="story-subnav">
            <HashLink to="/story#timeline">{copy.timelineNavLabel}</HashLink>
            <HashLink to="/story#event-stories">{copy.eventsNavLabel}</HashLink>
            <HashLink to="/story#crossovers">{copy.crossoversNavLabel}</HashLink>
          </nav>
          <Button aria-pressed={showAll} onClick={toggleAll} variant="secondary">
            {showAll ? copy.hideAllSpoilers : copy.showAllSpoilers}
          </Button>
        </div>
        <section aria-labelledby="story-timeline-heading" className="story-page__section" id="timeline">
          <header className="story-page__timeline-heading">
            <h2 id="story-timeline-heading">{copy.timelineTitle}</h2>
          </header>
          <StoryTimeline
            arc={arc}
            arcs={getStoryArcs()}
            expandedFor={expandedFor}
            labels={copy}
            onArcChange={setArc}
            toggleSpoiler={toggleSpoiler}
          />
        </section>
        <EventStories
          expandedFor={expandedFor}
          labels={{
            title: copy.eventTitle,
            revealSpoilers: copy.revealSpoilers,
            hideSpoilers: copy.hideSpoilers,
            unverified: copy.unverified,
            featuredLabel: copy.featuredLabel,
            mentionsLabel: copy.mentionsLabel,
          }}
          toggleSpoiler={toggleSpoiler}
        />
        <CrossoverStories
          expandedFor={expandedFor}
          labels={{
            title: copy.crossoversTitle,
            revealSpoilers: copy.revealSpoilers,
            hideSpoilers: copy.hideSpoilers,
            featuredLabel: copy.featuredLabel,
            mentionsLabel: copy.mentionsLabel,
          }}
          toggleSpoiler={toggleSpoiler}
        />
        <ManusCards
          expandedFor={expandedFor}
          labels={{
            title: copy.manusTitle,
            revealSpoilers: copy.revealSpoilers,
            hideSpoilers: copy.hideSpoilers,
            unverified: copy.unverified,
            searchLabel: copy.manusSearchLabel,
            searchPlaceholder: copy.manusSearchPlaceholder,
            empty: copy.manusEmpty,
            appearancesLabel: copy.appearancesLabel,
          }}
          toggleSpoiler={toggleSpoiler}
        />
      </PageFrame>
    </>
  )
}
