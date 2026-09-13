# Stage 2 Plan — Add System 2 to the Coupled System Visualization

## Overview

Extend the existing `viz/` coupled-system visualization (which currently shows only System 1) to also display **System 2** as a second overlaid line on the same chart. System 2 uses the same four-phase waveform shape as System 1 (Rest → Rise → Crash → Recover) but has its own independent set of parameters and is rendered in a distinct colour.

**Scope:**
- Reuse the existing `generateSystem1` function (rename it or add a parallel `generateSystem2`, or generalise to a single `generateWaveform(params, totalTime)` function).
- Add a second SVG `<path>` for System 2 on the existing chart, with clipping already in place.
- Extend the Y axis domain to cover both systems' amplitude ranges.
- Time window stays driven by System 1's cycle length × 6 — System 2 renders however many cycles fit.
- Add a second set of four controls (slider + number input) for System 2, in a side-by-side panel layout.
- Add a colour legend to the chart.
- Update `index.html` title from "Coupled System — System 1" to "Coupled System Visualization".

**Non-goals (deferred to Stage 3+):**
- Coupling logic between the two systems.
- Per-system visibility toggles.

---

## Sub-Task 1 — Generalise the Data Generator

**Intent:**
Refactor `generateSystem1` into a single reusable `generateWaveform(params, totalTime)` function so that both systems share one implementation. This reduces duplication and keeps the generator easy to test mentally.

**Expected Outcomes:**
- `viz.js` contains a function `generateWaveform(params, totalTime)` with the same logic as the current `generateSystem1`.
- The existing call site (`render`) is updated to call `generateWaveform` for System 1 data.
- No behaviour change to the existing System 1 rendering.

**Todo List:**
1. Rename `generateSystem1` to `generateWaveform` in `viz.js`.
2. Update the call site in `render(params)` to use `generateWaveform`.

**Relevant Context:**
- [`viz/viz.js`](viz/viz.js) — `generateSystem1` at line 20; called in `render` at line 176.

**Status:** `[x] done`

---

## Sub-Task 2 — Add System 2 Path and State to the Chart

**Intent:**
Add a second SVG `<path>` element for System 2's line to the existing chart, wired up to its own data array. The path must use the same clip path as System 1 so it obeys zoom/pan bounds.

**Expected Outcomes:**
- A second `<path class="waveform-line system2-line">` exists in the SVG, clipped by `plot-clip`.
- `viz.js` maintains a `currentData2` variable alongside `currentData`.
- System 2's line is drawn correctly when `render` is called.
- System 2 uses a distinct colour (orange: `#e6882a`) vs System 1's blue (`#3b82d4`).
- CSS rule for `.system2-line` added in `index.html`.

**Todo List:**
1. In `viz.js`, add `let currentData2 = []` alongside `currentData`.
2. Append a second path element to the clip group in the SVG setup block (or append it to a separate clip group — both are clipped by the same `clipId`).
3. Add a `linePath2` variable referencing that second path.
4. In `redrawAxesAndLine`, also update `linePath2` with `currentData2`.
5. In `render`, generate `currentData2 = generateWaveform(params2, totalTime)` and update `linePath2`.
6. Add `.system2-line` CSS rule (stroke `#e6882a`, stroke-width `2`, fill `none`) in `index.html`.

**Relevant Context:**
- [`viz/viz.js`](viz/viz.js) — SVG setup block lines 68–134; `redrawAxesAndLine` lines 162–169; `render` lines 172–206.
- [`viz/index.html`](viz/index.html) — CSS block lines 7–121; `.waveform-line` rule at line 111.

**Status:** `[x] done`

---

## Sub-Task 3 — Extend Y Axis and Render to Cover Both Systems

**Intent:**
Update the Y axis domain calculation so that it always spans the combined amplitude range of both systems, preventing either line from clipping outside the plot area.

**Expected Outcomes:**
- The Y domain is computed as `max(amplitude1, amplitude2) × 1.2` (padded 20%) on both the positive and negative sides.
- Changing System 2's amplitude slider updates the Y axis correctly.

**Todo List:**
1. In `render(params1, params2)` (after adding params2 parameter), compute `const maxAmp = Math.max(params1.amplitude, params2.amplitude)` and use `maxAmp` for the Y scale padding.
2. Ensure `render` is called with both parameter objects everywhere it is invoked.

**Relevant Context:**
- [`viz/viz.js`](viz/viz.js) — `render` function Y scale calculation at lines 178–181.

**Status:** `[x] done`

---

## Sub-Task 4 — Add System 2 Controls Panel

**Intent:**
Add a second control panel ("System 2") with four slider+number-input groups, mirroring the existing System 1 panel, and place them side by side.

**Expected Outcomes:**
- `index.html` has two `.control-panel` `<div>` elements, one per system, inside `#controls`, displayed side by side via CSS flexbox.
- System 2 controls use IDs: `s2-amplitude-slider`, `s2-amplitude-num`, `s2-rest-slider`, `s2-rest-num`, `s2-rise-slider`, `s2-rise-num`, `s2-recover-slider`, `s2-recover-num`.
- Default values: amplitude=1, restDuration=1, riseDuration=2, recoverDuration=2.
- System 2 controls are wired in `viz.js` via the existing `wireControl` helper.
- A `readParams2()` function mirrors `readParams()` reading the `s2-*` IDs.
- All control changes (either system) re-invoke `render(readParams(), readParams2())`.
- Control panels are labelled "System 1" and "System 2" with a small coloured indicator matching each line.

**Todo List:**
1. In `index.html`, wrap the existing four `.control-group` divs in a `<div class="control-panel">` and add a panel header "System 1".
2. Add a matching `<div class="control-panel">` for System 2 with `s2-*` IDs and the correct default values.
3. Update `#controls` CSS to `display: flex; flex-direction: row; flex-wrap: wrap; gap: 16px`.
4. Add `.control-panel` CSS: `flex: 1; min-width: 280px; display: flex; flex-direction: column; gap: 12px`.
5. Add `.panel-header` CSS for the label, with a small coloured dot/swatch per system.
6. In `viz.js`, add `readParams2()` function reading `s2-*` element values.
7. Wire System 2 controls with `wireControl` calls, passing `render(readParams(), readParams2())`.
8. Update all `render(readParams())` calls to `render(readParams(), readParams2())`.
9. Update `render` signature to `render(params1, params2)`.

**Relevant Context:**
- [`viz/index.html`](viz/index.html) — `#controls` block lines 126–158.
- [`viz/viz.js`](viz/viz.js) — `readParams`, `wireControl`, initial `render` call lines 210–241.

**Status:** `[x] done`

---

## Sub-Task 5 — Add Colour Legend

**Intent:**
Add a small legend to the chart that identifies the two system lines by colour and name, so the visualization is self-explanatory.

**Expected Outcomes:**
- A legend is rendered as an SVG `<g>` group in the top-right corner of the plot area, or as an HTML element below the chart.
- Legend contains two entries: a short coloured line swatch + "System 1" and a short coloured line swatch + "System 2".
- Legend uses the same colours as the two waveform lines.
- Legend is placed as an HTML element **below the chart**, inside `#chart-container`.

**Todo List:**
1. In `index.html`, add a `<div id="legend">` below the `<div id="chart">` and above the Reset button, inside `#chart-container`.
2. Populate it with two `<span>` entries, each containing a short coloured `<svg>` line swatch and a text label.
3. Add `#legend` CSS: `display: flex; gap: 20px; justify-content: center; padding: 8px 0`.
4. Use colours `#3b82d4` (System 1) and `#e6882a` (System 2) for the swatches.

**Relevant Context:**
- [`viz/viz.js`](viz/viz.js) — SVG setup block lines 68–134.
- [`viz/index.html`](viz/index.html) — page title line 124 (to update from "System 1" to "Coupled System Visualization").

**Status:** `[x] done`

---

## Sub-Task 6 — Update Page Title and WIKI

**Intent:**
Update the visible heading and the `_context/WIKI.md` documentation to reflect Stage 2 completion.

**Expected Outcomes:**
- `<h1>` in `index.html` reads "Coupled System Visualization".
- `_context/WIKI.md` Stage 2 status entry updated to reflect completion, and the system parameters for System 2 are documented.

**Todo List:**
1. Change `<h1>` in `index.html` from "Coupled System — System 1" to "Coupled System Visualization".
2. In `_context/WIKI.md`, update the Stage 2 entry in the "Future Stages" section to "done" and document System 2 parameters and defaults.

**Relevant Context:**
- [`viz/index.html`](viz/index.html) line 124.
- [`_context/WIKI.md`](_context/WIKI.md) lines 264–267.

**Status:** `[x] done`
