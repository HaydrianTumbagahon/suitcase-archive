import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { selectFeaturedCharacters } from '../src/data/featured.ts'

const root = process.cwd()
const characters = JSON.parse(readFileSync(resolve(root, 'src/content/characters.json'), 'utf8'))
const site = JSON.parse(readFileSync(resolve(root, 'src/content/site.json'), 'utf8'))
const start = new Date()
start.setUTCHours(0, 0, 0, 0)

for (let offset = 0; offset < 7; offset += 1) {
  const date = new Date(start)
  date.setUTCDate(start.getUTCDate() + offset)
  const picks = selectFeaturedCharacters(characters, site.featuredRotation, date)
  console.log(`${date.toISOString().slice(0, 10)}: ${picks.map((character) => character.name).join(', ')}`)
}
