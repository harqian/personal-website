# personal-website
svelte project for my personal website

## notes pipeline
- export your IF notes to a JSON file (example: `~/Downloads/personal-2026-2-21.if.json`)
- generate website notes JSON:
  - `npm run generate:notes`
  - or with custom paths: `node scripts/extractWebsiteNotes.js <input-export.json> <output-json>`
- generated file default: `src/lib/websiteNotes.json`
- the `/notes` and `/notes/[slug]` routes now render from that generated JSON

## todo
- put cycling images of interests + other things on the left of the middle chunk and the right of the last chunk
- update projects
- make dark and light mode
  - moonflower -> sunflower
  - have icon next to name that will switch along with the name
- use glob isntead of static array of names for images & writing
- put more writing/notes on here
