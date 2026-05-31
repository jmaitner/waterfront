# Waterfront Solutions — Materials Takeoff (MVP)

Internal tool that turns a job into a correct parts list, an editable review,
and a printable order sheet with the expected **leftover** (so ~$1,000 of
decking stops going in the dumpster).

A job is a **list of components** — a deck section, a stair run with landings, a
railing run, a retaining/seawall, or freeform custom items. Each component knows
its own formula; the app merges them all into one combined order sheet (so all
the decking across the deck *and* the stairs lands in one place, which is where
the leftover math earns its keep). The classic 12×16 rectangular deck is just
the default component, so the simple case stays one click away.

This is an MVP / demo — local-first, no backend, no auth.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

That's the whole setup. Jobs and pricing persist to your browser's
`localStorage`.

## The 60-second demo

1. **+ New job** → starts with a `12 × 16` TimberTech deck component already
   filled in. Optionally **+ Add component** → a bluff staircase (e.g. 18 ft
   rise, 2 landings), a railing run, a seawall, or a custom kayak-ramp line.
2. **Review parts list** → every component's items merge into shared categories
   (Framing / Decking / Fasteners / Railing / Trim / Posts / Custom), each
   tagged with its source. Override any "Qty to Order" inline; it saves on the
   job.
3. **Build order sheet** → grouped, rounded to purchase units, with expected
   leftover and an estimated material-cost total. **Print / Save PDF** or
   **Download CSV**.
4. **Customer quote** → answer "Create a customer-facing quote?" Yes. It seeds a
   priced line per component from material cost; set **markup or margin %**, add
   labor / permits / demo lines, and a clean branded **customer quote** (prices
   only — no cost or margin) previews live. Print or CSV it.
5. **Materials & Pricing** (top nav) → type in real TimberTech / Westbury prices
   and watch every total update live. **Reset to defaults** restores the seeds.

Every job gets a number (**WF-1001**) and a **revision** that bumps once per
editing session — open a saved job, change it, it becomes Rev 2. The materials
order sheet (internal: costs + leftover) and the customer quote (external:
prices) are two separate documents off the same job.

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

## Adding a new component type

The component model is the extension point. To add one (e.g. a pergola):

1. Add its defaults + a `computeX(inputs, cfg)` that returns raw line items in
   `src/materialRules.js`, and wire it into `computeComponent`.
2. Add an entry to `COMPONENT_TYPES` and an editor in
   `src/components/ComponentEditors.jsx`.

Items flow into the shared order sheet automatically.

## Out of scope (intentionally)

Accounts / multi-user, supplier SKU/API sync, true multi-level / L-shaped deck
*geometry* (each section is still entered as a rectangle), engineered structural
sizing, time/ad tracking, photo or CAD import. The stairs and retaining-wall
formulas are believable approximations driven by seeded placeholders — confirm
with Will before quoting off them.
