import characterContent from '../content/characters.json'
import psychubeContent from '../content/psychubes.json'
import storyContent from '../content/story.json'
import eventContent from '../content/events.json'
import storyEditorialContent from '../content/story-editorial.json'
import manusContent from '../content/manus.json'
import teamContent from '../content/teams.json'
import tierContent from '../content/tiers.json'
import afflatusContent from '../content/afflatus.json'
import legalContent from '../content/legal.json'
import siteContent from '../content/site.json'
import homeContent from '../content/home.json'
import { selectFeaturedCharacters } from './featured'
import type {
  AfflatusRecord,
  CharacterFilters,
  CharacterRecord,
  CrossoverRecord,
  EventRecord,
  HomeContent,
  LegalContent,
  ManusRecord,
  PsychubeRecord,
  SiteContent,
  StoryArc,
  StoryEditorialContent,
  StoryNameRef,
  StoryRecord,
  TeamRecord,
  TierCatalog,
  TierColumn,
  TierRecord,
  TierScaleEntry,
} from '../types'

export const characters: CharacterRecord[] = characterContent as CharacterRecord[]
export const psychubes: PsychubeRecord[] = psychubeContent as PsychubeRecord[]
export const story: StoryRecord[] = storyContent as StoryRecord[]
export const events: EventRecord[] = eventContent as EventRecord[]
const storyEditorial = storyEditorialContent as StoryEditorialContent
export const storyArcs: StoryArc[] = storyEditorial.arcs
const charactersByName = new Map(
  characters.map((character) => [normalizeCharacterName(character.name), character.id]),
)

function normalizeCharacterName(name: string) {
  return name.normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().toLocaleLowerCase()
}

function mapFeaturedNames(names: string[]): StoryNameRef[] {
  return names.map((name) => ({
    name,
    characterId: charactersByName.get(normalizeCharacterName(name)) ?? null,
  }))
}

export const crossovers: CrossoverRecord[] = storyEditorial.crossovers.map((entry) => ({
  ...entry,
  featuredNames: mapFeaturedNames(entry.featuredNames),
}))
export const manus: ManusRecord[] = manusContent as ManusRecord[]
export const teams: TeamRecord[] = teamContent as TeamRecord[]
const tierCatalog = tierContent as TierCatalog
export const tiers: TierRecord[] = tierCatalog.entries
export const tierScale: TierScaleEntry[] = tierCatalog.scale
export const tierColumns: TierColumn[] = tierCatalog.columns
export const afflatus: AfflatusRecord[] = afflatusContent as AfflatusRecord[]
export const legal: LegalContent = legalContent as LegalContent
export const site: SiteContent = siteContent as SiteContent
export const home: HomeContent = homeContent as HomeContent

export function getCharacter(id: string) {
  return characters.find((character) => character.id === id)
}

export function getFeaturedCharacters(date: Date) {
  return selectFeaturedCharacters(characters, site.featuredRotation, date)
}

export function filterCharacters(filters: CharacterFilters = {}) {
  return characters.filter((character) => (
    (filters.afflatus == null || character.afflatus?.includes(filters.afflatus))
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

const tierOrder = new Map(tierScale.map(({ id }, index) => [id, index]))

export function filterAndSortCharacters(filters: CharacterFilters = {}) {
  const matches = characters.filter((character) => (
    (!filters.search || character.name.toLocaleLowerCase().includes(filters.search.trim().toLocaleLowerCase()))
    && (filters.afflatus == null || character.afflatus?.includes(filters.afflatus))
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
    const character = characters.find((candidate) => candidate.id === entry.characterId)
    const minRarity = tierScale.find((band) => band.id === entry.tier)?.minRarity
    if (minRarity !== undefined && (character?.rarity === null || character?.rarity === undefined || character.rarity < minRarity)) return false
    if (!role) return true
    return character?.roles.includes(role) ?? false
  })
}

export function getChapters() {
  return getStoryRecords()
}

export function getStoryRecords() {
  return story.slice().sort((a, b) => a.order - b.order)
}

export function getStoryArcs() {
  return storyArcs.map((arc) => arc.title)
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
