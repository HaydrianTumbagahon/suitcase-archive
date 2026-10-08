import { Link } from 'react-router-dom'
import { CharacterCard } from '../components/CharacterCard'
import { Icon, Marquee, Panel, SceneHeading, Sticker } from '../components/ui'
import { afflatus, characters, events, home, manus, site, story, teams } from '../data'
import { Reveal } from '../site/Reveal'

const premiseRecords = home.premise.entries.map((entry) => ({
  ...entry,
  record: site.lore.find((lore) => lore.id === entry.loreId),
}))
const featuredCharacters = characters.filter((character) => character.featured).slice(0, 4)
const chapterCount = story.filter((entry) => entry.chapterLabel.startsWith('Chapter ')).length
const latestStory = story.at(-1)
const metaSketch = teams[0]

export default function HomePage() {
  const [arcanistLabel, chapterLabel, eventLabel, manusLabel] = home.featured.countLabels
  const totals = [
    [characters.length, arcanistLabel],
    [chapterCount, chapterLabel],
    [events.length, eventLabel],
    [manus.length, manusLabel],
  ] as const

  return (
    <div className="home-page home-archive">
      <section aria-labelledby="home-title" className="home-hero home-hero--archive">
        <div className="hero-fog" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-letterbox hero-letterbox--top" aria-hidden="true" />
        <div className="hero-letterbox hero-letterbox--bottom" aria-hidden="true" />
        <SceneHeading
          className="home-hero__scene"
          id="hero-scene-heading"
          label={home.hero.sceneLabel}
          scene={home.hero.scene}
          title={home.hero.sceneTitle}
        />
        <p className="home-hero__guide">{home.hero.guideLabel} {site.gameVersion}</p>
        <h1 id="home-title">{home.hero.headline}</h1>
        <div className="home-hero__paper">
          <p>{home.hero.tagline}</p>
        </div>
        <div className="home-hero__actions">
          <Link className="home-cta home-cta--primary" to="/characters">{home.hero.charactersCta}</Link>
          <Link className="home-cta home-cta--secondary" to="/story">{home.hero.storyCta}</Link>
        </div>
      </section>

      <section aria-labelledby="afflatus-title" className="home-afflatus">
        <Reveal>
          <SceneHeading
            id="afflatus-title"
            label={home.afflatusLabel}
            scene={home.afflatusScene}
            title={home.afflatusTitle}
          />
        </Reveal>
        <Marquee label={home.afflatusLabel}>
          {afflatus.map((entry) => (
            <span className="home-afflatus__item" key={entry.id}>
              <Icon category="afflatus" value={entry.name} size={22} />
              {entry.name}
            </span>
          ))}
        </Marquee>
      </section>

      <section aria-labelledby="premise-title" className="home-section home-premise">
        <SceneHeading id="premise-title" label={home.premise.sceneLabel} scene={home.premise.scene} title={home.premise.title} />
        <div className="home-premise__grid">
          {premiseRecords.map(({ loreId, title, record }, index) => record && (
            <Reveal className={`home-premise__reveal home-premise__reveal--${loreId}`} key={loreId}>
              <Panel serial={index + 1} className="home-premise__panel">
                <div className="home-premise__title">
                  <h3>{title}</h3>
                  {record.draft && <Sticker tone="oxblood" tilt={index % 2 ? 1 : -1}>Draft</Sticker>}
                </div>
                <p>{record.summary}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-labelledby="featured-title" className="home-section home-featured">
        <SceneHeading id="featured-title" label={home.featured.sceneLabel} scene={home.featured.scene} title={home.featured.title} />
        <div className="home-featured__grid">
          {featuredCharacters.map((character, index) => (
            <Reveal className={`home-featured__reveal home-featured__reveal--${index + 1}`} key={character.id}>
              <CharacterCard character={character} />
            </Reveal>
          ))}
        </div>
        <div aria-label={home.featured.countsLabel} className="home-counts">
          <p>{home.featured.countsLabel}</p>
          {totals.map(([count, label], index) => (
            <div className="home-counts__item" key={label}>
              <strong>{count}{index === 0 ? ` of ~${site.totalCrewMembers}` : ''}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="teasers-title" className="home-section home-teasers">
        <SceneHeading
          id="teasers-title"
          label={home.teasers.sceneLabel}
          scene={home.teasers.scene}
          title={home.teasers.sceneTitle}
        />
        <div className="home-teasers__grid">
          {latestStory && (
            <Reveal>
              <Panel className="home-teaser">
                <div className="home-teaser__top">
                  <span>{latestStory.chapterLabel}</span>
                  {latestStory.spoiler && <span>Story spoilers</span>}
                  {latestStory.draft && <Sticker tone="verdigris" tilt={-1}>Version {site.gameVersion} • DRAFT</Sticker>}
                </div>
                <h2>{home.teasers.storyTitle}</h2>
                <h3>{latestStory.title}</h3>
                <p>{latestStory.summary}</p>
                <Link className="home-teaser__link" to="/story">{home.teasers.storyLink} ↗</Link>
              </Panel>
            </Reveal>
          )}
          {metaSketch && (
            <Reveal>
              <Panel className="home-teaser home-teaser--meta">
                <div className="home-teaser__top">
                  <span>{metaSketch.archetype}</span>
                  <Sticker tone="oxblood" tilt={1}>Version {site.gameVersion} • DRAFT</Sticker>
                </div>
                <h2>{home.teasers.metaTitle}</h2>
                <h3>{metaSketch.name}</h3>
                <p>{metaSketch.explainer}</p>
                <Link className="home-teaser__link" to="/meta">{home.teasers.metaLink} ↗</Link>
              </Panel>
            </Reveal>
          )}
        </div>
      </section>
    </div>
  )
}
