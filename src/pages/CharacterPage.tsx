import { Link, useParams } from 'react-router-dom'
import { characters, getCharacter, getCharacterAppearances, getPsychube, getTier, teamsFor } from '../data'
import { Icon, Panel, SmartImage, Sticker } from '../components/ui'
import { HashLink } from '../scroll/HashLink'
import NotFoundPage from './NotFoundPage'

const sections = [
  { id: 'dossier', label: 'Dossier' },
  { id: 'kit', label: 'Kit' },
  { id: 'build', label: 'Build' },
  { id: 'teams', label: 'Teams' },
  { id: 'verdict', label: 'My Verdict' },
]

export default function CharacterPage() {
  const { id } = useParams()
  const character = id ? getCharacter(id) : undefined
  if (!character) return <NotFoundPage />

  const tier = getTier(character.id)
  const memberTeams = teamsFor(character.id)
  const appearances = getCharacterAppearances(character.id)
  const index = characters.findIndex((entry) => entry.id === character.id)
  const previous = characters[index - 1]
  const next = characters[index + 1]
  const psychubes = character.psychubes.map((psychubeId) => getPsychube(psychubeId))

  return (
    <article className="character-dossier">
      <header className="character-dossier__hero">
        <SmartImage alt={`${character.name} portrait`} aspectRatio="3:4" className="character-dossier__portrait" label={`${character.name} portrait`} src={character.image} />
        <div className="character-dossier__title">
          <span className="scene-label">SCENE 02 — CHARACTER DOSSIER</span>
          <p className="serial-number">RECORD / {character.id}</p>
          <h1>{character.name}</h1>
          {character.draft && <Sticker tone="verdigris" tilt={-2}>DRAFT</Sticker>}
        </div>
        <div className="character-dossier__facts">
          <span><Icon category="rarity" value={character.rarity ?? 0} /> {character.rarity === null ? 'Unverified rarity' : `${character.rarity}★`}</span>
          <span>{character.afflatus ? <Icon category="afflatus" value={character.afflatus} /> : null}{character.afflatus ?? 'Unverified Afflatus'}</span>
          <span>{character.damage ? <Icon category="damage" value={character.damage} /> : null}{character.damage ?? 'Unverified damage'}</span>
          <div className="character-dossier__roles">
            {character.roles.length
              ? character.roles.map((role) => <span className="character-dossier__role" key={role}><Icon category="role" value={role} size={16} />{role}</span>)
              : <span className="character-meta">Roles: Unverified</span>}
            <small>Role definitions unverified</small>
          </div>
          <p><b>Debut</b> {character.debutVersion ?? 'Unverified'} · {character.debutNote ?? 'Unverified'}</p>
        </div>
      </header>

      <nav aria-label="Character sections" className="character-section-nav">
        {sections.map((section) => <HashLink key={section.id} to={`/characters/${character.id}#${section.id}`}>{section.label}</HashLink>)}
      </nav>

      <div className="character-dossier__content">
        <section className="character-dossier__section" id="dossier">
          <span className="scene-label">SCENE 02.1 — DOSSIER</span>
          <h2>Dossier</h2>
          <p>{character.dossier}</p>
        </section>

        <section className="character-dossier__section" id="kit">
          <div className="record-badges"><span className="scene-label">SCENE 02.2 — FIELD NOTES</span><Sticker tone="verdigris" tilt={1}>DRAFT</Sticker></div>
          <h2>Kit</h2>
          <Panel serial="01"><p>Kit details are not yet verified in this archive.</p><span className="character-meta">Unverified</span></Panel>
        </section>

        <section className="character-dossier__section" id="build">
          <span className="scene-label">SCENE 02.3 — EQUIPMENT</span>
          <h2>Build</h2>
          <div className="character-dossier__panels">
            {psychubes.length
              ? psychubes.map((psychube, slot) => <Panel key={character.psychubes[slot]} serial={slot + 1}><h3>{psychube?.name ?? 'Psychube slot'}</h3><p>{psychube ? 'Recorded psychube' : 'Unverified'}</p></Panel>)
              : <Panel serial="01"><h3>Psychube slot</h3><p>Unverified</p></Panel>}
            {character.buildNotes.map((note, index) => <Panel key={`${index}-${note}`} serial={index + psychubes.length + 1}><p>{note}</p></Panel>)}
          </div>
        </section>

        <section className="character-dossier__section" id="teams">
          <span className="scene-label">SCENE 02.4 — COMPANY</span>
          <h2>Teams</h2>
          {memberTeams.length
            ? <div className="character-dossier__panels">{memberTeams.map((team) => <Panel key={team.id}><h3>{team.name}</h3><p>{team.explainer}</p><span className="character-meta">{team.tierLabel ?? 'Unverified'} · {team.gameVersion}</span></Panel>)}</div>
            : <Panel><p>No team records are filed for this character.</p><span className="character-meta">Unverified</span></Panel>}
        </section>

        <section className="character-dossier__section" id="verdict">
          <span className="scene-label">SCENE 02.5 — PERSONAL NOTES</span>
          <h2>My Verdict</h2>
          <Panel><p className="character-dossier__tier">{tier?.tier ?? 'Unverified'}</p><p>{tier?.reason ?? 'No personal tier assessment is filed for this character.'}</p>{tier?.draft && <Sticker tone="verdigris" tilt={-1}>DRAFT</Sticker>}</Panel>
        </section>

        {appearances.length > 0 && (
          <section className="character-dossier__section" aria-labelledby="seen-in-heading">
            <span className="scene-label">SCENE 02.6 — CROSS-REFERENCES</span>
            <h2 id="seen-in-heading">Seen In</h2>
            <ul className="team-reference-list">{appearances.map((entry) => <li key={entry.id}><Link to={`/story#${entry.id}`}><span className="character-meta">{entry.kind} · {entry.label}</span> — {entry.title}</Link></li>)}</ul>
          </section>
        )}

        <nav aria-label="Other character records" className="character-dossier__pagination">
          {previous ? <Link className="text-link" to={`/characters/${previous.id}`}>← Previous: {previous.name}</Link> : <span />}
          <Link className="text-link" to="/characters">Character index</Link>
          {next ? <Link className="text-link" to={`/characters/${next.id}`}>Next: {next.name} →</Link> : <span />}
        </nav>
      </div>
    </article>
  )
}
