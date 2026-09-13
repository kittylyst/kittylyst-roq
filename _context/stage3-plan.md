# Stage 3 Plan — Coupling System 1 → System 2

## Overview

Replace System 2's independent waveform generator with a **trigger-driven** generator that is
fully coupled to System 1. System 2 has no unforced periodicity of its own. Instead it responds
to every System 1 crash event, starting a Rise → Crash → Recover sequence each time one fires.

**Key coupling rules:**
- Every System 1 crash fires a trigger that arrives at System 2 after a configurable **coupling
  delay** (default 0, range 0–5).
- When a trigger arrives System 2 immediately starts a rise from its **current value** (not from
  zero), regardless of what phase it is currently in.
- The rise travels `+riseHeight` from that starting level over `riseDuration`.
- At the peak the crash is instantaneous and drops by `2 × riseHeight` (so crash bottom = peak − 2 × riseHeight).
- System 2 then recovers linearly to 0 over `recoverDuration`.
- If a new trigger arrives while System 2 is still rising or recovering, the new rise begins
  immediately from the current level, accumulating peaks (resonance).
- Clipping is deferred to a later stage — peaks/troughs can go out of current Y-axis range.

**UI changes:**
- Remove System 2's `restDuration` control (implicit rest replaced by "wait for trigger").
- Rename System 2's `amplitude` control to **"Rise height per trigger"** (same mechanical role,
  clearer label).
- Add a new **"Coupling"** panel between System 1 and System 2 panels, containing a single
  **"Coupling delay"** slider+number (default 0, range 0–5, step 0.1).

**Y-axis:**
- Domain is computed from the actual min/max of the generated System 2 data (not just amplitude),
  so resonant peaks are at least partially visible even if they exceed `amplitude`.

**Scope:**
- All changes are in `viz/viz.js` and `viz/index.html`.
- No build step; no new dependencies.

**Non-goals (deferred):**
- Clipping System 2 values at a maximum/minimum.
- Bidirectional coupling (System 2 influencing System 1).
- Per-system visibility toggles.

---

## Sub-Task 1 — Implement the Triggered System 2 Generator

**Intent:**
Write a new function `generateCoupledWaveform(params1, params2, couplingDelay, totalTime)` that
produces System 2's `{t, v}` data by simulating forward in time, triggering a new rise each time
a System 1 crash fires (offset by the coupling delay). This replaces the current call to
`generateWaveform(params2, totalTime)`.

**Coupling algorithm (procedural simulation):**
1. Collect all System 1 crash times from `params1` — they occur at
   `t = n × cycleLength1 + restDuration1 + riseDuration1` for `n = 0, 1, 2, …` while `< totalTime`.
2. Each crash time becomes a trigger time: `triggerTime = crashTime + couplingDelay`.
3. Walk through all trigger times in order. Between triggers, simulate the current phase
   (rising, crashing, recovering, or idle/flat).
4. At each trigger: record the current System 2 value (`currentLevel`), then schedule a new rise
   starting from `currentLevel` of height `riseHeight` over `riseDuration2`.
5. At the end of that rise: emit an instantaneous crash (two points at same `t`) dropping
   `2 × riseHeight` from the peak.
6. Then simulate recovery linearly to 0 over `recoverDuration2`.
7. Output is a dense-enough set of `{t, v}` points to draw correctly in D3 (at minimum one point
   per phase boundary plus the two-point crash encoding).

**Expected Outcomes:**
- A new function `generateCoupledWaveform(params1, params2, couplingDelay, totalTime)` exists in
  `viz.js`.
- With `couplingDelay = 0` and System 2 parameters matching System 1's rise/recover durations,
  the output is visually sensible.
- With delay = 0 and System 2 `riseDuration` < System 1 `riseDuration`, repeated triggering
  accumulates peaks (resonance visible).
- The original `generateWaveform` function is left untouched (still used for System 1).

**Todo List:**
1. Compute the list of all System 1 crash times within `[0, totalTime)`.
2. Offset each by `couplingDelay` to get the list of trigger arrival times; filter out any that
   fall at or beyond `totalTime`.
3. Implement forward simulation: track `currentTime`, `currentLevel`, and the active phase
   (`idle | rising | crashing | recovering`) with the relevant phase end time.
4. For each trigger time: interpolate `currentLevel` at the trigger instant from the active phase,
   then immediately start a new rise from that level.
5. After a rise ends: emit the two-point crash (peak, peak − 2 × riseHeight), then start recovery.
6. After recovery ends: stay flat at 0 until next trigger.
7. Emit enough `{t, v}` points at each phase transition to faithfully represent the shape.
8. Add `generateCoupledWaveform` to `viz.js` above the `render` function.

**Relevant Context:**
- [`viz/viz.js`](viz/viz.js:20) — `generateWaveform(params, totalTime)` for reference on existing
  crash encoding (two-point same-`t` trick).
- [`viz/viz.js`](viz/viz.js:177) — `render(params1, params2)` — where the new generator will be called.

**Status:** `[x] done`

---

## Sub-Task 2 — Wire the New Generator into `render`

**Intent:**
Update `render` to call `generateCoupledWaveform` for System 2 data instead of
`generateWaveform`, passing in the coupling delay. Also fix the Y-axis domain so it is driven by
the actual data range of both systems (covering resonant peaks), not just the parameter
amplitudes.

**Expected Outcomes:**
- `render(params1, params2, couplingDelay)` signature expanded to accept `couplingDelay`.
- `currentData2` is populated by `generateCoupledWaveform(params1, params2, couplingDelay, totalTime)`.
- Y-axis domain is calculated from `d3.extent` over all values in both `currentData` and
  `currentData2`, with 20% padding.
- All existing call sites of `render` pass the coupling delay value.

**Todo List:**
1. Update `render` signature to `render(params1, params2, couplingDelay)`.
2. Replace `generateWaveform(params2, totalTime)` with
   `generateCoupledWaveform(params1, params2, couplingDelay, totalTime)`.
3. Replace the fixed `maxAmp`-based Y domain with one derived from the actual data:
   compute `minVal` and `maxVal` across both datasets, pad 20%, use as Y scale domain.
4. Update all `render(...)` call sites (in `wireControl` handlers and the initial render) to read
   and pass the coupling delay.

**Relevant Context:**
- [`viz/viz.js`](viz/viz.js:177) — `render` function.
- [`viz/viz.js`](viz/viz.js:240) — `wireControl` call sites that invoke `render`.
- [`viz/viz.js`](viz/viz.js:265) — initial `render` call.

**Status:** `[x] done`

---

## Sub-Task 3 — Update System 2 UI and Add Coupling Panel

**Intent:**
Make all UI changes in one pass: remove System 2's now-meaningless `restDuration` control,
rename its amplitude label, and add the new "Coupling" panel (with a single "Coupling delay"
slider + number input) between the System 1 and System 2 panels. Wire everything in `viz.js`.

**Expected Outcomes:**
- System 2 control panel has three controls: "Rise height per trigger" (amplitude), "Rise
  duration", "Recover duration". The `s2-rest-slider` and `s2-rest-num` elements are gone.
- A new `.control-panel` with header "Coupling" sits between the System 1 and System 2 panels
  in `#controls`.
- Coupling panel has one control group: label "Coupling delay", slider ID
  `coupling-delay-slider`, number input ID `coupling-delay-num`, default 0, min 0, max 5, step 0.1.
- `readCouplingDelay()` in `viz.js` returns the numeric value of `coupling-delay-num`.
- `wireControl('coupling-delay-slider', 'coupling-delay-num')` added; `wireControl` for
  `s2-rest-slider` removed.
- `readParams2()` no longer contains `restDuration`.
- All `render(...)` invocations updated to `render(readParams(), readParams2(), readCouplingDelay())`.

**Todo List:**
1. In `index.html`, remove the System 2 "Rest" `.control-group` block.
2. Change the System 2 amplitude label from "Amplitude" to "Rise height per trigger".
3. Insert a new `.control-panel` div (header "Coupling") between the System 1 and System 2
   panels, with a single control group for "Coupling delay" (ids `coupling-delay-slider` /
   `coupling-delay-num`, min=0, max=5, step=0.1, value=0).
4. In `viz.js`, add `readCouplingDelay()` returning `+document.getElementById('coupling-delay-num').value`.
5. Remove `wireControl('s2-rest-slider', 's2-rest-num')` and add
   `wireControl('coupling-delay-slider', 'coupling-delay-num')`.
6. Remove `restDuration` from `readParams2()`.
7. Update all `render(...)` call sites to pass `readCouplingDelay()` as the third argument.

**Relevant Context:**
- [`viz/index.html`](viz/index.html) — System 2 control panel (the `s2-rest-*` group and the
  amplitude label); `#controls` block where the new Coupling panel is inserted.
- [`viz/viz.js`](viz/viz.js:227) — `readParams2()`.
- [`viz/viz.js`](viz/viz.js:258) — `wireControl` calls for System 2.
- [`viz/viz.js`](viz/viz.js:265) — initial `render` call.

**Status:** `[x] done`

---

## Sub-Task 4 — Update WIKI and Legend

**Intent:**
Update `_context/WIKI.md` to document the Stage 3 coupling design, the new parameter set, and
update the stage status table. Update the chart legend in `index.html` to indicate that System 2
is now "trigger-driven".

**Expected Outcomes:**
- `WIKI.md` Stage 3 entry updated to "done".
- WIKI documents the coupling rules, the new System 2 parameter set (riseHeight, riseDuration,
  recoverDuration), and the coupling delay parameter.
- The chart legend `<span>` for System 2 reads "System 2 (triggered)" (or similar) to signal
  the dependency.

**Todo List:**
1. In `_context/WIKI.md`, update Stage 3 status to "done" in the implementation status table.
2. In `viz/index.html`, update the legend System 2 label to "System 2 (triggered)".

**Relevant Context:**
- [`_context/WIKI.md`](_context/WIKI.md:257) — implementation status table.
- [`viz/index.html`](viz/index.html) — `#legend` div.

**Status:** `[x] done`
