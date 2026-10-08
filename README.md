# Suitcase Archive

> A fan-made field guide to the arcanists, stories, and ideas of *Reverse: 1999*.

**Suitcase Archive** is a personal fan project inspired by my love for *Reverse: 1999* and my interest in designing and building distinctive websites. I wanted to create an archive in my own visual style, then share that work and my enthusiasm for the game with other fans.

This is an independent, non-commercial project made purely for fun. It is not affiliated with, endorsed by, or sponsored by Bluepoch.

## How it was made

I used AI tools to help build Suitcase Archive, including support with implementation, debugging, and refining the website. The idea, fan perspective, and creative direction are mine; I reviewed and shaped the work into the project you see here.

## About the project

The site presents the world of *Reverse: 1999* as a visual archive: part field guide, part story index, and part collection of personal notes. Its editorial look takes cues from archival labels, printed ephemera, and bold neobrutalist layouts.

### Explore the archive

- **Home** — an introduction to the premise, featured arcanists, and archive contents.
- **Characters** — searchable and filterable character records, with individual dossiers.
- **Story** — an ordered story timeline, event stories, and Manus Vindictae profiles, with spoiler controls.
- **Meta** — personal archetype notes, team ideas, and tier-list opinions.
- **UI kit** — a hidden component showcase at `/kit`, kept out of the main navigation and sitemap.

Entries are maintained in typed JSON content catalogs rather than embedded in page components. Unknown details can remain unverified, and draft content is identified as such. The project includes templates, validation, and helper commands to make adding content easier.

## Built with

- **React 19** and **TypeScript**
- **Vite** for development and production builds
- **Tailwind CSS v4** and project-specific design tokens
- **React Router** for client-side routing and lazy-loaded pages
- **Motion** for interface animations
- **Lenis** for smooth scrolling, with reduced-motion support
- **Bodoni Moda**, **Newsreader**, and **Space Mono** via Fontsource

## Run locally

```bash
npm install
npm run dev
```

Useful project commands:

```bash
npm run validate:data # Check content records and references
npm run lint          # Lint the project
npm run build         # Validate data, type-check, and build for production
npm run preview       # Preview the production build locally
```

To add records from the command line:

```bash
npm run new:character -- "Character Name"
npm run new:lord -- "Manus Lord Name"
npm run new:event -- "Event Story Title"
```

See the [content guide](./CONTENT-GUIDE.md) for field definitions, JSON examples, image guidance, and instructions for adding other content types.

## Fan project and rights notice

Suitcase Archive is an unofficial, non-commercial fan project made out of appreciation for *Reverse: 1999*. It is not connected to Bluepoch and is not an official game resource. The *Reverse: 1999* name, characters, story, art, and other game-related intellectual property belong to Bluepoch and their respective rights holders.

No game assets have been ripped, extracted, or copied for this project. Images are placeholders until suitable permission or official press material is available. Story summaries and descriptions are written independently in my own words. The site has no advertisements, paywalls, or monetization, and nothing is sold through it.

Information and opinions are unofficial, based on game version 3.8, and may be incomplete, outdated, or different from other players' views. Story sections may contain spoilers. This notice is a good-faith explanation of the project, not legal advice or an official license.

Rights holders with a concern about material shown here can contact me through the [repository](https://github.com/HaydrianTumbagahon/suitcase-archive) so I can review and respond promptly.

---

*Built with care by a fan, for fun, and with respect for the people who created the game.*
