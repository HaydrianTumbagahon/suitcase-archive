import { Link } from 'react-router-dom'
import { site } from '../data'
import type { CharacterRecord } from '../types'
import { Icon, Rarity, SmartImage } from './ui'

interface CharacterCardProps {
  character: CharacterRecord
}

export function CharacterCard({ character }: CharacterCardProps) {
  const unverified = !character.dataComplete || character.rarity === null
    || !character.afflatus?.length || character.damage === null
  const visibleRoles = character.roles.slice(0, 3)
  const omittedRoles = character.roles.length - visibleRoles.length

  return (
    <Link className="character-card" to={`/characters/${character.id}`}>
      <SmartImage
        alt={`${character.name} portrait`}
        aspectRatio="3:4"
        className="character-card__image"
        fit="contain"
        label={`${character.name} portrait`}
        src={character.image}
      />
      <div className="character-card__details">
        <div className="character-card__heading">
          <h3>{character.name}</h3>
        </div>
        <div aria-label="Character attributes" className="character-card__facts" role="group">
          <Rarity value={character.rarity} />
          <span aria-hidden="true">·</span>
          {character.afflatus?.length
            ? character.afflatus.map((value, index) => (
              <span className="character-card__fact-value" key={value}>
                {index > 0 && <span aria-hidden="true"> / </span>}
                <Icon category="afflatus" value={value} />
              </span>
            ))
            : <span className="character-card__fact-muted">Unverified</span>}
          <span aria-hidden="true">·</span>
          {character.damage
            ? <Icon category="damage" value={character.damage} />
            : <span className="character-card__fact-muted">Unverified</span>}
        </div>
        <div aria-label="Roles" className="character-card__roles" role="group">
          {visibleRoles.map((role) => (
            <span className="character-card__role-chip" key={role}><Icon category="role" value={role} /></span>
          ))}
          {omittedRoles > 0 && <span aria-label={`${omittedRoles} more roles`} className="character-card__role-chip">+{omittedRoles}</span>}
        </div>
        <div aria-label="Record status" className="character-card__tags">
          {unverified && <span className="character-card__tag character-card__tag--unverified">Unverified</span>}
          {!character.dataComplete && <span className="character-card__tag character-card__tag--unverified">Details pending</span>}
          {character.debutVersion === site.gameVersion && <span className="character-card__tag character-card__tag--new">NEW {site.gameVersion}</span>}
        </div>
      </div>
    </Link>
  )
}
