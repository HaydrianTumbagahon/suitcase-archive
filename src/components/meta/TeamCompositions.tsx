import { useState } from 'react'
import { Link } from 'react-router-dom'
import { characters, filterTeams, getTeamArchetypes, site } from '../../data'
import { Chip, Panel, SmartImage, Sticker } from '../ui'

export function TeamCompositions() {
  const [archetype, setArchetype] = useState<string | null>(null)
  const copy = site.metaPage
  const visibleTeams = filterTeams(archetype ?? undefined)

  return (
    <>
      <div aria-label={copy.filterArchetypes} className="meta-filter-chips" role="group">
        <Chip onPressedChange={() => setArchetype(null)} pressed={archetype === null}>{copy.allArchetypes}</Chip>
        {getTeamArchetypes().map((value) => (
          <Chip key={value} onPressedChange={() => setArchetype(archetype === value ? null : value)} pressed={archetype === value}>{value}</Chip>
        ))}
      </div>
      {visibleTeams.length > 0
        ? <div className="meta-team-grid">
          {visibleTeams.map((team) => (
            <Panel className="meta-team-card" key={team.id}>
              <div className="meta-team-card__badges">
                <Sticker tone="brass" tilt={-1}>{team.archetype}</Sticker>
                <Sticker tone="verdigris" tilt={1}>{copy.draft} · {team.gameVersion}</Sticker>
              </div>
              <h3>{team.name}</h3>
              <div className="meta-team-card__portraits">
                {team.members.slice(0, 4).map((member) => {
                  const character = characters.find((entry) => entry.id === member.characterId)
                  const name = character?.name ?? copy.unknownCharacter
                  return (
                    <Link aria-label={member.carry ? `${name} · ${copy.carryLabel}` : name} className="meta-team-card__portrait" key={member.characterId} to={`/characters/${member.characterId}`}>
                      <SmartImage alt={`${name} portrait`} aspectRatio="3:4" label={name} src={character?.image ?? null} />
                      {member.carry && <Sticker aria-label={copy.carryLabel} className="meta-team-card__carry" title={copy.carryLabel} tone="brass" tilt={0}>★</Sticker>}
                    </Link>
                  )
                })}
              </div>
              <p className="meta-team-card__how">{team.howItWorks}</p>
              <p className="meta-team-card__tier">{team.tierLabel ?? copy.tierUnrated}</p>
            </Panel>
          ))}
        </div>
        : <p className="empty-state">{copy.noTeamEntries}</p>}
    </>
  )
}
