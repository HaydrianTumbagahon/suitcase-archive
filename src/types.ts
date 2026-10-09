export const AFFLATUS_VALUES = ['Beast', 'Plant', 'Mineral', 'Star', 'Spirit', 'Intellect'] as const
export const DAMAGE_VALUES = ['Reality', 'Mental'] as const
export const TIER_VALUES = ['S+', 'S', 'A+', 'A', 'B', 'C', 'D', 'F'] as const
export const TRIANGLE_VALUES = ['A', 'B'] as const
export const ROLE_VALUES = [
  'DPS',
  'Follow-up Attack',
  'Support',
  'Debuff',
  'Purify',
  'Heal',
  'Inspiration',
  'Burst DMG',
  'Assassination',
  'Control',
  'Dispeller',
  'DEF',
  'Shield',
  'Lingering Glow',
  'Extra Action',
  'Dynamo',
  'Ritual',
  'Remove Debuffs',
  'Conduit',
  'Array',
  'Nasty Wound',
  'Riposte',
  'Moxie',
  'Burn',
  'Poison',
  'Remove Buffs',
  'Immunity',
  'Rewrite',
  'Reaper',
  'Rank Up',
  'Ultimate',
  'Bloodtithe',
  'Adaptive',
  'Self-healing',
  'Shift',
  'All-Rounder',
  'HP Sacrifice',
] as const

export type Afflatus = (typeof AFFLATUS_VALUES)[number]
export type DamageType = (typeof DAMAGE_VALUES)[number]
export type TierLabel = (typeof TIER_VALUES)[number]
export type Triangle = (typeof TRIANGLE_VALUES)[number]
export type Role = (typeof ROLE_VALUES)[number]

export interface IconContent {
  afflatus: Record<Lowercase<Afflatus>, string | null>
  damage: Record<Lowercase<DamageType>, string | null>
  roles: Record<string, string | null>
}

export interface CharacterRecord {
  id: string
  name: string
  rarity: number | null
  afflatus: Afflatus[] | null
  damage: DamageType | null
  damageType?: DamageType | null
  roles: Role[]
  birthday: string | null
  age: string | null
  dataComplete: boolean
  debutVersion: string | null
  debutNote: string | null
  dossier: string | null
  psychubes: string[]
  buildNotes: string[]
  featured: boolean
  featuredWeight?: number
  verified: boolean
  draft: boolean
  image: string | null
  tierStub?: boolean
}

export interface FeaturedRotation {
  mode: 'daily' | 'weekly' | 'static'
  count: number
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
  creator: string
  githubUrl: string
  footerNavigation: { label: string; path: string }[]
  icons: IconContent
  featuredRotation: FeaturedRotation
  roles: Role[]
  teamGuide: {
    replacementGuide: string
    bestLabel: string
    goodLabel: string
    acceptableLabel: string
    generalNotes: string[]
  }
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
    crossoversTitle: string
    navigationLabel: string
    timelineNavLabel: string
    eventsNavLabel: string
    manusNavLabel: string
    crossoversNavLabel: string
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

export interface StoryNameRef {
  name: string
  characterId: string | null
}

export interface StoryArc {
  id: string
  title: string
  chapters: number[]
}

export interface StoryRecord {
  id: string
  order: number
  arc: string
  chapterLabel: string
  title: string
  headline: string
  year: number | null
  location: string | null
  summary: string
  critique: string
  contentNotes: string[]
  featuredNames: StoryNameRef[]
  otherNames: string[]
  mentions: string[]
  featuredCharacters: string[]
  spoiler: true
  draft: true
  image: string | null
}

export interface EventRecord {
  id: string
  title: string
  headline: string
  version?: string | null
  year: number | null
  location: string | null
  tone: string | null
  summary: string | null
  critique: string
  contentNotes: string[]
  featuredNames: StoryNameRef[]
  otherNames: string[]
  featuredCharacters: string[]
  mentions: string[]
  spoiler: true
  draft: true
  image: string | null
  storyId: string | null
}

export interface CrossoverRecord {
  id: string
  franchise: string
  title: string
  headline: string
  year: number | null
  location: string | null
  summary: string
  critique: string
  contentNotes: string[]
  featuredNames: StoryNameRef[]
  otherNames: string[]
}

export interface StoryEditorialContent {
  meta: {
    gameVersion: string
    voice: string
    spoiler: true
    draft: true
    note: string
  }
  arcs: StoryArc[]
  chapters: (Omit<StoryRecord, 'order' | 'chapterLabel' | 'mentions' | 'featuredCharacters' | 'spoiler' | 'draft' | 'image' | 'featuredNames'> & {
    number: number
    arc: string
    featuredNames: string[]
  })[]
  events: (Omit<EventRecord, 'featuredNames' | 'otherNames' | 'featuredCharacters' | 'mentions' | 'spoiler' | 'draft' | 'image' | 'storyId'> & {
    featuredNames: string[]
    otherNames: string[]
    version?: string | null
  })[]
  crossovers: (Omit<CrossoverRecord, 'featuredNames'> & { featuredNames: string[] })[]
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
  replacements: {
    role: string
    best: string[]
    good: string[]
    acceptable: string[]
  }[]
  notes: string[]
  tierLabel: TierLabel | null
  gameVersion: string
  opinion: true
  draft: true
  image: string | null
}

export interface TierRecord {
  characterId: string
  name: string
  tier: TierLabel
  column: string
  reason: string | null
  draft: true
  minRarity?: number
  nameNeedsCheck?: boolean
  spokenAs?: string
}

export interface TierScaleEntry {
  id: TierLabel
  label: string
  blurb: string
  minRarity?: number
  minRarityNote?: string
}

export interface TierColumn {
  id: string
  label: string
  blurb: string
}

export interface TierCatalog {
  scale: TierScaleEntry[]
  columns: TierColumn[]
  gameVersion: string
  updatedAt: string
  draft: boolean
  about: string[]
  changelog: string[]
  entries: TierRecord[]
  unresolved: { issue: string; names: string[]; tier?: string; column?: string }[]
}

export interface PsychubeRecord {
  id: string
  name: string
  image: string | null
}

export interface LegalContent {
  disclaimerLines: string[]
  footer: {
    description: string
    navigationLabel: string
    noticesLabel: string
    githubLabel: string
    githubAriaLabel: string
    notices: [string, string, string]
    createdBy: string
    updatedFor: string
  }
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
