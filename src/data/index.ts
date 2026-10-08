import characterContent from '../content/characters.json'
import psychubeContent from '../content/psychubes.json'
import storyContent from '../content/story.json'
import eventContent from '../content/events.json'
import manusContent from '../content/manus.json'
import teamContent from '../content/teams.json'
import tierContent from '../content/tiers.json'
import afflatusContent from '../content/afflatus.json'
import legalContent from '../content/legal.json'
import siteContent from '../content/site.json'
import homeContent from '../content/home.json'
import type {
  AfflatusRecord,
  CharacterFilters,
  CharacterRecord,
  EventRecord,
  HomeContent,
  LegalContent,
  ManusRecord,
  PsychubeRecord,
  SiteContent,
  StoryRecord,
  TeamRecord,
  TierRecord,
} from '../types'

export const characters: CharacterRecord[] = characterContent as CharacterRecord[]
export const psychubes: PsychubeRecord[] = psychubeContent as PsychubeRecord[]
export const story: StoryRecord[] = storyContent as StoryRecord[]
export const events: EventRecord[] = eventContent as EventRecord[]
export const manus: ManusRecord[] = manusContent as ManusRecord[]
export const teams: TeamRecord[] = teamContent as TeamRecord[]
export const tiers: TierRecord[] = tierContent as TierRecord[]
export const afflatus: AfflatusRecord[] = afflatusContent as AfflatusRecord[]
export const legal: LegalContent = legalContent as LegalContent
export const site: SiteContent = siteContent as SiteContent
export const home: HomeContent = homeContent as HomeContent

export function getCharacter(id: string) {
  return characters.find((character) => character.id === id)
}

export function filterCharacters(filters: CharacterFilters = {}) {
  return characters.filter((character) => (
    (filters.afflatus === undefined || character.afflatus === filters.afflatus)
    && (filters.damage === undefined || character.damage === filters.damage)
    && (filters.rarity === undefined || character.rarity === filters.rarity)
    && (filters.featured === undefined || character.featured === filters.featured)
    && (!filters.roles?.length || filters.roles.some((role) => character.roles.includes(role)))
  ))
}

function compareReleaseVersions(first: string | null, second: string | null) {
  if (first === null) return second === null ? 0 : 1
  if (second === null) return -1
  const firstParts = first.split('.').map(Number)
  const secondParts = second.split('.').map(Number)
  for (let index = 0; index < Math.max(firstParts.length, secondParts.length); index += 1) {
    const difference = (firstParts[index] ?? 0) - (secondParts[index] ?? 0)
    if (difference !== 0) return difference
  }
  return 0
}

const tierOrder = new Map(['S+', 'S', 'A', 'B', 'Unrated'].map((tier, index) => [tier, index]))

export function filterAndSortCharacters(filters: CharacterFilters = {}) {
  const matches = characters.filter((character) => (
    (!filters.search || character.name.toLocaleLowerCase().includes(filters.search.trim().toLocaleLowerCase()))
    && (filters.afflatus === undefined || character.afflatus === filters.afflatus)
    && (filters.damage === undefined || character.damage === filters.damage)
    && (filters.rarity === undefined || character.rarity === filters.rarity)
    && (filters.featured === undefined || character.featured === filters.featured)
    && (!filters.roles?.length || filters.roles.some((role) => character.roles.includes(role)))
  ))

  const sort = filters.sort ?? 'name'
  return matches
    .map((character, index) => ({ character, index }))
    .sort((first, second) => {
      let comparison = 0
      if (sort === 'release-new' || sort === 'release-old') {
        comparison = compareReleaseVersions(first.character.debutVersion, second.character.debutVersion)
        if (sort === 'release-new' && first.character.debutVersion !== null && second.character.debutVersion !== null) {
          comparison *= -1
        }
      } else if (sort === 'rarity') {
        const firstRarity = first.character.rarity
        const secondRarity = second.character.rarity
        comparison = firstRarity === null
          ? secondRarity === null ? 0 : 1
          : secondRarity === null ? -1 : secondRarity - firstRarity
      } else if (sort === 'tier') {
        const firstTier = tiers.find((entry) => entry.characterId === first.character.id)?.tier
        const secondTier = tiers.find((entry) => entry.characterId === second.character.id)?.tier
        comparison = firstTier === undefined
          ? secondTier === undefined ? 0 : 1
          : secondTier === undefined
            ? -1
            : (tierOrder.get(firstTier) ?? Number.MAX_SAFE_INTEGER)
              - (tierOrder.get(secondTier) ?? Number.MAX_SAFE_INTEGER)
      } else {
        comparison = first.character.name.localeCompare(second.character.name)
      }
      return comparison || first.index - second.index
    })
    .map(({ character }) => character)
}

export function teamsFor(characterId: string) {
  return teams.filter((team) => team.members.some((member) => member.characterId === characterId))
}

export function getTeamArchetypes() {
  return [...new Set(teams.map((team) => team.archetype))]
}

export function filterTeams(archetype?: string) {
  return teams.filter((team) => archetype === undefined || team.archetype === archetype)
}

export function filterTierRecords(role?: CharacterRecord['roles'][number]) {
  return tiers.filter((entry) => {
    if (!role) return true
    return characters.find((character) => character.id === entry.characterId)?.roles.includes(role) ?? false
  })
}

export function getChapters() {
  return story
    .filter((entry) => entry.arc !== 'Version 3.8 Event')
    .slice()
    .sort((a, b) => a.order - b.order)
}

export function getStoryRecords() {
  return story.slice().sort((a, b) => a.order - b.order)
}

export function getStoryArcs() {
  return [...new Set(getStoryRecords().map((entry) => entry.arc))]
}

export function filterStoryRecords(arc?: StoryRecord['arc']) {
  return getStoryRecords().filter((entry) => arc === undefined || entry.arc === arc)
}

export function getStoryRecord(id: string) {
  return story.find((entry) => entry.id === id)
}

export function getEvents() {
  return events
}

export function getEvent(id: string) {
  return events.find((event) => event.id === id)
}

export function getCharacterAppearances(characterId: string) {
  return [
    ...getStoryRecords()
      .filter((entry) => entry.featuredCharacters.includes(characterId))
      .map((entry) => ({ id: entry.id, title: entry.title, kind: 'Story' as const, label: entry.chapterLabel })),
    ...events
      .filter((entry) => entry.featuredCharacters.includes(characterId))
      .map((entry) => ({ id: entry.id, title: entry.title, kind: 'Event' as const, label: entry.version ?? 'Unverified' })),
  ]
}

export function getLords() {
  return manus.filter((entry) => entry.rank === 'Lord')
}

export function getManusRecords() {
  return manus
}

export function filterManusRecords(search: string) {
  const query = search.trim().toLocaleLowerCase()
  return manus.filter((entry) => entry.name.toLocaleLowerCase().includes(query))
}

export function getManusRecord(id: string) {
  return manus.find((entry) => entry.id === id)
}

export function getPsychube(id: string) {
  return psychubes.find((entry) => entry.id === id)
}

export function getTier(characterId: string) {
  return tiers.find((entry) => entry.characterId === characterId)
}

export function hasUnverifiedClosingMatchup(entry: AfflatusRecord) {
  return entry.closingMatchupUnverified
}
