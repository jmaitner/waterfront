// ============================================================================
// Waterfront Solutions — Material Rules & Pricing Engine
// ============================================================================
// THIS FILE IS THE WHOLE BRAIN OF THE APP.
//
// Every number a non-coder might need to fix lives in DEFAULT_CONFIG below as a
// named, commented value. Anything marked:
//
//     PLACEHOLDER — confirm with Will's real numbers
//
// is a seeded industry default so the app runs out of the box. Replace these
// with the owner's real TimberTech / Westbury / lumber-yard numbers and every
// quantity, leftover, and dollar total recomputes automatically.
//
// You normally won't even edit this file — the in-app "Materials & Pricing"
// settings panel exposes all of these same values as editable fields. This file
// is just the starting point / "reset to defaults" source of truth.
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

  // ---- STAIRS (approximate in v1) ----------------------------------------
  stairStringerSpacingFt: 1.5, // PLACEHOLDER — spacing between stair stringers (ft)
  stairTreadBoardsPerStep: 2, // PLACEHOLDER — decking boards across each tread
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
    group: 'Stairs',
    fields: [
      { key: 'stairStringerSpacingFt', label: 'Stringer spacing', unit: 'ft' },
      { key: 'stairTreadBoardsPerStep', label: 'Tread boards per step' },
    ],
  },
]

// Default inputs for a brand-new job. Rectangular deck only in this MVP.
export const DEFAULT_JOB_INPUTS = {
  lengthFt: 12, // dimension running ALONG the house
  depthFt: 16, // projection straight OUT from the house
  heightFt: 3, // deck height — drives post length + footing count for now
  material: 'timbertech', // 'timbertech' | 'pt' | 'trex'
  boardDirection: 'parallel', // decking run vs the house: 'parallel' | 'perpendicular'
  joistSpacingIn: null, // null = use the material default from config
  railing: { house: false, far: true, left: true, right: true }, // default = perimeter minus house side
  stairs: { enabled: false, steps: 4, widthFt: 4 },
}

export const MATERIAL_LABELS = {
  timbertech: 'TimberTech composite',
  pt: 'Pressure-treated wood',
  trex: 'Trex composite',
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

// Pick the stock board length that wastes the least lineal footage covering a
// run. Returns { length, perRun (boards), waste (ft) }.
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
// computeTakeoff(job, config) -> { categories, totals, geometry }
//
// `job` carries the raw inputs (job.inputs) plus any per-item quantity
// overrides (job.overrides[itemId] = qtyToOrder the user typed). The function
// is PURE: same inputs + config always produce the same parts list, so we can
// recompute live whenever a price or assumption changes.
// ---------------------------------------------------------------------------
export function computeTakeoff(job, cfg) {
  const inp = job.inputs
  const overrides = job.overrides || {}

  const lengthFt = num(inp.lengthFt)
  const depthFt = num(inp.depthFt)
  const heightFt = num(inp.heightFt)
  const areaSqFt = lengthFt * depthFt

  // Joist spacing: explicit override, else the per-material default.
  const spacingIn =
    num(inp.joistSpacingIn) ||
    (inp.material === 'pt' ? cfg.joistSpacingIn_wood : cfg.joistSpacingIn_composite)

  // --- Decking layout --------------------------------------------------------
  // Joists run PERPENDICULAR to the decking boards. So the board run direction
  // drives the whole framing geometry.
  let boardRunFt, coverFt, joistLengthFt, joistSpanFt
  if (inp.boardDirection === 'perpendicular') {
    // Boards run straight out from the house (along the depth).
    boardRunFt = depthFt
    coverFt = lengthFt
    joistLengthFt = lengthFt // joists run along the house
    joistSpanFt = depthFt // ...spaced across the depth
  } else {
    // Default: boards run parallel to the house (along the length).
    boardRunFt = lengthFt
    coverFt = depthFt
    joistLengthFt = depthFt // joists run out from the house
    joistSpanFt = lengthFt // ...spaced across the length
  }

  const boardWidthEff = num(cfg.deckBoardWidthIn) + num(cfg.deckBoardGapIn) // in
  const rows = Math.ceil((coverFt * 12) / boardWidthEff) // rows of decking
  const deckPick = pickLength(boardRunFt, cfg.deckBoardLengthsFt)
  const boardsPerRow = deckPick.perRun
  const deckBoardsNeeded = rows * boardsPerRow
  const deckPricePerBoard = deckingPricePerFt(inp.material, cfg) * deckPick.length

  // --- Framing ---------------------------------------------------------------
  // joistCount = floor(span / spacing) + 1.
  // The "+ 1" is the fencepost board: a 12 ft span at 12" O.C. is 12 GAPS but
  // 13 JOISTS. Forgetting it is the classic by-hand off-by-one that leaves a
  // crew one joist short on the truck.
  const joistCount = Math.floor((joistSpanFt * 12) / spacingIn) + 1
  const framePick = pickLength(joistLengthFt, cfg.framingLengthsFt)
  const joistBoards = joistCount * framePick.perRun
  const beamLines = depthFt > num(cfg.maxBeamSpanFt) ? 2 : 1 // deep decks need a mid beam

  const ledgerPick = pickLength(joistSpanFt, cfg.framingLengthsFt)
  const ledgerBoards = ledgerPick.perRun // ledger on the house
  const beamBoards = num(cfg.beamPlies) * ledgerPick.perRun * beamLines
  const rimBoards = ledgerPick.perRun // outer rim band

  // --- Railing ---------------------------------------------------------------
  const r = inp.railing || {}
  const railLinealFt =
    (r.far ? lengthFt : 0) +
    (r.house ? lengthFt : 0) +
    (r.left ? depthFt : 0) +
    (r.right ? depthFt : 0)
  const railSections = railLinealFt > 0 ? Math.ceil(railLinealFt / num(cfg.railingSectionFt)) : 0
  // posts = one per section + a terminal post to close the last run.
  const railPosts = railSections > 0 ? railSections + 1 : 0

  // --- Fascia / trim ---------------------------------------------------------
  // Fascia wraps the exposed edges (perimeter minus the house side).
  const fasciaFt = lengthFt + 2 * depthFt
  const fasciaPick = pickLength(fasciaFt, cfg.fasciaLengthsFt)

  // --- Posts & footings ------------------------------------------------------
  const footings = (Math.ceil(lengthFt / num(cfg.postSpacingFt)) + 1) * beamLines
  const postLengthFt = Math.max(2, Math.ceil(heightFt + 1)) // post = height + a little

  // --- Fasteners -------------------------------------------------------------
  const clipsNeeded = Math.ceil(areaSqFt * num(cfg.clipsPerSqFt))
  const hangerScrews = joistCount * num(cfg.hangerScrewsPerJoist)

  // --- Build the line items --------------------------------------------------
  const raw = []
  const add = (o) => raw.push(o)

  // FRAMING
  add(li('framing-ledger', 'Framing', 'Ledger board (2x10 PT)', {
    qtyNeeded: ledgerBoards, unit: 'boards', purchaseUnit: `${ledgerPick.length} ft board`,
    unitPrice: cfg.framingPricePerFt * ledgerPick.length,
    note: `Mounts to the house, ${joistSpanFt} ft run`,
  }))
  add(li('framing-beam', 'Framing', `Carrying beam (${cfg.beamPlies}-ply built-up)`, {
    qtyNeeded: beamBoards, unit: 'boards', purchaseUnit: `${ledgerPick.length} ft board`,
    unitPrice: cfg.framingPricePerFt * ledgerPick.length,
    note: beamLines > 1 ? `${beamLines} beam lines (deep deck)` : 'Single beam line',
  }))
  add(li('framing-joists', 'Framing', 'Joists (2x10 PT)', {
    qtyNeeded: joistBoards, unit: 'boards', purchaseUnit: `${framePick.length} ft board`,
    unitPrice: cfg.framingPricePerFt * framePick.length,
    note: `${joistCount} joists @ ${spacingIn}" O.C. — floor(${joistSpanFt}ft / spacing) + 1`,
  }))
  add(li('framing-rim', 'Framing', 'Rim / band joist', {
    qtyNeeded: rimBoards, unit: 'boards', purchaseUnit: `${ledgerPick.length} ft board`,
    unitPrice: cfg.framingPricePerFt * ledgerPick.length,
    note: 'Outer band at the beam end',
  }))
  add(li('framing-hangers', 'Framing', 'Joist hangers (galvanized)', {
    qtyNeeded: joistCount, unit: 'hangers', purchaseUnit: 'each',
    unitPrice: cfg.hangerPrice, note: 'One per joist at the ledger',
  }))

  // DECKING
  add(li('decking-boards', 'Decking', `${MATERIAL_LABELS[inp.material]} decking`, {
    qtyNeeded: deckBoardsNeeded, unit: 'boards', purchaseUnit: `${deckPick.length} ft board`,
    unitPrice: deckPricePerBoard, wastePct: cfg.deckWastePct,
    note: `${rows} rows x ${boardsPerRow}/row, +${cfg.deckWastePct}% waste`,
  }))

  // FASTENERS
  add(li('fast-clips', 'Fasteners', 'Hidden deck clips', {
    qtyNeeded: clipsNeeded, unit: 'clips', purchaseUnit: `box (${cfg.clipsPerBox})`,
    unitCoverage: cfg.clipsPerBox, unitPrice: cfg.clipBoxPrice,
    note: `${cfg.clipsPerSqFt}/sq ft over ${areaSqFt} sq ft`,
  }))
  add(li('fast-structural', 'Fasteners', 'Structural framing screws', {
    qtyNeeded: areaSqFt, unit: 'sq ft', purchaseUnit: 'box',
    unitCoverage: cfg.framingScrewCoverageSqFt, unitPrice: cfg.framingScrewBoxPrice,
    note: `1 box / ${cfg.framingScrewCoverageSqFt} sq ft`,
  }))
  add(li('fast-hanger', 'Fasteners', 'Joist hanger screws', {
    qtyNeeded: hangerScrews, unit: 'screws', purchaseUnit: `box (${cfg.hangerScrewsPerBox})`,
    unitCoverage: cfg.hangerScrewsPerBox, unitPrice: cfg.hangerScrewBoxPrice,
    note: `${cfg.hangerScrewsPerJoist} per joist`,
  }))

  // RAILING (only if any side is railed)
  if (railSections > 0) {
    add(li('rail-section', 'Railing', `Westbury section kit (${cfg.railingSectionFt} ft)`, {
      qtyNeeded: railSections, unit: 'sections', purchaseUnit: 'kit',
      unitPrice: cfg.railingSectionPrice,
      note: `${railLinealFt} lineal ft / ${cfg.railingSectionFt} ft`,
    }))
    add(li('rail-posts', 'Railing', 'Railing posts', {
      qtyNeeded: railPosts, unit: 'posts', purchaseUnit: 'each',
      unitPrice: cfg.railingPostPrice, note: 'Sections + 1 terminal post',
    }))
    add(li('rail-caps', 'Railing', 'Post caps', {
      qtyNeeded: railPosts, unit: 'caps', purchaseUnit: 'each',
      unitPrice: cfg.railingPostCapPrice, note: 'One per post',
    }))
    add(li('rail-mounts', 'Railing', 'Post mounting kits', {
      qtyNeeded: railPosts, unit: 'kits', purchaseUnit: 'each',
      unitPrice: cfg.railingMountPrice, note: 'One per post',
    }))
  }

  // TRIM & FASCIA
  add(li('fascia-board', 'Trim & Fascia', 'Composite fascia', {
    qtyNeeded: fasciaPick.perRun, unit: 'boards', purchaseUnit: `${fasciaPick.length} ft board`,
    unitPrice: cfg.fasciaPricePerFt * fasciaPick.length,
    note: `${fasciaFt} lineal ft (perimeter minus house side)`,
  }))

  // POSTS & FOOTINGS
  add(li('post-6x6', 'Posts & Footings', '6x6 support posts (PT)', {
    qtyNeeded: footings, unit: 'posts', purchaseUnit: `${postLengthFt} ft post`,
    unitPrice: cfg.supportPostPricePerFt * postLengthFt,
    note: `${footings} footings, ${heightFt} ft deck height`,
  }))
  add(li('post-concrete', 'Posts & Footings', 'Concrete (bagged)', {
    qtyNeeded: footings * num(cfg.concreteBagsPerFooting), unit: 'bags', purchaseUnit: 'bag',
    unitPrice: cfg.concreteBagPrice, note: `${cfg.concreteBagsPerFooting} bags / footing`,
  }))

  // STAIRS (optional, approximate)
  const st = inp.stairs || {}
  if (st.enabled) {
    const stringers = Math.ceil(num(st.widthFt) / num(cfg.stairStringerSpacingFt)) + 1
    const treadPick = pickLength(num(st.widthFt), cfg.deckBoardLengthsFt)
    const treadBoards = num(st.steps) * num(cfg.stairTreadBoardsPerStep) * treadPick.perRun
    add(li('stair-stringers', 'Stairs', 'Stair stringers (approx)', {
      qtyNeeded: stringers, unit: 'stringers', purchaseUnit: 'each',
      unitPrice: cfg.framingPricePerFt * Math.max(...cfg.framingLengthsFt.filter((l) => l <= 16), 12),
      note: `${st.steps} steps x ${st.widthFt} ft wide — approximate`,
    }))
    add(li('stair-treads', 'Stairs', 'Stair tread decking (approx)', {
      qtyNeeded: treadBoards, unit: 'boards', purchaseUnit: `${treadPick.length} ft board`,
      unitPrice: deckingPricePerFt(inp.material, cfg) * treadPick.length, wastePct: cfg.deckWastePct,
      note: `${cfg.stairTreadBoardsPerStep} boards/step — approximate`,
    }))
  }

  // --- Finalize: apply overrides + compute order qty, cost, leftover ---------
  const finalized = raw.map((it) => finalize(it, overrides[it.id]))

  // Group into categories in a fixed display order.
  const order = ['Framing', 'Decking', 'Fasteners', 'Railing', 'Trim & Fascia', 'Posts & Footings', 'Stairs']
  const categories = order
    .map((name) => ({ name, items: finalized.filter((it) => it.category === name) }))
    .filter((c) => c.items.length > 0)

  const totals = finalized.reduce(
    (t, it) => {
      t.materialCost += it.lineCost
      t.leftoverValue += it.leftoverValue
      t.itemCount += 1
      return t
    },
    { materialCost: 0, leftoverValue: 0, itemCount: 0 },
  )

  return {
    categories,
    totals,
    geometry: { areaSqFt, joistCount, rows, spacingIn, railLinealFt, footings, beamLines },
  }
}

// Build a raw line item (before override + costing).
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

// Apply waste + round UP to whole purchase units, honoring a user override, then
// compute leftover and dollars.
function finalize(it, override) {
  const wasteMult = 1 + num(it.wastePct) / 100
  const baseOrder = Math.max(0, Math.ceil((it.qtyNeeded * wasteMult) / it.unitCoverage))
  const overridden = override !== undefined && override !== null && override !== ''
  const qtyToOrder = overridden ? Math.max(0, Math.round(num(override))) : baseOrder

  const provided = qtyToOrder * it.unitCoverage // total `unit` the order yields
  const expectedLeftover = Math.max(0, round2(provided - it.qtyNeeded))
  const lineCost = round2(qtyToOrder * it.unitPrice)
  // Value of the leftover = its share of a purchase unit's price.
  const leftoverValue = round2((expectedLeftover / it.unitCoverage) * it.unitPrice)

  return { ...it, baseOrder, qtyToOrder, overridden, expectedLeftover, lineCost, leftoverValue }
}

function num(v) {
  const n = typeof v === 'number' ? v : parseFloat(v)
  return Number.isFinite(n) ? n : 0
}
function round2(n) {
  return Math.round(n * 100) / 100
}
