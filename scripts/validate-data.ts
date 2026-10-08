import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const contentDirectory = resolve(root, 'src', 'content')
const fileNames = [
  'site.json',
  'characters.json',
  'psychubes.json',
  'story.json',
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
const tiers = readArray('tiers')
const afflatus = readArray('afflatus')
const characterIds = new Set(characters.map((entry) => entry.id))
const storyAndEventIds = new Set([...story, ...events].map((entry) => entry.id))

function checkUniqueIds(label, records, key = 'id') {
  const seen = new Set()
  for (const record of records) {
    const id = record?.[key]
    if (id == null) continue
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
const afflatusNames = ['Beast', 'Plant', 'Mineral', 'Star', 'Spirit', 'Intellect']
const damageTypes = ['Reality', 'Mental']
const tiersAllowed = ['S+', 'S', 'A', 'B', 'Unrated']
const trianglesAllowed = ['A', 'B']

for (const character of characters) {
  checkEnum(`character ${character.id} afflatus`, character.afflatus, afflatusNames)
  checkEnum(`character ${character.id} damage`, character.damage, damageTypes)
  for (const role of character.roles ?? []) {
    checkEnum(`character ${character.id} role`, role, roles)
  }
}
for (const record of tiers) {
  checkCharacterReferences('tiers', [record.characterId])
  checkEnum(`tier for ${record.characterId}`, record.tier, tiersAllowed)
}
for (const character of characters) {
  if (!tiers.some((entry) => entry.characterId === character.id)) {
    errors.push(`tiers: no tier entry for character "${character.id}"`)
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
}
for (const record of [...story, ...events]) {
  checkCharacterReferences(`${record.id} featuredCharacters`, record.featuredCharacters)
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
