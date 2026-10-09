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
  "afflatus": ["Star"],
  "damage": "Mental",
  "roles": ["DPS", "Support"],
  "birthday": "July 27",
  "age": "Unknown",
  "dataComplete": true,
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

`id` is a unique string used in the profile URL; numeric-looking IDs such as `"6"` and `"37"` must remain quoted strings. `name` is the display name. `rarity` is an integer from 2 to 6 or `null`. `afflatus` is an array containing one or more of Beast, Plant, Mineral, Star, Spirit, or Intellect; use `[]` when unverified. `damage` is Reality, Mental, or `null`. `roles` is a list of tags from the vocabulary below. `birthday` and `age` are strings or `null`; use `"Unknown"` when the roster explicitly marks a value unknown and `null` when it is missing. `dataComplete` is a boolean; when false the site displays Unverified and Details pending. `debutVersion` and `debutNote` may be `null`. `dossier` is an independently written profile introduction or `null`; a null dossier displays a "No dossier yet" note. `psychubes` holds Psychube IDs, and `buildNotes` holds build-note text. `featured: true` puts the character into the pool for the rotating home-page feature; it does not promise that the character appears every day. `featuredWeight` is optional and defaults to `1`. A higher number gives the character a better chance when the site picks the rotating selection (for example, weight `3` gives three times the draw weight of weight `1`). To favor a character, raise this number; it must be a positive number. `verified` records editorial review, while `draft` controls whether the record is still a draft. `image` is a public image path or `null`.

The `featuredRotation` setting in `src/content/site.json` controls the home-page picks. `mode: "daily"` changes the selection by UTC date, `mode: "weekly"` changes it by UTC ISO week, and `mode: "static"` always shows the first `count` featured characters in catalog order. `count` is how many characters to show. You can preview the upcoming selections with `npm run check:featured`.

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

The editorial source is [`src/content/story-editorial.json`](./src/content/story-editorial.json). Add each chapter there with its `id`, `number`, arc ID, original `title`, `headline`, `year`, `location`, `summary`, `critique`, `contentNotes`, `featuredNames`, and `otherNames`. Keep every summary spoiler-sensitive; the story page gates summaries behind its reveal control. `featuredNames` and `otherNames` in the editorial source are display names.

Mirror the chapter in [`src/content/story.json`](./src/content/story.json) in the same order:

```json
{
  "id": "chapter-example-the-crossing",
  "order": 999,
  "arc": "Story arc title",
  "chapterLabel": "Chapter 14",
  "title": "The Crossing",
  "headline": "An original editorial headline",
  "year": null,
  "location": null,
  "summary": "An independently written summary in your own words.",
  "critique": "A short reading of the chapter's structure or themes.",
  "contentNotes": [],
  "featuredNames": [
    { "name": "Character Name", "characterId": "character-id" },
    { "name": "Unmatched Name", "characterId": null }
  ],
  "otherNames": ["Another Name"],
  "mentions": [],
  "featuredCharacters": [],
  "spoiler": true,
  "draft": true,
  "image": null
}
```

Use an existing arc title in the rendered record and update its chapter-number list in `story-editorial.json`. Map a featured name to a character ID when that character exists; otherwise set `characterId` to `null` so it remains a plain chip. `featuredCharacters` contains the mapped IDs for character appearance lookups. Keep `spoiler` and `draft` true. `image` is optional.

Replace `999` with the next unused `order` value before saving.

## Event stories

Add editorial event details to `story-editorial.json` and mirror the record in [`src/content/events.json`](./src/content/events.json):

```json
{
  "id": "sample-event-story",
  "title": "Sample Event Story",
  "headline": "An original editorial headline",
  "version": null,
  "year": null,
  "location": null,
  "tone": null,
  "summary": null,
  "critique": "A short reading of the event's structure or themes.",
  "contentNotes": [],
  "featuredNames": [],
  "otherNames": [],
  "featuredCharacters": [],
  "mentions": [],
  "spoiler": true,
  "draft": true,
  "image": null,
  "storyId": null
}
```

`title` is the original event name; the headline is the displayed card title. `version` is optional; `year`, `location`, `tone`, `summary`, `image`, and the optional related `storyId` may be `null`. Match featured names to character IDs where possible, leaving unmatched names as plain chips. Keep spoiler and draft flags true. Run `npm run new:event -- "Sample Event Story"` to add a blank record to both files; it validates automatically. Events appear on `/story` without component edits.

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
  "replacements": [
    {
      "role": "Main DPS",
      "best": ["existing-character-id"],
      "good": [],
      "acceptable": []
    }
  ],
  "notes": [],
  "tierLabel": null,
  "gameVersion": "3.8",
  "opinion": true,
  "draft": true,
  "image": null
}
```

`archetype` groups the team in the Meta page. `explainer` is the short description; `members` must contain exactly four different existing character IDs, with one `carry: true`. `howItWorks` describes the plan. `replacements` holds optional per-role options, ordered as best-in-slot, good replacements, and acceptable or emergency options; each list uses existing character IDs. `notes` is a list of short team-specific notes. `tierLabel` may be `S+`, `S`, `A`, `B`, or `null`. `gameVersion` records the version the opinion applies to. Keep `opinion` and `draft` true; `image` may be `null`.

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

## Game icon images

Icon artwork should be exported at 128x128 pixels as a transparent PNG or WebP, with roughly 8% padding around the artwork so it does not touch the edge. Use a lowercase filename such as `beast.webp` and place it in the matching folder:

- Afflatus: `public/images/icons/afflatus/`
- Damage type: `public/images/icons/damage/`
- Role: `public/images/icons/roles/`

Set the matching path in `src/content/site.json` under `icons`. For example, for a Beast icon:

```json
"icons": {
  "afflatus": {
    "beast": "/images/icons/afflatus/beast.webp"
  }
}
```

The map lists each afflatus and damage type with a `null` value, and `roles` starts as an empty object. Replace a value with the path to its file in `site.json` when adding artwork. For example, use `"/images/icons/afflatus/beast.webp"` for the Beast path. Keep it `null` or leave the role key out to show the text label without an image. `npm run validate:data` checks that every non-null icon path points to an existing file. Icons are optional; the interface does not draw fallback glyphs.

## Roles and other catalogs

The current role vocabulary in [`src/content/site.json`](./src/content/site.json) is:

`DPS`, `Follow-up Attack`, `Support`, `Debuff`, `Purify`, `Heal`, `Inspiration`, `Burst DMG`, `Assassination`, `Control`, `Dispeller`, `DEF`, `Shield`, `Lingering Glow`, `Extra Action`, `Dynamo`, `Ritual`, `Remove Debuffs`, `Conduit`, `Array`, `Nasty Wound`, `Riposte`, `Moxie`, `Burn`, `Poison`, `Remove Buffs`, `Immunity`, `Rewrite`, `Reaper`, `Rank Up`, `Ultimate`, `Bloodtithe`, `Adaptive`, `Self-healing`, `Shift`, `All-Rounder`, and `HP Sacrifice`.

Use these exact spellings in character `roles`. To add a role, add its label to `site.json`'s `roles` array and add the same value to `ROLE_VALUES` in `src/types.ts`. If you have an image for it, set the matching lowercase, punctuation-free key under `site.json`'s `icons.roles` map using the icon instructions above. The validator checks character roles against `site.json`.

The remaining catalogs are `src/content/afflatus.json` (six afflatus matchup records), `src/content/site.json` (site settings, roles, lore, and page copy), `src/content/home.json` (home-page copy and premise references), and `src/content/legal.json` (disclaimer and loader text). Matching record templates, including afflatus and site lore, are in `_templates/`. Premise references in `home.json` must use IDs that exist in `site.json`'s `lore` list.

## Updating the game version

When the game version changes, update `gameVersion` in [`src/content/site.json`](./src/content/site.json). Also update a team's `gameVersion` when its recommendation changes, and review version-specific tier and character notes. The footer, meta banner, and archive counts use site data; no component edit is needed for the site version.

## Validate and build

Run:

```sh
npm run validate:data
npm run build
```

The build runs the validator first and stops if it finds bad JSON, duplicate IDs or story order, invalid role or afflatus values, unknown character/story references, missing tier entries, incorrect draft/spoiler flags, or missing image files (including configured icons).
