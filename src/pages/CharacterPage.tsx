import { Link, useParams } from 'react-router-dom'
import { characters, getCharacter, getCharacterAppearances, getPsychube, getTier, teamsFor } from '../data'
import { Icon, Panel, Rarity, SmartImage, Sticker } from '../components/ui'
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
        <SmartImage alt={`${character.name} portrait`} aspectRatio="3:4" className="character-dossier__portrait" fit="contain" label={`${character.name} portrait`} src={character.image} />
        <div className="character-dossier__title">
          <h1>{character.name}</h1>
          <div aria-label="Character attributes" className="character-dossier__summary-facts">
            <Rarity value={character.rarity} />
            <span aria-hidden="true">·</span>
            {character.afflatus?.length
              ? character.afflatus.map((value, index) => (
                <span key={value}>
                  {index > 0 && <span aria-hidden="true"> / </span>}
                  <Icon category="afflatus" value={value} />
                </span>
              ))
              : <span className="character-dossier__fact-muted">Unverified</span>}
            <span aria-hidden="true">·</span>
            {character.damage
              ? <Icon category="damage" value={character.damage} />
              : <span className="character-dossier__fact-muted">Unverified</span>}
          </div>
          {character.draft && <Sticker tone="verdigris" tilt={-2}>DRAFT</Sticker>}
          {!character.dataComplete && <Sticker tone="parchment" tilt={0}>Unverified</Sticker>}
        </div>
        <div className="character-dossier__facts">
          <div className="character-dossier__roles">
            {character.roles.length
              ? <>
                <span className="character-dossier__roles-label">Roles</span>
                {character.roles.map((role) => <span className="character-dossier__role" key={role}><Icon category="role" value={role} /></span>)}
              </>
              : <><span className="character-dossier__roles-label">Roles</span><span className="character-meta">Unverified</span></>}
            <small>Role definitions unverified</small>
          </div>
          <p><b>Birthday</b> {character.birthday ?? 'Unverified'}</p>
          <p><b>Age</b> {character.age ?? 'Unverified'}</p>
          {!character.dataComplete && <p className="character-dossier__pending">Details pending</p>}
        </div>
      </header>

      <nav aria-label="Character sections" className="character-section-nav">
        {sections.map((section) => <HashLink key={section.id} to={`/characters/${character.id}#${section.id}`}>{section.label}</HashLink>)}
      </nav>

      <div className="character-dossier__content">
        <section className="character-dossier__section" id="dossier">
          <h2>Dossier</h2>
          {character.dossier
            ? <p>{character.dossier}</p>
            : <Panel className="character-dossier__empty-note"><p>No dossier yet</p></Panel>}
        </section>

        <section className="character-dossier__section" id="kit">
          <div className="record-badges"><Sticker tone="verdigris" tilt={1}>DRAFT</Sticker></div>
          <h2>Kit</h2>
          <Panel><p>Kit details are not yet verified in this archive.</p><span className="character-meta">Unverified</span></Panel>
        </section>

        <section className="character-dossier__section" id="build">
          <h2>Build</h2>
          <div className="character-dossier__panels">
            {psychubes.length
              ? psychubes.map((psychube, slot) => <Panel key={character.psychubes[slot]}><h3>{psychube?.name ?? 'Psychube slot'}</h3><p>{psychube ? 'Recorded psychube' : 'Unverified'}</p></Panel>)
              : <Panel><h3>Psychube slot</h3><p>Unverified</p></Panel>}
            {character.buildNotes.map((note, index) => <Panel key={`${index}-${note}`}><p>{note}</p></Panel>)}
          </div>
        </section>

        <section className="character-dossier__section" id="teams">
          <h2>Teams</h2>
          {memberTeams.length
            ? <div className="character-dossier__panels">{memberTeams.map((team) => <Panel key={team.id}><h3>{team.name}</h3><p>{team.explainer}</p><span className="character-meta">{team.tierLabel ?? 'Unverified'} · {team.gameVersion}</span></Panel>)}</div>
            : <Panel><p>No team records are filed for this character.</p><span className="character-meta">Unverified</span></Panel>}
        </section>
        <section className="character-dossier__section" id="verdict">
          <h2>My Verdict</h2>
          <Panel><p className="character-dossier__tier">{tier?.tier ?? 'Unverified'}</p><p>{tier?.reason ?? 'No personal tier assessment is filed for this character.'}</p>{tier?.draft && <Sticker tone="verdigris" tilt={-1}>DRAFT</Sticker>}</Panel>
        </section>

        {appearances.length > 0 && (
          <section className="character-dossier__section" aria-labelledby="seen-in-heading">
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
