import type { CharacterRecord, FeaturedRotation } from '../types'

function rotationSeed(date: Date, mode: FeaturedRotation['mode']) {
  if (mode === 'daily') {
    return date.toISOString().slice(0, 10)
  }
  if (mode === 'weekly') {
    const day = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    const weekday = (day.getUTCDay() + 6) % 7
    day.setUTCDate(day.getUTCDate() - weekday + 3)
    const isoYear = day.getUTCFullYear()
    const firstThursday = new Date(Date.UTC(isoYear, 0, 4))
    const firstWeekday = (firstThursday.getUTCDay() + 6) % 7
    firstThursday.setUTCDate(firstThursday.getUTCDate() - firstWeekday + 3)
    const week = 1 + Math.round((day.getTime() - firstThursday.getTime()) / 604800000)
    return `${isoYear}-W${String(week).padStart(2, '0')}`
  }
  return ''
}

function hashSeed(seed: string) {
  let hash = 2166136261
  for (let index = 0; index < seed.length; index += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(index), 16777619)
  }
  return hash >>> 0
}

function mulberry32(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export function selectFeaturedCharacters(
  characters: CharacterRecord[],
  rotation: FeaturedRotation,
  date: Date,
) {
  const pool = characters.filter((character) => character.featured)
  const count = Math.min(Math.max(0, rotation.count), pool.length)

  if (rotation.mode === 'static') return pool.slice(0, count)

  const candidates = pool.slice().sort((first, second) => first.id.localeCompare(second.id))
  const random = mulberry32(hashSeed(rotationSeed(date, rotation.mode)))
  const picks: CharacterRecord[] = []

  while (picks.length < count && candidates.length > 0) {
    const totalWeight = candidates.reduce((total, character) => total + (character.featuredWeight ?? 1), 0)
    let target = random() * totalWeight
    const selectedIndex = candidates.findIndex((character) => {
      target -= character.featuredWeight ?? 1
      return target < 0
    })
    const index = selectedIndex < 0 ? candidates.length - 1 : selectedIndex
    picks.push(candidates[index])
    candidates.splice(index, 1)
  }

  return picks
}
