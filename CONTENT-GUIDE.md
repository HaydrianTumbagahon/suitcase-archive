# Content guide

Archive pages read their entries from the JSON files in `src/content/`. To add or change content, edit the matching catalog, save valid JSON, then run `npm run validate:data`. `npm run build` runs that check automatically before it builds the site.

Ready-to-copy record shapes are in [`src/content/_templates/`](./src/content/_templates/). Each template is a standalone JSON object, not a whole catalog. Copy its fields into the matching array file and replace the example values. JSON does not allow comments, so the notes below explain each field.

## General rules

- Keep every `id` unique across catalogs. Use lowercase words separated by hyphens, such as `chapter-14-the-crossing`.
- Use `null` when a value is not known. Do not guess, use `"unknown"`, or leave out a nullable field.
- Keep required lists as `[]` when there are no entries yet. Use `""` for required text that has not been written; use `null` only where the field is nullable.
- New or unreviewed records stay `draft: true`. Story, event, and Manus records also stay `spoiler: true`.
- A character may be marked `verified: true` and `draft: false` once its information has been checked. An unverified character must remain a draft. Other record types are currently required by the validator to remain drafts.
- For images, put the file at `public/images/characters/<id>.webp`, then set `"image": "/images/characters/<id>.webp"`. Use `null` until you have an allowed image. The validator checks that any named image file exists.

## Characters

The character catalog is [`src/content/characters.json`](./src/content/characters.json), an array of character objects. Example:

```json
{
  "id": "sample-arcanist",
  "name": "Sample Arcanist",
  "rarity": 6,
  "afflatus": "Star",
  "damage": "Mental",
  "roles": ["DPS", "Support"],
  "debutVersion": "3.8",
  "debutNote": null,
  "dossier": "A short, independently written introduction.",
  "psychubes": [],
  "buildNotes": [],
  "featured": false,
  "verified": false,
  "draft": true,
  "image": null
}
```

`id` is the stable URL slug; `name` is the display name. `rarity` is a number or `null`; `afflatus` is one of Beast, Plant, Mineral, Star, Spirit, or Intellect; `damage` is Reality or Mental. `roles` is a list of role tags. `debutVersion` and `debutNote` may be `null`. `dossier` is the profile introduction. `psychubes` holds Psychube IDs, and `buildNotes` holds build-note text. `featured` controls whether the character is highlighted on the home page. `verified` records editorial review, while `draft` controls whether the record is still a draft. `image` is a public image path or `null`.

To add a character quickly, run `npm run new:character -- "Sample Arcanist"`. The command creates a slug ID, fills optional facts with `null`, leaves the record as an unverified draft, adds an Unrated tier entry, and validates the data. Then edit the new record with any known details. New characters automatically join the character list, filters, and their `/characters/<id>` profile route; no page component changes are needed.

## Psychubes

Add Psychube records to [`src/content/psychubes.json`](./src/content/psychubes.json):

```json
{
  "id": "sample-psychube",
  "name": "Sample Psychube",
  "image": null
}
```

`id` is the stable reference used in character `psychubes` lists, `name` is the display name, and `image` is an optional public image path.

## Story chapters

Add chapters to [`src/content/story.json`](./src/content/story.json):

```json
{
  "id": "chapter-example-the-crossing",
  "order": 999,
  "arc": "Main Story: Chapters 1-13",
  "chapterLabel": "Chapter 14",
  "title": "The Crossing",
  "year": null,
  "location": null,
  "summary": "An independently written summary in your own words.",
  "mentions": [],
  "featuredCharacters": [],
  "spoiler": true,
  "draft": true,
  "image": null
}
```

Set `order` to a unique number after the last record in the intended reading sequence. The timeline uses this number, not the year, so a chapter with an unknown or out-of-sequence year still appears in the correct place. `arc` groups chapters; use an existing arc name or a new descriptive one. `chapterLabel` is the human-facing chapter or episode label; `title` is its title. `year` and `location` may each be `null`. Write `summary` independently in your own words. `mentions` is a list of plain-text names; `featuredCharacters` is a list of existing character IDs that link to profiles. Keep `spoiler` and `draft` true. `image` is optional.

Replace `999` with the next unused `order` value before saving.

## Event stories

Add event records to [`src/content/events.json`](./src/content/events.json):

```json
{
  "id": "sample-event-story",
  "title": "Sample Event Story",
  "version": null,
  "tone": null,
  "summary": null,
  "featuredCharacters": [],
  "mentions": [],
  "spoiler": true,
  "draft": true,
  "image": null,
  "storyId": null
}
```

`title` is the event name. `version`, `tone`, `summary`, `image`, and the optional related `storyId` may be `null`. `featuredCharacters` contains existing character IDs; `mentions` contains text-only names. If `storyId` is supplied, it must match a story chapter ID. Event summaries must be your own wording. Keep spoiler and draft flags true. Run `npm run new:event -- "Sample Event Story"` to generate a blank event; it validates automatically. Events appear on `/story` without component edits.

## Manus lords

Add Manus records to [`src/content/manus.json`](./src/content/manus.json):

```json
{
  "id": "sample-lord",
  "name": "Sample Lord",
  "title": null,
  "rank": null,
  "blurb": null,
  "appearances": null,
  "spoiler": true,
  "draft": true,
  "image": null
}
```

`name` is the lord's display name. `title`, `rank`, `blurb`, `appearances`, and `image` can be `null` until known. When supplied, `appearances` is a list of story or event IDs. Keep the spoiler and draft flags true. Run `npm run new:lord -- "Sample Lord"` to generate a blank record; it validates automatically. New lords appear on `/story` without component edits.

## Teams

Add team records to [`src/content/teams.json`](./src/content/teams.json):

```json
{
  "id": "sample-team",
  "name": "Sample Team",
  "archetype": "Burn",
  "explainer": "A short note about the team's intended focus.",
  "members": [
    { "characterId": "existing-character-one", "carry": true },
    { "characterId": "existing-character-two", "carry": false },
    { "characterId": "existing-character-three", "carry": false },
    { "characterId": "existing-character-four", "carry": false }
  ],
  "howItWorks": "Explain the team's plan in your own words.",
  "tierLabel": null,
  "gameVersion": "3.8",
  "opinion": true,
  "draft": true,
  "image": null
}
```

`archetype` groups the team in the Meta page. `explainer` is the short description; `members` must contain exactly four different existing character IDs, with one `carry: true`. `howItWorks` describes the plan. `tierLabel` may be `S+`, `S`, `A`, `B`, or `null`. `gameVersion` records the version the opinion applies to. Keep `opinion` and `draft` true; `image` may be `null`.

## Tier entries

Add tier entries to [`src/content/tiers.json`](./src/content/tiers.json):

```json
{
  "characterId": "existing-character-id",
  "tier": "Unrated",
  "reason": "No notes yet.",
  "draft": true
}
```

There is one tier entry per character. `characterId` must match a character `id`; `tier` is `S+`, `S`, `A`, `B`, or `Unrated`; `reason` is your opinion or note. Keep entries in draft while they are work in progress. The new-character command adds an Unrated entry automatically.

## Roles and other catalogs

The current role vocabulary in [`src/content/site.json`](./src/content/site.json) is:

`DPS`, `Burst DMG`, `Healer`, `Support`, `Sub-DPS`, `Main Carry`, `Dynamo`, `Extra Action`, `Burn`, `Poison`, `Dispeller`, `Assassination`, `Sustain`, `Barrier`, `Team Buffs`, `Conduit`, `Riposte`, `Shield`, `Lingering Glow`, and `All-Rounder`.

Use these exact spellings in character `roles`. To add a role, add its label to `site.json`'s `roles` array, add the same value to `ROLE_VALUES` in `src/types.ts`, then add a lowercase, punctuation-free icon key and glyph in `iconPaths` and `allowedValues.role` in `src/components/ui/Icon.tsx`. The validator checks character roles against `site.json`; the TypeScript and icon updates keep the rest of the app consistent.

The remaining catalogs are `src/content/afflatus.json` (six afflatus matchup records), `src/content/site.json` (site settings, roles, lore, and page copy), `src/content/home.json` (home-page copy and premise references), and `src/content/legal.json` (disclaimer and loader text). Matching record templates, including afflatus and site lore, are in `_templates/`. Premise references in `home.json` must use IDs that exist in `site.json`'s `lore` list.

## Updating the game version

When the game version changes, update `gameVersion` in [`src/content/site.json`](./src/content/site.json). Also update a team's `gameVersion` when its recommendation changes, and review version-specific tier and character notes. The footer, meta banner, and archive counts use site data; no component edit is needed for the site version.

## Validate and build

Run:

```sh
npm run validate:data
npm run build
```

The build runs the validator first and stops if it finds bad JSON, duplicate IDs or story order, invalid role or afflatus values, unknown character/story references, missing tier entries, incorrect draft/spoiler flags, or missing image files.
