import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const contentDirectory = resolve(root, 'src', 'content')
const kind = process.argv[2]
const name = process.argv[3]?.trim()

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function readRecords(fileName) {
  const path = resolve(contentDirectory, fileName)
  const raw = readFileSync(path, 'utf8')
  const records = JSON.parse(raw)
  if (!Array.isArray(records)) throw new Error(`${fileName} must contain a JSON array`)
  return { path, raw, records }
}

function appendedContent(raw, records, record) {
  const closeIndex = raw.lastIndexOf(']')
  if (closeIndex < 0) throw new Error('Could not find the end of the JSON array')
  const newline = raw.includes('\r\n') ? '\r\n' : '\n'
  const prefix = raw.slice(0, closeIndex).trimEnd()
  const comma = records.length > 0 ? ',' : ''
  return `${prefix}${comma}${newline}  ${JSON.stringify(record)}${newline}${raw.slice(closeIndex)}`
}

function createRecord(id) {
  if (kind === 'character') {
    return {
      id,
      name,
      rarity: null,
      afflatus: null,
      damage: null,
      roles: [],
      debutVersion: null,
      debutNote: null,
      dossier: '',
      psychubes: [],
      buildNotes: [],
      featured: false,
      verified: false,
      draft: true,
      image: null,
    }
  }
  if (kind === 'lord') {
    return {
      id,
      name,
      title: null,
      rank: null,
      blurb: null,
      appearances: null,
      spoiler: true,
      draft: true,
      image: null,
    }
  }
  return {
    id,
    title: name,
    version: null,
    tone: null,
    summary: null,
    featuredCharacters: [],
    mentions: [],
    spoiler: true,
    draft: true,
    image: null,
    storyId: null,
  }
}

function main() {
  if (!['character', 'lord', 'event'].includes(kind)) {
    throw new Error('Choose one content type: character, lord, or event')
  }
  if (!name) throw new Error(`Usage: npm run new:${kind} -- "Name"`)

  const id = slugify(name)
  if (!id) throw new Error('The name must contain at least one letter or number')

  const targetFile = kind === 'character'
    ? 'characters.json'
    : kind === 'lord' ? 'manus.json' : 'events.json'
  const target = readRecords(targetFile)
  if (target.records.some((record) => record.id === id)) {
    throw new Error(`${targetFile} already contains id "${id}"`)
  }

  const changes = [{
    ...target,
    next: appendedContent(target.raw, target.records, createRecord(id)),
  }]

  if (kind === 'character') {
    const tiers = readRecords('tiers.json')
    if (tiers.records.some((record) => record.characterId === id)) {
      throw new Error(`tiers.json already contains character id "${id}"`)
    }
    const tier = { characterId: id, tier: 'Unrated', reason: 'No notes yet.', draft: true }
    changes.push({
      ...tiers,
      next: appendedContent(tiers.raw, tiers.records, tier),
    })
  }

  try {
    for (const change of changes) writeFileSync(change.path, change.next, 'utf8')
    const result = spawnSync(
      process.execPath,
      [resolve(root, 'scripts', 'validate-data.ts')],
      { cwd: root, stdio: 'inherit' },
    )
    if (result.error) throw result.error
    if (result.status !== 0) throw new Error('Data validation failed; generated record(s) were rolled back')
    console.log(`Added ${kind} "${name}" with id "${id}".`)
  } catch (error) {
    for (const change of changes) writeFileSync(change.path, change.raw, 'utf8')
    throw error
  }
}

try {
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
}
