// ============================================================================
// Waterfront Solutions — Material Rules & Pricing Engine
// ============================================================================
// THIS FILE IS THE WHOLE BRAIN OF THE APP.
//
// A JOB is a list of COMPONENTS. Each component (a deck, a stair run, a railing
// run, a retaining wall, or a bag of custom items) knows how to turn its own
// inputs into line items. The app just adds every component's items into one
// combined, grouped order sheet. So a real Waterfront job — "deck + bluff stair
// with 3 landings + 200 ft of railing + a kayak ramp" — is just five components
// on one job.
//
// Every number a non-coder might need to fix lives in DEFAULT_CONFIG below as a
// named, commented value. Anything marked:
//
//     PLACEHOLDER — confirm with Will's real numbers
//
// is a seeded industry default so the app runs out of the box. The in-app
// "Materials & Pricing" panel exposes all of these same values as editable
// fields, so you normally won't even open this file.
// ============================================================================

export const DEFAULT_CONFIG = {
  // ---- DECKING ------------------------------------------------------------
  deckBoardWidthIn: 5.5, // PLACEHOLDER — composite board face width, inches
  deckBoardGapIn: 0.25, // PLACEHOLDER — gap left between boards, inches (1/4")
  deckBoardLengthsFt: [12, 16, 20], // board lengths you can actually buy (ft)
  deckWastePct: 10, // PLACEHOLDER — cutoff / breakage waste allowance (%)
  pricePerFt_timbertech: 4.5, // PLACEHOLDER — TimberTech composite, $ / lineal ft
  pricePerFt_pt: 1.75, // PLACEHOLDER — pressure-treated decking, $ / lineal ft
  pricePerFt_trex: 4.25, // PLACEHOLDER — Trex composite, $ / lineal ft

  // ---- FRAMING ------------------------------------------------------------
  joistSpacingIn_composite: 12, // PLACEHOLDER — joist O.C. spacing for composite
  joistSpacingIn_wood: 16, // PLACEHOLDER — joist O.C. spacing for wood
  framingLengthsFt: [12, 16, 20], // framing lumber lengths you can buy (ft)
  beamPlies: 2, // boards laminated together to make the carrying beam
  framingPricePerFt: 1.2, // PLACEHOLDER — 2x10 PT framing lumber, $ / lineal ft
  hangerPrice: 3.25, // PLACEHOLDER — galvanized joist hanger, $ each

  // ---- FASTENERS ----------------------------------------------------------
  clipsPerSqFt: 3.5, // PLACEHOLDER — hidden deck clips needed per sq ft
  clipsPerBox: 90, // PLACEHOLDER — clips in one box
  clipBoxPrice: 45, // PLACEHOLDER — $ per box of hidden clips
  framingScrewCoverageSqFt: 50, // PLACEHOLDER — sq ft one box of structural screws covers
  framingScrewBoxPrice: 35, // PLACEHOLDER — $ per box of structural screws
  hangerScrewsPerJoist: 14, // PLACEHOLDER — hanger screws used per joist (both ends)
  hangerScrewsPerBox: 100, // PLACEHOLDER — hanger/connector screws per box
  hangerScrewBoxPrice: 12, // PLACEHOLDER — $ per box of hanger screws

  // ---- RAILING (Westbury aluminum) ---------------------------------------
  railingSectionFt: 8, // PLACEHOLDER — Westbury section length (6 or 8 ft)
  railingSectionPrice: 95, // PLACEHOLDER — $ per railing section kit (rails + balusters)
  railingPostPrice: 38, // PLACEHOLDER — $ per railing post
  railingPostCapPrice: 12, // PLACEHOLDER — $ per post cap
  railingMountPrice: 18, // PLACEHOLDER — $ per post mounting / hardware kit

  // ---- TRIM & FASCIA ------------------------------------------------------
  fasciaPricePerFt: 5.5, // PLACEHOLDER — composite fascia, $ / lineal ft
  fasciaLengthsFt: [12, 16, 20], // fascia board lengths you can buy (ft)

  // ---- POSTS & FOOTINGS ---------------------------------------------------
  postSpacingFt: 8, // PLACEHOLDER — max spacing between support posts (ft)
  maxBeamSpanFt: 12, // PLACEHOLDER — past this depth a 2nd beam line is added
  supportPostPricePerFt: 4.0, // PLACEHOLDER — 6x6 PT post, $ / lineal ft
  concreteBagsPerFooting: 3, // PLACEHOLDER — bags of concrete per footing
  concreteBagPrice: 6.5, // PLACEHOLDER — $ per bag of concrete

  // ---- LABOR --------------------------------------------------------------
  laborRatePerHr: 65, // PLACEHOLDER — default crew labor rate, $ / hour

  // ---- STAIRS -------------------------------------------------------------
  stairTargetRiserIn: 7.5, // PLACEHOLDER — target step rise, inches (code ~7.75 max)
  stairTreadRunIn: 11, // PLACEHOLDER — tread run (depth) per step, inches
  stairStringerSpacingFt: 1.33, // PLACEHOLDER — spacing between stringers (~16" O.C.)
  stairTreadBoardsPerStep: 2, // PLACEHOLDER — decking boards across each tread
  stairStringerPricePerFt: 1.6, // PLACEHOLDER — 2x12 PT stringer stock, $ / lineal ft

  // ---- RETAINING WALL / SEAWALL ------------------------------------------
  wallBlockFaceSqFt: 0.75, // PLACEHOLDER — face area of one block (sq ft)
  wallBlockPrice: 6.25, // PLACEHOLDER — $ per retaining-wall block
  wallCapLenFt: 1.0, // PLACEHOLDER — coverage of one cap block (ft)
  wallCapPrice: 7.5, // PLACEHOLDER — $ per cap block
  wallGravelTonPerFaceSqFt: 0.03, // PLACEHOLDER — tons of base/backfill gravel per face sq ft
  wallGravelTonPrice: 38, // PLACEHOLDER — $ per ton of gravel (delivered)
  wallFabricPrice: 0.45, // PLACEHOLDER — drainage fabric, $ / sq ft
  wallDrainPipePrice: 2.25, // PLACEHOLDER — perforated drain pipe, $ / lineal ft
  // Timber-wall option
  wallTimberHeightFt: 0.5, // PLACEHOLDER — height of one timber course (6x6 = 0.5 ft)
  wallTimberLengthsFt: [8, 12], // timber lengths you can buy (ft)
  wallTimberPricePerFt: 3.25, // PLACEHOLDER — 6x6 PT timber, $ / lineal ft
  wallSpikesPerTimber: 3, // PLACEHOLDER — landscape spikes per timber
  wallSpikePrice: 2.1, // PLACEHOLDER — $ per timber spike
}

// The settings panel renders from this schema so a non-coder sees friendly
// labels and units instead of raw variable names.
export const SETTINGS_SCHEMA = [
  {
    group: 'Decking',
    fields: [
      { key: 'deckBoardWidthIn', label: 'Board face width', unit: 'in' },
      { key: 'deckBoardGapIn', label: 'Gap between boards', unit: 'in' },
      { key: 'deckBoardLengthsFt', label: 'Board lengths sold', type: 'lengths', unit: 'ft' },
      { key: 'deckWastePct', label: 'Waste allowance', type: 'pct' },
      { key: 'pricePerFt_timbertech', label: 'TimberTech price', type: 'money', unit: '/ft' },
      { key: 'pricePerFt_pt', label: 'Pressure-treated price', type: 'money', unit: '/ft' },
      { key: 'pricePerFt_trex', label: 'Trex price', type: 'money', unit: '/ft' },
    ],
  },
  {
    group: 'Framing',
    fields: [
      { key: 'joistSpacingIn_composite', label: 'Joist spacing (composite)', unit: 'in O.C.' },
      { key: 'joistSpacingIn_wood', label: 'Joist spacing (wood)', unit: 'in O.C.' },
      { key: 'framingLengthsFt', label: 'Framing lengths sold', type: 'lengths', unit: 'ft' },
      { key: 'beamPlies', label: 'Beam plies', unit: 'boards' },
      { key: 'framingPricePerFt', label: 'Framing lumber price', type: 'money', unit: '/ft' },
      { key: 'hangerPrice', label: 'Joist hanger price', type: 'money', unit: 'ea' },
    ],
  },
  {
    group: 'Fasteners',
    fields: [
      { key: 'clipsPerSqFt', label: 'Hidden clips per sq ft' },
      { key: 'clipsPerBox', label: 'Clips per box' },
      { key: 'clipBoxPrice', label: 'Clip box price', type: 'money', unit: 'box' },
      { key: 'framingScrewCoverageSqFt', label: 'Structural screws cover', unit: 'sq ft/box' },
      { key: 'framingScrewBoxPrice', label: 'Structural screw box', type: 'money', unit: 'box' },
      { key: 'hangerScrewsPerJoist', label: 'Hanger screws per joist' },
      { key: 'hangerScrewsPerBox', label: 'Hanger screws per box' },
      { key: 'hangerScrewBoxPrice', label: 'Hanger screw box', type: 'money', unit: 'box' },
    ],
  },
  {
    group: 'Railing',
    fields: [
      { key: 'railingSectionFt', label: 'Section length', unit: 'ft' },
      { key: 'railingSectionPrice', label: 'Section kit price', type: 'money', unit: 'ea' },
      { key: 'railingPostPrice', label: 'Post price', type: 'money', unit: 'ea' },
      { key: 'railingPostCapPrice', label: 'Post cap price', type: 'money', unit: 'ea' },
      { key: 'railingMountPrice', label: 'Mount kit price', type: 'money', unit: 'ea' },
    ],
  },
  {
    group: 'Trim & Fascia',
    fields: [
      { key: 'fasciaPricePerFt', label: 'Fascia price', type: 'money', unit: '/ft' },
      { key: 'fasciaLengthsFt', label: 'Fascia lengths sold', type: 'lengths', unit: 'ft' },
    ],
  },
  {
    group: 'Posts & Footings',
    fields: [
      { key: 'postSpacingFt', label: 'Max post spacing', unit: 'ft' },
      { key: 'maxBeamSpanFt', label: 'Max beam span', unit: 'ft' },
      { key: 'supportPostPricePerFt', label: '6x6 post price', type: 'money', unit: '/ft' },
      { key: 'concreteBagsPerFooting', label: 'Concrete bags / footing' },
      { key: 'concreteBagPrice', label: 'Concrete bag price', type: 'money', unit: 'ea' },
    ],
  },
  {
    group: 'Labor',
    fields: [{ key: 'laborRatePerHr', label: 'Crew labor rate', type: 'money', unit: '/hr' }],
  },
  {
    group: 'Stairs',
    fields: [
      { key: 'stairTargetRiserIn', label: 'Target riser height', unit: 'in' },
      { key: 'stairTreadRunIn', label: 'Tread run (depth)', unit: 'in' },
      { key: 'stairStringerSpacingFt', label: 'Stringer spacing', unit: 'ft' },
      { key: 'stairTreadBoardsPerStep', label: 'Tread boards per step' },
      { key: 'stairStringerPricePerFt', label: 'Stringer stock price', type: 'money', unit: '/ft' },
    ],
  },
  {
    group: 'Retaining Wall',
    fields: [
      { key: 'wallBlockFaceSqFt', label: 'Block face area', unit: 'sq ft' },
      { key: 'wallBlockPrice', label: 'Block price', type: 'money', unit: 'ea' },
      { key: 'wallCapLenFt', label: 'Cap block coverage', unit: 'ft' },
      { key: 'wallCapPrice', label: 'Cap block price', type: 'money', unit: 'ea' },
      { key: 'wallGravelTonPerFaceSqFt', label: 'Gravel per face sq ft', unit: 'ton' },
      { key: 'wallGravelTonPrice', label: 'Gravel price', type: 'money', unit: 'ton' },
      { key: 'wallFabricPrice', label: 'Drainage fabric', type: 'money', unit: '/sq ft' },
      { key: 'wallDrainPipePrice', label: 'Drain pipe', type: 'money', unit: '/ft' },
      { key: 'wallTimberHeightFt', label: 'Timber course height', unit: 'ft' },
      { key: 'wallTimberLengthsFt', label: 'Timber lengths sold', type: 'lengths', unit: 'ft' },
      { key: 'wallTimberPricePerFt', label: 'Timber price', type: 'money', unit: '/ft' },
      { key: 'wallSpikesPerTimber', label: 'Spikes per timber' },
      { key: 'wallSpikePrice', label: 'Spike price', type: 'money', unit: 'ea' },
    ],
  },
]

export const MATERIAL_LABELS = {
  timbertech: 'TimberTech composite',
  pt: 'Pressure-treated wood',
  trex: 'Trex composite',
}

// ---------------------------------------------------------------------------
// COMPONENT TYPES — the menu of things a job can be made of.
// ---------------------------------------------------------------------------
export const COMPONENT_TYPES = [
  { type: 'deck', label: 'Deck section', blurb: 'Rectangular deck — framing, decking, fascia, railing.' },
  { type: 'stairs', label: 'Stairs / landings', blurb: 'Stair run with optional landings (bluff stairs).' },
  { type: 'railing', label: 'Railing run', blurb: 'Standalone railing by the lineal foot.' },
  { type: 'wall', label: 'Retaining wall / seawall', blurb: 'Block or timber wall by length × height.' },
  { type: 'custom', label: 'Custom items', blurb: 'Anything else — kayak ramp, one-offs. Add items by hand.' },
]

// Default inputs per component type.
const DECK_DEFAULTS = {
  lengthFt: 12, // along the house
  depthFt: 16, // projection out from the house
  heightFt: 3, // drives post length + footing count
  material: 'timbertech',
  boardDirection: 'parallel', // 'parallel' | 'perpendicular' to house
  joistSpacingIn: null, // null = material default
  railing: { house: false, far: true, left: true, right: true },
}
const STAIRS_DEFAULTS = {
  riseFt: 3, // total vertical drop (a bluff run might be 18+)
  widthFt: 4,
  landings: 0, // intermediate landings
  landingSizeFt: 4, // landing depth, square-ish
  material: 'timbertech',
  railedBothSides: true,
}
const RAILING_DEFAULTS = {
  linealFt: 24,
  sides: 1, // 1 = single run, 2 = both sides of a walk
}
const WALL_DEFAULTS = {
  type: 'block', // 'block' | 'timber'
  lengthFt: 20,
  heightFt: 3,
}

let _uid = 0
function uid(prefix) {
  _uid += 1
  return `${prefix}_${_uid}_${Math.floor(Math.random() * 1e6).toString(36)}`
}

// Make a fresh component of a given type.
export function newComponent(type) {
  const meta = COMPONENT_TYPES.find((c) => c.type === type) || COMPONENT_TYPES[0]
  const base = { id: uid(type), type, label: meta.label, overrides: {} }
  if (type === 'deck') return { ...base, inputs: structuredClone(DECK_DEFAULTS) }
  if (type === 'stairs') return { ...base, inputs: structuredClone(STAIRS_DEFAULTS) }
  if (type === 'railing') return { ...base, inputs: structuredClone(RAILING_DEFAULTS) }
  if (type === 'wall') return { ...base, inputs: structuredClone(WALL_DEFAULTS) }
  if (type === 'custom') return { ...base, items: [] }
  return base
}

// A brand-new job starts with one deck (keeps the classic demo one click away).
export function newJobComponents() {
  return [newComponent('deck')]
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

// Pick the stock length that wastes the least lineal footage covering a run.
function pickLength(runFt, lengths) {
  let best = null
  for (const L of lengths) {
    const n = Math.ceil(runFt / L)
    const waste = n * L - runFt
    if (!best || waste < best.waste || (waste === best.waste && n < best.perRun)) {
      best = { length: L, perRun: n, waste }
    }
  }
  return best || { length: lengths[0], perRun: 1, waste: 0 }
}

function deckingPricePerFt(material, cfg) {
  if (material === 'pt') return cfg.pricePerFt_pt
  if (material === 'trex') return cfg.pricePerFt_trex
  return cfg.pricePerFt_timbertech
}

// ---------------------------------------------------------------------------
// computeJob(job, cfg) -> { components, categories, totals }
//
// Runs every component, then merges their line items into shared material
// categories so ALL the decking (deck + stairs) lands in one place — that's
// where the leftover math earns its keep.
// ---------------------------------------------------------------------------
export function computeJob(job, cfg) {
  const components = (job.components || []).map((comp) => ({
    comp,
    ...computeComponent(comp, cfg),
  }))

  const all = components.flatMap((c) => c.items)
  const order = [
    'Framing', 'Decking', 'Fasteners', 'Railing', 'Trim & Fascia',
    'Posts & Footings', 'Retaining Wall', 'Custom',
  ]
  const categories = order
    .map((name) => ({ name, items: all.filter((it) => it.category === name) }))
    .filter((c) => c.items.length > 0)

  const totals = all.reduce(
    (t, it) => {
      t.materialCost += it.lineCost
      t.leftoverValue += it.leftoverValue
      t.itemCount += 1
      return t
    },
    { materialCost: 0, leftoverValue: 0, itemCount: 0 },
  )

  return { components, categories, totals }
}

// Run a single component -> finalized, tagged line items + a one-line summary.
export function computeComponent(comp, cfg) {
  let raw = []
  let summary = ''
  if (comp.type === 'deck') ({ raw, summary } = computeDeck(comp.inputs, cfg))
  else if (comp.type === 'stairs') ({ raw, summary } = computeStairs(comp.inputs, cfg))
  else if (comp.type === 'railing') ({ raw, summary } = computeRailing(comp.inputs, cfg))
  else if (comp.type === 'wall') ({ raw, summary } = computeWall(comp.inputs, cfg))
  else if (comp.type === 'custom') ({ raw, summary } = computeCustom(comp.items || [], cfg))

  const ov = comp.overrides || {}
  const items = raw
    .map((it) => {
      const f = finalize(it, ov[it.id])
      if (!f) return null // removed by the user on the review step
      return { ...f, componentId: comp.id, sourceLabel: comp.label, key: `${comp.id}::${it.id}` }
    })
    .filter(Boolean)
  return { items, summary }
}

// ---------------------------------------------------------------------------
// DECK
// ---------------------------------------------------------------------------
function computeDeck(inp, cfg) {
  const lengthFt = num(inp.lengthFt)
  const depthFt = num(inp.depthFt)
  const heightFt = num(inp.heightFt)
  const areaSqFt = lengthFt * depthFt

  const spacingIn =
    num(inp.joistSpacingIn) ||
    (inp.material === 'pt' ? cfg.joistSpacingIn_wood : cfg.joistSpacingIn_composite)

  // Joists run PERPENDICULAR to the decking boards, so the board run direction
  // drives the whole framing geometry.
  let boardRunFt, coverFt, joistLengthFt, joistSpanFt
  if (inp.boardDirection === 'perpendicular') {
    boardRunFt = depthFt
    coverFt = lengthFt
    joistLengthFt = lengthFt
    joistSpanFt = depthFt
  } else {
    boardRunFt = lengthFt
    coverFt = depthFt
    joistLengthFt = depthFt
    joistSpanFt = lengthFt
  }

  const boardWidthEff = num(cfg.deckBoardWidthIn) + num(cfg.deckBoardGapIn)
  const rows = Math.ceil((coverFt * 12) / boardWidthEff)
  const deckPick = pickLength(boardRunFt, cfg.deckBoardLengthsFt)
  const deckBoardsNeeded = rows * deckPick.perRun
  const deckPricePerBoard = deckingPricePerFt(inp.material, cfg) * deckPick.length

  // joistCount = floor(span / spacing) + 1. The "+ 1" is the fencepost board —
  // 12 ft at 12" O.C. is 12 GAPS but 13 JOISTS. Missing it leaves the crew a
  // joist short on the truck.
  const joistCount = Math.floor((joistSpanFt * 12) / spacingIn) + 1
  const framePick = pickLength(joistLengthFt, cfg.framingLengthsFt)
  const joistBoards = joistCount * framePick.perRun
  const beamLines = depthFt > num(cfg.maxBeamSpanFt) ? 2 : 1
  const ledgerPick = pickLength(joistSpanFt, cfg.framingLengthsFt)
  const beamBoards = num(cfg.beamPlies) * ledgerPick.perRun * beamLines

  const r = inp.railing || {}
  const railLinealFt =
    (r.far ? lengthFt : 0) + (r.house ? lengthFt : 0) + (r.left ? depthFt : 0) + (r.right ? depthFt : 0)

  const fasciaFt = lengthFt + 2 * depthFt
  const fasciaPick = pickLength(fasciaFt, cfg.fasciaLengthsFt)
  const footings = (Math.ceil(lengthFt / num(cfg.postSpacingFt)) + 1) * beamLines
  const postLengthFt = Math.max(2, Math.ceil(heightFt + 1))
  const clipsNeeded = Math.ceil(areaSqFt * num(cfg.clipsPerSqFt))
  const hangerScrews = joistCount * num(cfg.hangerScrewsPerJoist)

  const raw = []
  raw.push(li('deck-ledger', 'Framing', 'Ledger board (2x10 PT)', {
    qtyNeeded: ledgerPick.perRun, unit: 'boards', purchaseUnit: `${ledgerPick.length} ft board`,
    unitPrice: cfg.framingPricePerFt * ledgerPick.length, note: `Mounts to the house, ${joistSpanFt} ft run`,
  }))
  raw.push(li('deck-beam', 'Framing', `Carrying beam (${cfg.beamPlies}-ply built-up)`, {
    qtyNeeded: beamBoards, unit: 'boards', purchaseUnit: `${ledgerPick.length} ft board`,
    unitPrice: cfg.framingPricePerFt * ledgerPick.length,
    note: beamLines > 1 ? `${beamLines} beam lines (deep deck)` : 'Single beam line',
  }))
  raw.push(li('deck-joists', 'Framing', 'Joists (2x10 PT)', {
    qtyNeeded: joistBoards, unit: 'boards', purchaseUnit: `${framePick.length} ft board`,
    unitPrice: cfg.framingPricePerFt * framePick.length,
    note: `${joistCount} joists @ ${spacingIn}" O.C. — floor(${joistSpanFt}ft / spacing) + 1`,
  }))
  raw.push(li('deck-rim', 'Framing', 'Rim / band joist', {
    qtyNeeded: ledgerPick.perRun, unit: 'boards', purchaseUnit: `${ledgerPick.length} ft board`,
    unitPrice: cfg.framingPricePerFt * ledgerPick.length, note: 'Outer band at the beam end',
  }))
  raw.push(li('deck-hangers', 'Framing', 'Joist hangers (galvanized)', {
    qtyNeeded: joistCount, unit: 'hangers', purchaseUnit: 'each', unitPrice: cfg.hangerPrice,
    note: 'One per joist at the ledger',
  }))
  raw.push(li('deck-boards', 'Decking', `${MATERIAL_LABELS[inp.material]} decking`, {
    qtyNeeded: deckBoardsNeeded, unit: 'boards', purchaseUnit: `${deckPick.length} ft board`,
    unitPrice: deckPricePerBoard, wastePct: cfg.deckWastePct,
    note: `${rows} rows x ${deckPick.perRun}/row, +${cfg.deckWastePct}% waste`,
  }))
  raw.push(li('deck-clips', 'Fasteners', 'Hidden deck clips', {
    qtyNeeded: clipsNeeded, unit: 'clips', purchaseUnit: `box (${cfg.clipsPerBox})`,
    unitCoverage: cfg.clipsPerBox, unitPrice: cfg.clipBoxPrice,
    note: `${cfg.clipsPerSqFt}/sq ft over ${areaSqFt} sq ft`,
  }))
  raw.push(li('deck-structural', 'Fasteners', 'Structural framing screws', {
    qtyNeeded: areaSqFt, unit: 'sq ft', purchaseUnit: 'box', unitCoverage: cfg.framingScrewCoverageSqFt,
    unitPrice: cfg.framingScrewBoxPrice, note: `1 box / ${cfg.framingScrewCoverageSqFt} sq ft`,
  }))
  raw.push(li('deck-hangerscrews', 'Fasteners', 'Joist hanger screws', {
    qtyNeeded: hangerScrews, unit: 'screws', purchaseUnit: `box (${cfg.hangerScrewsPerBox})`,
    unitCoverage: cfg.hangerScrewsPerBox, unitPrice: cfg.hangerScrewBoxPrice,
    note: `${cfg.hangerScrewsPerJoist} per joist`,
  }))
  pushRailing(raw, 'deck', railLinealFt, cfg)
  raw.push(li('deck-fascia', 'Trim & Fascia', 'Composite fascia', {
    qtyNeeded: fasciaPick.perRun, unit: 'boards', purchaseUnit: `${fasciaPick.length} ft board`,
    unitPrice: cfg.fasciaPricePerFt * fasciaPick.length, note: `${fasciaFt} lineal ft (perimeter minus house side)`,
  }))
  raw.push(li('deck-posts', 'Posts & Footings', '6x6 support posts (PT)', {
    qtyNeeded: footings, unit: 'posts', purchaseUnit: `${postLengthFt} ft post`,
    unitPrice: cfg.supportPostPricePerFt * postLengthFt, note: `${footings} footings, ${heightFt} ft deck height`,
  }))
  raw.push(li('deck-concrete', 'Posts & Footings', 'Concrete (bagged)', {
    qtyNeeded: footings * num(cfg.concreteBagsPerFooting), unit: 'bags', purchaseUnit: 'bag',
    unitPrice: cfg.concreteBagPrice, note: `${cfg.concreteBagsPerFooting} bags / footing`,
  }))

  return { raw, summary: `${lengthFt}′ × ${depthFt}′ · ${areaSqFt} sq ft · ${MATERIAL_LABELS[inp.material]}` }
}

// ---------------------------------------------------------------------------
// STAIRS (with landings — the bluff-stair workhorse)
// ---------------------------------------------------------------------------
function computeStairs(inp, cfg) {
  const riseFt = num(inp.riseFt)
  const widthFt = num(inp.widthFt)
  const landings = Math.max(0, Math.round(num(inp.landings)))
  const landingSizeFt = num(inp.landingSizeFt)
  const flights = landings + 1

  // Risers from total rise; treads are one fewer per flight (each flight tops
  // out on a landing or the deck).
  const risers = Math.max(1, Math.ceil((riseFt * 12) / num(cfg.stairTargetRiserIn)))
  const treads = Math.max(1, risers - flights)
  const risersPerFlight = Math.ceil(risers / flights)
  const treadsPerFlight = Math.ceil(treads / flights)

  // Stringer stock length from each flight's diagonal (rise² + run²).
  const flightRiseFt = (risersPerFlight * num(cfg.stairTargetRiserIn)) / 12
  const flightRunFt = (treadsPerFlight * num(cfg.stairTreadRunIn)) / 12
  const diagonalFt = Math.sqrt(flightRiseFt ** 2 + flightRunFt ** 2)
  const stringerPick = pickLength(diagonalFt, cfg.framingLengthsFt)
  const stringersPerFlight = Math.ceil(widthFt / num(cfg.stairStringerSpacingFt)) + 1
  const stringerBoards = stringersPerFlight * flights * stringerPick.perRun

  // Tread decking.
  const treadPick = pickLength(widthFt, cfg.deckBoardLengthsFt)
  const treadBoards = treads * num(cfg.stairTreadBoardsPerStep) * treadPick.perRun
  const treadPricePerBoard = deckingPricePerFt(inp.material, cfg) * treadPick.length

  // Landings = mini platforms (size × width). Framing + decking, roughly.
  const landingAreaSqFt = landings * landingSizeFt * widthFt
  const landingJoists = landings * (Math.floor((widthFt * 12) / 16) + 1)
  const landingJoistPick = pickLength(landingSizeFt, cfg.framingLengthsFt)
  const landingDeckRows = Math.ceil((landingSizeFt * 12) / (num(cfg.deckBoardWidthIn) + num(cfg.deckBoardGapIn)))
  const landingDeckBoards = landings * landingDeckRows * treadPick.perRun

  // Railing both sides of every flight + around landings.
  const totalDiagonalFt = diagonalFt * flights
  const sidesMult = inp.railedBothSides ? 2 : 1
  const railFt = sidesMult * totalDiagonalFt + landings * landingSizeFt * 2

  // Footings: one pair at the bottom + one per landing.
  const stairFootings = (landings + 1) * 2

  const raw = []
  raw.push(li('stair-stringers', 'Framing', 'Stair stringers (2x12 PT)', {
    qtyNeeded: stringerBoards, unit: 'stringers', purchaseUnit: `${stringerPick.length} ft board`,
    unitPrice: cfg.stairStringerPricePerFt * stringerPick.length,
    note: `${stringersPerFlight}/flight × ${flights} flight(s), ${risers} risers`,
  }))
  raw.push(li('stair-treads', 'Decking', `${MATERIAL_LABELS[inp.material]} stair treads`, {
    qtyNeeded: treadBoards, unit: 'boards', purchaseUnit: `${treadPick.length} ft board`,
    unitPrice: treadPricePerBoard, wastePct: cfg.deckWastePct,
    note: `${treads} treads × ${cfg.stairTreadBoardsPerStep} boards`,
  }))
  if (landings > 0) {
    raw.push(li('stair-landing-framing', 'Framing', 'Landing framing (2x10 PT)', {
      qtyNeeded: landingJoists * landingJoistPick.perRun, unit: 'boards',
      purchaseUnit: `${landingJoistPick.length} ft board`, unitPrice: cfg.framingPricePerFt * landingJoistPick.length,
      note: `${landings} landing(s) @ ${landingSizeFt}′ × ${widthFt}′`,
    }))
    raw.push(li('stair-landing-decking', 'Decking', `${MATERIAL_LABELS[inp.material]} landing decking`, {
      qtyNeeded: landingDeckBoards, unit: 'boards', purchaseUnit: `${treadPick.length} ft board`,
      unitPrice: treadPricePerBoard, wastePct: cfg.deckWastePct,
      note: `${Math.round(landingAreaSqFt)} sq ft of landings`,
    }))
  }
  pushRailing(raw, 'stair', railFt, cfg)
  raw.push(li('stair-posts', 'Posts & Footings', '6x6 stair posts (PT)', {
    qtyNeeded: stairFootings, unit: 'posts', purchaseUnit: '8 ft post', unitPrice: cfg.supportPostPricePerFt * 8,
    note: `${stairFootings} footings (bottom + landings)`,
  }))
  raw.push(li('stair-concrete', 'Posts & Footings', 'Concrete (bagged)', {
    qtyNeeded: stairFootings * num(cfg.concreteBagsPerFooting), unit: 'bags', purchaseUnit: 'bag',
    unitPrice: cfg.concreteBagPrice, note: `${cfg.concreteBagsPerFooting} bags / footing`,
  }))

  const summ = `${riseFt}′ rise · ${risers} risers · ${landings} landing(s) · ${widthFt}′ wide`
  return { raw, summary: summ }
}

// ---------------------------------------------------------------------------
// RAILING (standalone run)
// ---------------------------------------------------------------------------
function computeRailing(inp, cfg) {
  const railFt = num(inp.linealFt) * Math.max(1, num(inp.sides))
  const raw = []
  pushRailing(raw, 'rail', railFt, cfg)
  return { raw, summary: `${num(inp.linealFt)} lineal ft${num(inp.sides) > 1 ? ' × 2 sides' : ''}` }
}

// Shared railing math used by deck / stairs / standalone railing.
function pushRailing(raw, prefix, railLinealFt, cfg) {
  if (!(railLinealFt > 0)) return
  const sections = Math.ceil(railLinealFt / num(cfg.railingSectionFt))
  const posts = sections + 1 // one per section + a terminal post
  raw.push(li(`${prefix}-rail-section`, 'Railing', `Westbury section kit (${cfg.railingSectionFt} ft)`, {
    qtyNeeded: sections, unit: 'sections', purchaseUnit: 'kit', unitPrice: cfg.railingSectionPrice,
    note: `${round2(railLinealFt)} lineal ft / ${cfg.railingSectionFt} ft`,
  }))
  raw.push(li(`${prefix}-rail-posts`, 'Railing', 'Railing posts', {
    qtyNeeded: posts, unit: 'posts', purchaseUnit: 'each', unitPrice: cfg.railingPostPrice,
    note: 'Sections + 1 terminal post',
  }))
  raw.push(li(`${prefix}-rail-caps`, 'Railing', 'Post caps', {
    qtyNeeded: posts, unit: 'caps', purchaseUnit: 'each', unitPrice: cfg.railingPostCapPrice, note: 'One per post',
  }))
  raw.push(li(`${prefix}-rail-mounts`, 'Railing', 'Post mounting kits', {
    qtyNeeded: posts, unit: 'kits', purchaseUnit: 'each', unitPrice: cfg.railingMountPrice, note: 'One per post',
  }))
}

// ---------------------------------------------------------------------------
// RETAINING WALL / SEAWALL (block or timber)
// ---------------------------------------------------------------------------
function computeWall(inp, cfg) {
  const lengthFt = num(inp.lengthFt)
  const heightFt = num(inp.heightFt)
  const faceSqFt = lengthFt * heightFt
  const raw = []

  if (inp.type === 'timber') {
    const courses = Math.ceil(heightFt / num(cfg.wallTimberHeightFt))
    const timberPick = pickLength(lengthFt, cfg.wallTimberLengthsFt)
    const timbers = courses * timberPick.perRun
    raw.push(li('wall-timber', 'Retaining Wall', '6x6 PT timbers', {
      qtyNeeded: timbers, unit: 'timbers', purchaseUnit: `${timberPick.length} ft timber`,
      unitPrice: cfg.wallTimberPricePerFt * timberPick.length, note: `${courses} courses × ${lengthFt} ft`,
    }))
    raw.push(li('wall-spikes', 'Retaining Wall', 'Landscape spikes', {
      qtyNeeded: timbers * num(cfg.wallSpikesPerTimber), unit: 'spikes', purchaseUnit: 'each',
      unitPrice: cfg.wallSpikePrice, note: `${cfg.wallSpikesPerTimber} per timber`,
    }))
  } else {
    raw.push(li('wall-block', 'Retaining Wall', 'Retaining-wall block', {
      qtyNeeded: Math.ceil(faceSqFt / num(cfg.wallBlockFaceSqFt)), unit: 'blocks', purchaseUnit: 'each',
      unitPrice: cfg.wallBlockPrice, note: `${faceSqFt} face sq ft / ${cfg.wallBlockFaceSqFt} per block`,
    }))
    raw.push(li('wall-cap', 'Retaining Wall', 'Cap block', {
      qtyNeeded: Math.ceil(lengthFt / num(cfg.wallCapLenFt)), unit: 'caps', purchaseUnit: 'each',
      unitPrice: cfg.wallCapPrice, note: `${lengthFt} ft top course`,
    }))
  }

  // Common to both: base/backfill gravel, drainage fabric + pipe.
  raw.push(li('wall-gravel', 'Retaining Wall', 'Base / backfill gravel', {
    qtyNeeded: round2(faceSqFt * num(cfg.wallGravelTonPerFaceSqFt)), unit: 'tons', purchaseUnit: 'ton',
    unitPrice: cfg.wallGravelTonPrice, note: `${cfg.wallGravelTonPerFaceSqFt} ton / face sq ft`,
  }))
  raw.push(li('wall-fabric', 'Retaining Wall', 'Drainage fabric', {
    qtyNeeded: Math.ceil(faceSqFt), unit: 'sq ft', purchaseUnit: 'sq ft', unitPrice: cfg.wallFabricPrice,
    note: 'Behind the wall face',
  }))
  raw.push(li('wall-drain', 'Retaining Wall', 'Perforated drain pipe', {
    qtyNeeded: Math.ceil(lengthFt), unit: 'ft', purchaseUnit: 'ft', unitPrice: cfg.wallDrainPipePrice,
    note: 'Footing drain',
  }))

  const summ = `${inp.type === 'timber' ? 'Timber' : 'Block'} · ${lengthFt}′ × ${heightFt}′ · ${faceSqFt} face sq ft`
  return { raw, summary: summ }
}

// ---------------------------------------------------------------------------
// CUSTOM (freeform escape hatch — kayak ramps, one-offs, anything)
// ---------------------------------------------------------------------------
function computeCustom(items, cfg) {
  const raw = items
    .filter((it) => (it.name || '').trim() !== '')
    .map((it, i) =>
      li(`custom-${i}`, it.category || 'Custom', it.name, {
        qtyNeeded: num(it.qty), unit: it.unit || 'each', purchaseUnit: it.unit || 'each',
        unitPrice: num(it.unitPrice), note: 'Custom line item',
      }),
    )
  return { raw, summary: `${raw.length} custom item${raw.length === 1 ? '' : 's'}` }
}

// ---------------------------------------------------------------------------
// Line-item plumbing
// ---------------------------------------------------------------------------
function li(id, category, name, opts) {
  return {
    id,
    category,
    name,
    qtyNeeded: num(opts.qtyNeeded),
    unit: opts.unit,
    purchaseUnit: opts.purchaseUnit,
    unitCoverage: opts.unitCoverage ?? 1,
    unitPrice: round2(num(opts.unitPrice)),
    wastePct: opts.wastePct ?? 0,
    note: opts.note || '',
  }
}

// Apply user overrides (qty, unit price, removal) + waste, round UP to whole
// purchase units, then compute leftover and dollars.
//
// `override` may be:
//   - undefined / null / ''  -> no override
//   - a number               -> legacy qtyToOrder override
//   - an object              -> { qtyToOrder?, unitPrice?, qtyNeeded?, removed? }
// Returns null when the user removed the item on the review step.
function finalize(it, override) {
  const o = normalizeOverride(override)
  if (o.removed) return null

  const priceOverridden = has(o.unitPrice)
  const unitPrice = priceOverridden ? round2(num(o.unitPrice)) : it.unitPrice
  const qtyNeeded = has(o.qtyNeeded) ? num(o.qtyNeeded) : it.qtyNeeded

  const wasteMult = 1 + num(it.wastePct) / 100
  const baseOrder = Math.max(0, Math.ceil((qtyNeeded * wasteMult) / it.unitCoverage))
  const qtyOverridden = has(o.qtyToOrder)
  const qtyToOrder = qtyOverridden ? Math.max(0, Math.round(num(o.qtyToOrder))) : baseOrder

  const provided = qtyToOrder * it.unitCoverage
  const expectedLeftover = Math.max(0, round2(provided - qtyNeeded))
  const lineCost = round2(qtyToOrder * unitPrice)
  const leftoverValue = round2((expectedLeftover / it.unitCoverage) * unitPrice)

  return {
    ...it,
    unitPrice,
    qtyNeeded,
    baseOrder,
    qtyToOrder,
    qtyOverridden,
    priceOverridden,
    overridden: qtyOverridden || priceOverridden,
    expectedLeftover,
    lineCost,
    leftoverValue,
  }
}

function normalizeOverride(o) {
  if (o == null || o === '') return {}
  if (typeof o === 'object') return o
  return { qtyToOrder: o } // legacy: a bare number meant qtyToOrder
}

function has(v) {
  return v !== undefined && v !== null && v !== ''
}

function num(v) {
  const n = typeof v === 'number' ? v : parseFloat(v)
  return Number.isFinite(n) ? n : 0
}
function round2(n) {
  return Math.round(n * 100) / 100
}
