export const AFFLATUS_VALUES = ['Beast', 'Plant', 'Mineral', 'Star', 'Spirit', 'Intellect'] as const
export const DAMAGE_VALUES = ['Reality', 'Mental'] as const
export const TIER_VALUES = ['S+', 'S', 'A', 'B', 'Unrated'] as const
export const TRIANGLE_VALUES = ['A', 'B'] as const
export const ROLE_VALUES = [
  'DPS',
  'Burst DMG',
  'Healer',
  'Support',
  'Sub-DPS',
  'Main Carry',
  'Dynamo',
  'Extra Action',
  'Burn',
  'Poison',
  'Dispeller',
  'Assassination',
  'Sustain',
  'Barrier',
  'Team Buffs',
  'Conduit',
  'Riposte',
  'Shield',
  'Lingering Glow',
  'All-Rounder',
] as const

export type Afflatus = (typeof AFFLATUS_VALUES)[number]
export type DamageType = (typeof DAMAGE_VALUES)[number]
export type TierLabel = (typeof TIER_VALUES)[number]
export type Triangle = (typeof TRIANGLE_VALUES)[number]
export type Role = (typeof ROLE_VALUES)[number]

export interface CharacterRecord {
  id: string
  name: string
  rarity: number | null
  afflatus: Afflatus | null
  damage: DamageType | null
  roles: Role[]
  debutVersion: string | null
  debutNote: string | null
  dossier: string
  psychubes: string[]
  buildNotes: string[]
  featured: boolean
  verified: boolean
  draft: boolean
  image: string | null
}

export interface SiteLoreEntry {
  id: string
  title: string
  summary: string
  draft: true
}

export interface SiteContent {
  name: string
  gameVersion: string
  totalCrewMembers: number
  roles: Role[]
  metaPage: {
    scene: string
    serial: string
    title: string
    intro: string
    banner: string
    draft: string
    archetypeScene: string
    archetypeTitle: string
    teamsScene: string
    teamsTitle: string
    tiersScene: string
    tiersTitle: string
    archetypeSceneNumber: string
    teamsSceneNumber: string
    tiersSceneNumber: string
    allArchetypes: string
    filterArchetypes: string
    filterRoles: string
    allRoles: string
    tierUnrated: string
    unratedReason: string
    noTierEntries: string
    noTeamEntries: string
    carryLabel: string
    openTierDetails: string
    closeTierDetails: string
    tierReasonLabel: string
    openProfile: string
    unverified: string
    unknownCharacter: string
    tierBands: { label: 'S+' | 'S' | 'A' | 'B'; tone: 'oxblood' | 'brass' | 'verdigris' | 'fog' }[]
  }
  storyPage: {
    pageScene: string
    pageSerial: string
    pageTitle: string
    intro: string
    sceneNumber: string
    timelineScene: string
    timelineTitle: string
    eventScene: string
    eventTitle: string
    manusScene: string
    manusTitle: string
    navigationLabel: string
    timelineNavLabel: string
    eventsNavLabel: string
    manusNavLabel: string
    scrollProgressLabel: string
    allArcs: string
    arcFilterLabel: string
    showAllSpoilers: string
    hideAllSpoilers: string
    revealSpoilers: string
    hideSpoilers: string
    yearUnverified: string
    locationUnverified: string
    featuredLabel: string
    mentionsLabel: string
    emptyTimeline: string
    manusSearchLabel: string
    manusSearchPlaceholder: string
    manusEmpty: string
    appearancesLabel: string
    unverified: string
  }
  mechanics: {
    damageTypes: DamageType[]
    afflatusAdvantagePercent: number
  }
  manusPageNote: {
    summary: string
    draft: true
  }
  lore: SiteLoreEntry[]
}

export interface HomeContent {
  hero: {
    scene: string
    sceneLabel: string
    sceneTitle: string
    guideLabel: string
    headline: string
    tagline: string
    charactersCta: string
    storyCta: string
  }
  afflatusScene: string
  afflatusLabel: string
  afflatusTitle: string
  premise: {
    scene: string
    sceneLabel: string
    title: string
    entries: { loreId: string; title: string }[]
  }
  featured: {
    scene: string
    sceneLabel: string
    title: string
    countsLabel: string
    countLabels: string[]
  }
  teasers: {
    scene: string
    sceneLabel: string
    sceneTitle: string
    storyTitle: string
    metaTitle: string
    storyLink: string
    metaLink: string
  }
}

export interface AfflatusRecord {
  id: Afflatus
  name: Afflatus
  triangle: Triangle
  beats: Afflatus | null
  weakTo: Afflatus | null
  closingMatchupUnverified: boolean
}

export interface StoryRecord {
  id: string
  order: number
  arc: 'Prologue' | 'Main Story: Chapters 1-13' | 'Version 3.8 Event'
  chapterLabel: string
  title: string
  year: number | null
  location: string | null
  summary: string
  myTake: string | null
  mentions: string[]
  featuredCharacters: string[]
  spoiler: true
  draft: true
  image: string | null
}

export interface EventRecord {
  id: string
  title: string
  version: string | null
  tone: string | null
  summary: string | null
  featuredCharacters: string[]
  mentions: string[]
  spoiler: true
  draft: true
  image: string | null
  storyId: string | null
}

export interface ManusRecord {
  id: string
  name: string
  title: string | null
  rank: 'Lord' | 'Apostle' | null
  blurb: string | null
  appearances: string[] | null
  spoiler: true
  draft: true
  image: string | null
}

export interface TeamMember {
  characterId: string
  carry: boolean
}

export interface TeamRecord {
  id: string
  name: string
  archetype: string
  explainer: string
  members: TeamMember[]
  howItWorks: string
  tierLabel: TierLabel | null
  gameVersion: string
  opinion: true
  draft: true
  image: string | null
}

export interface TierRecord {
  characterId: string
  tier: TierLabel
  reason: string
  draft: true
}

export interface PsychubeRecord {
  id: string
  name: string
  image: string | null
}

export interface LegalContent {
  disclaimerLines: string[]
  launchLines: {
    status: 'OK' | 'INFO' | 'NOTE' | 'WARN'
    text: string
  }[]
}

export interface CharacterFilters {
  search?: string
  afflatus?: Afflatus | null
  damage?: DamageType | null
  roles?: Role[]
  rarity?: number | null
  featured?: boolean
  sort?: CharacterSort
}

export type CharacterSort = 'name' | 'release-new' | 'release-old' | 'rarity' | 'tier'
