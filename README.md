# Waterfront Solutions — Deck Materials Takeoff (MVP)

Internal tool that turns rectangular deck dimensions + a material choice into a
correct parts list, an editable review, and a printable order sheet with the
expected **leftover** (so ~$1,000 of decking stops going in the dumpster).

This is an MVP / demo — local-first, no backend, no auth.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

That's the whole setup. Jobs and pricing persist to your browser's
`localStorage`.

## The 60-second demo

1. **+ New job** → enter `12` length × `16` projection, TimberTech composite.
2. **Review parts list** → believable framing / decking / fasteners / railing /
   fascia quantities. Override any "Qty to Order" inline; it saves on the job.
3. **Build order sheet** → grouped, rounded to purchase units, with expected
   leftover and an estimated material-cost total. **Print / Save PDF** or
   **Download CSV**.
4. **Materials & Pricing** (top nav) → type in real TimberTech / Westbury prices
   and watch every total update live. **Reset to defaults** restores the seeds.

## Where the numbers live

All formulas and every constant (board sizes, gaps, spacing, waste %, fastener
coverage, unit prices) are in one file: [`src/materialRules.js`](src/materialRules.js).
Everything marked `PLACEHOLDER — confirm with Will's real numbers` is a seeded
industry default. You normally don't edit the file — the in-app **Materials &
Pricing** panel exposes the same values and persists edits to `localStorage`.

The key formulas, commented in that file:

- **Joists:** `floor(span / spacing) + 1` — the `+1` is the fencepost board
  that gets missed by hand.
- **Decking:** `rows = ceil(depth / (boardWidth + gap))`,
  `boards = rows × boardsPerRow`, then waste %.
- **Railing:** `sections = ceil(linealFt / sectionLength)`, posts/caps/mounts
  derived from sections.
- **Fasteners:** hidden-clip coverage per sq ft.
- **Leftover:** every item rounds **up** to its purchase unit;
  `leftover = qtyToOrder × coverage − qtyNeeded`, valued at the unit price.

## Deploy (Cloudflare Pages)

Static Vite build. Either connect the GitHub repo in the Pages dashboard or:

```bash
npm run build                              # outputs to dist/
npx wrangler pages deploy dist             # or set output dir = dist in the UI
```

- Build command: `npm run build`
- Output directory: `dist`

## Branding

Drop the real logo at `public/logo.png` and it appears in the header and on the
order sheet automatically. Until then a clean wave-mark wordmark stands in.

## Out of scope (intentionally)

Accounts / multi-user, supplier SKU/API sync, L-shaped or multi-level decks,
seawalls / docks / driveways, time/ad tracking, photo or CAD import. Extension
points are left clean, but the MVP stays focused on the rectangular-deck flow.
