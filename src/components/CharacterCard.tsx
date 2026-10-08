import { Link } from 'react-router-dom'
import { site } from '../data'
import type { CharacterRecord } from '../types'
import { Icon, SmartImage, Sticker } from './ui'

interface CharacterCardProps {
  character: CharacterRecord
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Link className="character-card" to={`/characters/${character.id}`}>
      <SmartImage
        alt={`${character.name} portrait`}
        aspectRatio="3:4"
        className="character-card__image"
        label={`${character.name} portrait`}
        src={character.image}
      />
      <div className="character-card__details">
        <div className="character-card__heading">
          <h3>{character.name}</h3>
          <div className="character-card__stickers">
            {character.debutVersion === site.gameVersion && (
              <Sticker tone="verdigris" tilt={-1}>New {site.gameVersion}</Sticker>
            )}
            {character.featured && <Sticker tone="brass" tilt={1}>Featured</Sticker>}
          </div>
        </div>
        <div className="character-card__facts">
          <span>
            {character.afflatus
              ? <><Icon category="afflatus" value={character.afflatus} size={18} />{character.afflatus}</>
              : <span className="character-card__unverified">Unverified · Afflatus</span>}
          </span>
          <span>
            {character.rarity !== null
              ? <><Icon category="rarity" value={character.rarity} size={18} />{character.rarity}-Star</>
              : <span className="character-card__unverified">Unverified · Rarity</span>}
          </span>
          <span>
            {character.damage
              ? <><Icon category="damage" value={character.damage} size={18} />{character.damage}</>
              : <span className="character-card__unverified">Unverified · Damage</span>}
          </span>
        </div>
        {character.roles.length > 0 && (
          <div aria-label="Roles" className="character-card__roles">
            {character.roles.slice(0, 3).map((role) => (
              <span className="character-card__role-chip" key={role}>{role}</span>
            ))}
          </div>
        )}
        {character.draft && <Sticker className="character-card__draft" tone="oxblood" tilt={-1}>Draft</Sticker>}
      </div>
    </Link>
  )
}
