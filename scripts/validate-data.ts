import { existsSync, readFileSync } from 'node:fs'
import { isAbsolute, relative, resolve, sep } from 'node:path'

const root = process.cwd()
const contentDirectory = resolve(root, 'src', 'content')
const fileNames = [
  'site.json',
  'characters.json',
  'psychubes.json',
  'story.json',
  'story-editorial.json',
  'events.json',
  'manus.json',
  'teams.json',
  'tiers.json',
  'afflatus.json',
  'legal.json',
  'home.json',
]
const errors: string[] = []

function readJson(fileName) {
  const filePath = resolve(contentDirectory, fileName)
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'))
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    errors.push(`${fileName}: could not parse JSON (${detail})`)
    return null
  }
}

const content = Object.fromEntries(fileNames.map((fileName) => [
  fileName.replace('.json', ''),
  readJson(fileName),
]))
const site = content.site ?? {}
const home = content.home ?? {}
const storyEditorial = content['story-editorial'] ?? {}
function readArray(name) {
  if (!Array.isArray(content[name])) {
    errors.push(`${name}.json: expected a JSON array`)
    return []
  }
  return content[name]
}

const characters = readArray('characters')
const psychubes = readArray('psychubes')
const story = readArray('story')
const events = readArray('events')
const manus = readArray('manus')
const teams = readArray('teams')
const tierCatalog = content.tiers ?? {}
const tiers = Array.isArray(tierCatalog.entries) ? tierCatalog.entries : []
if (!Array.isArray(tierCatalog.entries)) errors.push('tiers.json: entries must be an array')
const tierScale = Array.isArray(tierCatalog.scale) ? tierCatalog.scale : []
const tierColumns = Array.isArray(tierCatalog.columns) ? tierCatalog.columns : []
const afflatus = readArray('afflatus')
const characterIds = new Set(characters.map((entry) => entry.id))
const storyAndEventIds = new Set([...story, ...events].map((entry) => entry.id))

function checkUniqueIds(label, records, key = 'id') {
  const seen = new Set()
  for (const record of records) {
    const id = record?.[key]
    if (id == null) continue
    if (typeof id !== 'string') errors.push(`${label}: ${key} must be a string, received "${id}"`)
    if (seen.has(id)) errors.push(`${label}: duplicate ${key} "${id}"`)
    seen.add(id)
  }
}

function checkEnum(label, value, allowed) {
  if (value != null && !allowed.includes(value)) {
    errors.push(`${label}: "${value}" is not one of ${allowed.join(', ')}`)
  }
}

function checkCharacterReferences(label, ids) {
  if (!Array.isArray(ids)) return
  for (const id of ids) {
    if (!characterIds.has(id)) errors.push(`${label}: unknown character id "${id}"`)
  }
}

function checkStringArray(label, value) {
  if (!Array.isArray(value)) {
    errors.push(`${label}: expected an array of strings`)
    return
  }
  value.forEach((entry, index) => {
    if (typeof entry !== 'string') errors.push(`${label}[${index}]: expected a string`)
  })
}

function checkEditorialRecords() {
  const arcs = Array.isArray(storyEditorial.arcs) ? storyEditorial.arcs : []
  const chapters = Array.isArray(storyEditorial.chapters) ? storyEditorial.chapters : []
  const editorialEvents = Array.isArray(storyEditorial.events) ? storyEditorial.events : []
  const crossovers = Array.isArray(storyEditorial.crossovers) ? storyEditorial.crossovers : []
  for (const [label, records] of [
    ['story-editorial arcs', arcs],
    ['story-editorial chapters', chapters],
    ['story-editorial events', editorialEvents],
    ['story-editorial crossovers', crossovers],
  ]) {
    checkUniqueIds(label, records)
  }
  const arcIds = new Set(arcs.map((arc) => arc.id))
  for (const arc of arcs) {
    if (typeof arc.title !== 'string' || !arc.title.trim()) errors.push(`story-editorial arc ${arc.id}: title must be a non-empty string`)
    if (!Array.isArray(arc.chapters) || arc.chapters.some((number) => !Number.isInteger(number))) {
      errors.push(`story-editorial arc ${arc.id}: chapters must be an array of chapter numbers`)
    }
    for (const number of Array.isArray(arc.chapters) ? arc.chapters : []) {
      if (!chapters.some((chapter) => chapter.number === number && chapter.arc === arc.id)) {
        errors.push(`story-editorial arc ${arc.id}: chapter number ${number} is not assigned to this arc`)
      }
    }
  }
  for (const [index, chapter] of chapters.entries()) {
    const label = `story-editorial chapter ${chapter.id ?? index}`
    for (const key of ['title', 'headline', 'summary', 'critique']) {
      if (typeof chapter[key] !== 'string' || !chapter[key].trim()) errors.push(`${label}: ${key} must be a non-empty string`)
    }
    if (!Number.isInteger(chapter.number)) errors.push(`${label}: number must be an integer`)
    if (!arcIds.has(chapter.arc)) errors.push(`${label}: unknown arc "${chapter.arc}"`)
    else if (!arcs.find((arc) => arc.id === chapter.arc)?.chapters.includes(chapter.number)) {
      errors.push(`${label}: number ${chapter.number} is not listed in its arc`)
    }
    checkStringArray(`${label} contentNotes`, chapter.contentNotes)
    checkStringArray(`${label} featuredNames`, chapter.featuredNames)
    checkStringArray(`${label} otherNames`, chapter.otherNames)
    const renderedChapter = story[index]
    if (renderedChapter) {
      for (const key of ['title', 'headline', 'summary', 'critique']) {
        if (renderedChapter[key] !== chapter[key]) errors.push(`${label}: ${key} does not match story.json`)
      }
      if (JSON.stringify(renderedChapter.contentNotes) !== JSON.stringify(chapter.contentNotes)
        || JSON.stringify(renderedChapter.otherNames) !== JSON.stringify(chapter.otherNames)
        || JSON.stringify(renderedChapter.featuredNames?.map((person) => person.name)) !== JSON.stringify(chapter.featuredNames)) {
        errors.push(`${label}: notes or names do not match story.json`)
      }
    }
  }
  for (const [index, event] of editorialEvents.entries()) {
    const label = `story-editorial event ${event.id ?? index}`
    for (const key of ['title', 'headline', 'critique']) {
      if (typeof event[key] !== 'string' || !event[key].trim()) errors.push(`${label}: ${key} must be a non-empty string`)
    }
    if (event.summary !== null && typeof event.summary !== 'string') errors.push(`${label}: summary must be a string or null`)
    if (event.version !== undefined && event.version !== null && typeof event.version !== 'string') {
      errors.push(`${label}: version must be a string when provided`)
    }
    checkStringArray(`${label} contentNotes`, event.contentNotes)
    checkStringArray(`${label} featuredNames`, event.featuredNames)
    checkStringArray(`${label} otherNames`, event.otherNames)
    const renderedEvent = events[index]
    if (renderedEvent) {
      for (const key of ['title', 'headline', 'summary', 'critique']) {
        if (renderedEvent[key] !== event[key]) errors.push(`${label}: ${key} does not match events.json`)
      }
      if (JSON.stringify(renderedEvent.contentNotes) !== JSON.stringify(event.contentNotes)
        || JSON.stringify(renderedEvent.otherNames) !== JSON.stringify(event.otherNames)
        || JSON.stringify(renderedEvent.featuredNames?.map((person) => person.name)) !== JSON.stringify(event.featuredNames)) {
        errors.push(`${label}: notes or names do not match events.json`)
      }
    }
  }
  for (const [index, crossover] of crossovers.entries()) {
    const label = `story-editorial crossover ${crossover.id ?? index}`
    for (const key of ['franchise', 'title', 'headline', 'summary', 'critique']) {
      if (typeof crossover[key] !== 'string' || !crossover[key].trim()) errors.push(`${label}: ${key} must be a non-empty string`)
    }
    checkStringArray(`${label} contentNotes`, crossover.contentNotes)
    checkStringArray(`${label} featuredNames`, crossover.featuredNames)
    checkStringArray(`${label} otherNames`, crossover.otherNames)
  }
  if (chapters.length !== story.length) errors.push('story.json: chapter count does not match story-editorial.json')
  if (editorialEvents.length !== events.length) errors.push('events.json: event count does not match story-editorial.json')
}

function checkMappedFeaturedNames(label, refs) {
  if (!Array.isArray(refs)) {
    errors.push(`${label}: featuredNames must be an array`)
    return
  }
  for (const [index, ref] of refs.entries()) {
    if (typeof ref?.name !== 'string' || !ref.name.trim()) errors.push(`${label} featuredNames[${index}]: name must be a non-empty string`)
    if (ref?.characterId !== null && !characterIds.has(ref?.characterId)) {
      errors.push(`${label} featuredNames[${index}]: unknown character id "${ref?.characterId}"`)
    }
  }
}

checkEditorialRecords()

const datasets = Object.entries({
  characters,
  psychubes,
  story,
  events,
  manus,
  teams,
  afflatus,
})
for (const [label, records] of datasets) {
  checkUniqueIds(label, records)
}
checkUniqueIds('tiers', tiers, 'characterId')

const globalIds = new Set()
for (const [label, records] of datasets) {
  for (const record of records) {
    if (record?.id == null) continue
    if (globalIds.has(record.id)) errors.push(`${label}: duplicate id "${record.id}" across content catalogs`)
    globalIds.add(record.id)
  }
}

const roles = Array.isArray(site.roles) ? site.roles : []
if (!Array.isArray(site.roles)) errors.push('site.json: roles must be an array')
if (new Set(roles).size !== roles.length) errors.push('site.json: roles must not contain duplicates')
const featuredRotation = site.featuredRotation
if (!featuredRotation || !['daily', 'weekly', 'static'].includes(featuredRotation.mode)) {
  errors.push('site.json: featuredRotation.mode must be daily, weekly, or static')
}
if (!featuredRotation || !Number.isInteger(featuredRotation.count) || featuredRotation.count < 0) {
  errors.push('site.json: featuredRotation.count must be a non-negative integer')
}
const featuredPool = characters.filter((character) => character.featured)
if (featuredRotation && Number.isInteger(featuredRotation.count) && featuredRotation.count > featuredPool.length) {
  errors.push(`site.json: featuredRotation.count (${featuredRotation.count}) exceeds featured character pool (${featuredPool.length})`)
}
const publicDirectory = resolve(root, 'public')
const iconCategories = site.icons && typeof site.icons === 'object' ? site.icons : null
if (!iconCategories) errors.push('site.json: icons must be an object')
for (const category of ['afflatus', 'damage', 'roles']) {
  const icons = iconCategories?.[category]
  if (!icons || typeof icons !== 'object' || Array.isArray(icons)) {
    errors.push(`site.json icons.${category} must be an object`)
    continue
  }
  const requiredKeys = category === 'afflatus'
    ? ['beast', 'plant', 'mineral', 'star', 'spirit', 'intellect']
    : category === 'damage' ? ['reality', 'mental'] : []
  for (const key of requiredKeys) {
    if (!(key in icons)) errors.push(`site.json icons.${category}.${key} must be present (use null when unset)`)
  }
  for (const [name, iconPath] of Object.entries(icons)) {
    if (iconPath === null) continue
    if (typeof iconPath !== 'string' || !iconPath.startsWith('/')) {
      errors.push(`site.json icons.${category}.${name} must be null or a public path beginning with "/"`)
      continue
    }
    const filePath = resolve(publicDirectory, iconPath.slice(1))
    const relativePath = relative(publicDirectory, filePath)
    if (isAbsolute(relativePath) || relativePath === '..' || relativePath.startsWith(`..${sep}`)) {
      errors.push(`site.json icons.${category}.${name} points outside public/`)
    } else if (!existsSync(filePath)) {
      errors.push(`site.json icons.${category}.${name}: icon file "${iconPath}" does not exist`)
    }
  }
}
const afflatusNames = ['Beast', 'Plant', 'Mineral', 'Star', 'Spirit', 'Intellect']
const damageTypes = ['Reality', 'Mental']
const tiersAllowed = ['S+', 'S', 'A+', 'A', 'B', 'C', 'D', 'F']
const trianglesAllowed = ['A', 'B']

for (const character of characters) {
  if (typeof character.id !== 'string' || character.id.length === 0) {
    errors.push('characters.json: every character id must be a non-empty string')
  }
  if (!Array.isArray(character.afflatus) && !(character.tierStub === true && character.afflatus === null)) {
    errors.push(`character ${character.id}: afflatus must be an array${character.tierStub ? ' or null for tier stubs' : ''}`)
  } else {
    for (const value of character.afflatus ?? []) checkEnum(`character ${character.id} afflatus`, value, afflatusNames)
  }
  if (character.rarity !== null && (!Number.isInteger(character.rarity) || character.rarity < 2 || character.rarity > 6)) {
    errors.push(`character ${character.id}: rarity must be null or an integer from 2 to 6`)
  }
  for (const key of ['birthday', 'age']) {
    if (character[key] !== null && typeof character[key] !== 'string') {
      errors.push(`character ${character.id}: ${key} must be a string or null`)
    }
  }
  if (typeof character.dataComplete !== 'boolean') {
    errors.push(`character ${character.id}: dataComplete must be true or false`)
  }
  if (character.featuredWeight !== undefined
    && (typeof character.featuredWeight !== 'number' || !Number.isFinite(character.featuredWeight) || character.featuredWeight <= 0)) {
    errors.push(`character ${character.id}: featuredWeight must be a positive finite number when provided`)
  }
  if (character.dossier !== null && typeof character.dossier !== 'string') {
    errors.push(`character ${character.id}: dossier must be a string or null`)
  }
  checkEnum(`character ${character.id} damage`, character.damage, damageTypes)
  if (character.tierStub === true) {
    if (character.rarity !== null || character.afflatus !== null || character.damageType !== null
      || character.damage !== null || character.roles?.length !== 0 || character.debutVersion !== null
      || character.verified !== false || character.draft !== true || character.dossier !== null) {
      errors.push(`character ${character.id}: tier stub contains unverified character data`)
    }
  }
  if (!Array.isArray(character.roles)) {
    errors.push(`character ${character.id}: roles must be an array`)
  } else {
    for (const role of character.roles) {
      checkEnum(`character ${character.id} role`, role, roles)
    }
  }
}
for (const record of tiers) {
  checkCharacterReferences('tiers', [record.characterId])
  checkEnum(`tier for ${record.characterId}`, record.tier, tiersAllowed)
  if (typeof record.name !== 'string' || !record.name.trim()) {
    errors.push(`tier for ${record.characterId}: name must be a non-empty string`)
  }
  if (!tierColumns.some((column) => column.id === record.column)) {
    errors.push(`tier for ${record.characterId}: unknown column "${record.column}"`)
  }
  if (record.reason !== null && typeof record.reason !== 'string') {
    errors.push(`tier for ${record.characterId}: reason must be a string or null`)
  }
  if (record.nameNeedsCheck !== undefined && typeof record.nameNeedsCheck !== 'boolean') {
    errors.push(`tier for ${record.characterId}: nameNeedsCheck must be a boolean when provided`)
  }
  if (record.spokenAs !== undefined && typeof record.spokenAs !== 'string') {
    errors.push(`tier for ${record.characterId}: spokenAs must be a string when provided`)
  }
}
if (tierScale.length !== 8) errors.push(`tiers.json: expected 8 scale tiers, found ${tierScale.length}`)
if (tierColumns.length !== 4) errors.push(`tiers.json: expected 4 columns, found ${tierColumns.length}`)
for (const band of tierScale) {
  checkEnum('tiers scale id', band.id, tiersAllowed)
  if (band.minRarity !== undefined && (!Number.isInteger(band.minRarity) || band.minRarity < 2 || band.minRarity > 6)) {
    errors.push(`tiers scale ${band.id}: minRarity must be an integer from 2 to 6`)
  }
}
for (const team of teams) {
  if (team.members?.length !== 4) errors.push(`team ${team.id}: exactly four members are required`)
  const memberIds = new Set()
  for (const member of team.members ?? []) {
    checkCharacterReferences(`team ${team.id}`, [member.characterId])
    if (memberIds.has(member.characterId)) errors.push(`team ${team.id}: duplicate member "${member.characterId}"`)
    memberIds.add(member.characterId)
  }
  if (!team.members?.some((member) => member.carry)) errors.push(`team ${team.id}: carry member is not marked`)
  checkEnum(`team ${team.id} tier`, team.tierLabel, tiersAllowed)
  if (!Array.isArray(team.replacements)) {
    errors.push(`team ${team.id}: replacements must be an array`)
  } else {
    for (const slot of team.replacements) {
      for (const key of ['best', 'good', 'acceptable']) {
        if (!Array.isArray(slot[key])) errors.push(`team ${team.id} replacement ${slot.role}: ${key} must be an array`)
        else checkCharacterReferences(`team ${team.id} replacement ${slot.role}`, slot[key])
      }
    }
  }
  if (!Array.isArray(team.notes)) errors.push(`team ${team.id}: notes must be an array`)
}
for (const record of [...story, ...events]) {
  checkCharacterReferences(`${record.id} featuredCharacters`, record.featuredCharacters)
}
const characterIdByName = new Map(characters.map((character) => [
  character.name.normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().toLocaleLowerCase(),
  character.id,
]))
for (const chapter of story) {
  if (typeof chapter.headline !== 'string' || !chapter.headline.trim()) errors.push(`story ${chapter.id}: headline must be a non-empty string`)
  if (typeof chapter.critique !== 'string' || !chapter.critique.trim()) errors.push(`story ${chapter.id}: critique must be a non-empty string`)
  checkStringArray(`story ${chapter.id} contentNotes`, chapter.contentNotes)
  checkMappedFeaturedNames(`story ${chapter.id}`, chapter.featuredNames)
  checkStringArray(`story ${chapter.id} otherNames`, chapter.otherNames)
  for (const person of chapter.featuredNames ?? []) {
    const expectedId = typeof person?.name === 'string'
      ? characterIdByName.get(person.name.normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().toLocaleLowerCase()) ?? null
      : null
    if (person?.characterId !== expectedId) {
      errors.push(`story ${chapter.id}: featured name "${person?.name}" must map to ${expectedId ?? 'a plain name'}`)
    }
  }
}
for (const event of events) {
  if (typeof event.headline !== 'string' || !event.headline.trim()) errors.push(`event ${event.id}: headline must be a non-empty string`)
  if (typeof event.critique !== 'string' || !event.critique.trim()) errors.push(`event ${event.id}: critique must be a non-empty string`)
  if (event.version !== undefined && event.version !== null && typeof event.version !== 'string') {
    errors.push(`event ${event.id}: version must be a string or null when provided`)
  }
  checkStringArray(`event ${event.id} contentNotes`, event.contentNotes)
  checkMappedFeaturedNames(`event ${event.id}`, event.featuredNames)
  checkStringArray(`event ${event.id} otherNames`, event.otherNames)
  for (const person of event.featuredNames ?? []) {
    const expectedId = typeof person?.name === 'string'
      ? characterIdByName.get(person.name.normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().toLocaleLowerCase()) ?? null
      : null
    if (person?.characterId !== expectedId) {
      errors.push(`event ${event.id}: featured name "${person?.name}" must map to ${expectedId ?? 'a plain name'}`)
    }
  }
}
for (const entry of afflatus) {
  checkEnum(`afflatus id`, entry.id, afflatusNames)
  checkEnum(`afflatus name`, entry.name, afflatusNames)
  checkEnum(`afflatus ${entry.id} triangle`, entry.triangle, trianglesAllowed)
  checkEnum(`afflatus ${entry.id} beats`, entry.beats, afflatusNames)
  checkEnum(`afflatus ${entry.id} weakTo`, entry.weakTo, afflatusNames)
}

const storyOrders = new Set()
for (const entry of story) {
  if (storyOrders.has(entry.order)) errors.push(`story: duplicate order "${entry.order}"`)
  storyOrders.add(entry.order)
}
for (const event of events) {
  if (event.storyId != null && !story.some((entry) => entry.id === event.storyId)) {
    errors.push(`event ${event.id}: unknown linked story id "${event.storyId}"`)
  }
}
for (const entry of manus) {
  if (!Array.isArray(entry.appearances)) continue
  for (const appearance of entry.appearances) {
    if (!storyAndEventIds.has(appearance)) {
      errors.push(`manus ${entry.id}: unknown story/event appearance "${appearance}"`)
    }
  }
}

function checkNestedCharacterIds(value, label) {
  if (Array.isArray(value)) {
    value.forEach((entry) => checkNestedCharacterIds(entry, label))
    return
  }
  if (value === null || typeof value !== 'object') return
  for (const [key, entry] of Object.entries(value)) {
    if (key === 'characterId') checkCharacterReferences(label, [entry])
    else if (key === 'characterIds' || key === 'featuredCharacters') checkCharacterReferences(label, entry)
    else checkNestedCharacterIds(entry, label)
  }
}

for (const record of manus) checkNestedCharacterIds(record, `manus ${record.id}`)

for (const [label, records] of [
  ['story', story],
  ['events', events],
  ['Manus', manus],
  ['teams', teams],
  ['tiers', tiers],
  ['site lore', site.lore ?? []],
]) {
  for (const record of records) {
    if (record.draft !== true) errors.push(`${label} ${record.id ?? record.characterId ?? ''}: draft must be true`)
  }
}
for (const character of characters) {
  if (typeof character.verified !== 'boolean') {
    errors.push(`character ${character.id}: verified must be true or false`)
  } else if (character.draft !== true && character.verified !== true) {
    errors.push(`character ${character.id}: draft can be false only when verified is true`)
  }
}
if (site.manusPageNote?.draft !== true) errors.push('site.json manusPageNote: draft must be true')
if (!Array.isArray(home.premise?.entries)) {
  errors.push('home.json: premise entries must be an array')
} else {
  for (const entry of home.premise.entries) {
    if (!site.lore?.some((lore) => lore.id === entry.loreId)) {
      errors.push(`home.json premise: unknown lore id "${entry.loreId}"`)
    }
  }
}
for (const [label, records] of [['story', story], ['events', events], ['Manus', manus]]) {
  for (const record of records) {
    if (record.spoiler !== true) errors.push(`${label} ${record.id}: spoiler must be true`)
  }
}

function checkImagePaths(value, location = 'content') {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => checkImagePaths(entry, `${location}[${index}]`))
    return
  }
  if (value === null || typeof value !== 'object') return

  for (const [key, entry] of Object.entries(value)) {
    if (key === 'image' && typeof entry === 'string') {
      const relativePath = entry.replace(/^\/+/, '')
      const publicPath = relativePath.startsWith('public/')
        ? resolve(root, relativePath)
        : resolve(root, 'public', relativePath)
      if (relativePath.length === 0 || !existsSync(publicPath)) {
        errors.push(`${location}.image: file not found at "${entry}"`)
      }
    } else {
      checkImagePaths(entry, `${location}.${key}`)
    }
  }
}

checkImagePaths(content)

const tierStubs = characters.filter((character) => character.tierStub === true)
const nameCheckEntries = tiers.filter((entry) => entry.nameNeedsCheck === true)
const unresolvedEntries = Array.isArray(tierCatalog.unresolved) ? tierCatalog.unresolved : []
const hiddenUnknownRarity = tiers.filter((entry) => {
  const minRarity = tierScale.find((band) => band.id === entry.tier)?.minRarity
  return minRarity !== undefined && characters.find((character) => character.id === entry.characterId)?.rarity === null
})
console.log(`Tier data report: ${tierStubs.length} stub characters created.`)
console.log(`Entries with nameNeedsCheck: ${nameCheckEntries.length}`)
for (const entry of nameCheckEntries) {
  console.log(`- ${entry.characterId}: ${entry.name}${entry.spokenAs ? ` (spoken as ${entry.spokenAs})` : ''}`)
}
console.log(`Unresolved list: ${unresolvedEntries.length} entr${unresolvedEntries.length === 1 ? 'y' : 'ies'}.`)
for (const entry of unresolvedEntries) {
  console.log(`- ${entry.issue}`)
}
console.log(`Unknown rarity, hidden by minRarity: ${hiddenUnknownRarity.length}`)
for (const entry of hiddenUnknownRarity) {
  console.log(`- ${entry.characterId}: ${entry.name} (${entry.tier})`)
}

if (errors.length > 0) {
  console.error(`Data validation failed with ${errors.length} error${errors.length === 1 ? '' : 's'}:`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(
    `Data validation passed: ${characters.length} characters, ${story.length} story records, `
    + `${events.length} events, ${teams.length} teams, and ${manus.length} Manus records checked.`,
  )
}
