// ─── Waveform data generator ────────────────────────────────────────────────

/**
 * Generate (t, v) points for a coupled-system waveform.
 *
 * One cycle has four phases:
 *   1. Rest     – flat at 0 for restDuration
 *   2. Rise     – linear ramp to +amplitude over riseDuration
 *   3. Crash    – instantaneous drop to -amplitude (two points at same t)
 *   4. Recover  – linear ramp back to 0 over recoverDuration
 *
 * The instantaneous crash is encoded as two consecutive {t, v} points sharing
 * the same t value — this forces D3's linear line generator to draw a vertical
 * segment.
 *
 * @param {{ amplitude: number, restDuration: number, riseDuration: number, recoverDuration: number }} params
 * @param {number} totalTime
 * @returns {{ t: number, v: number }[]}
 */
function generateWaveform(params, totalTime) {
  const { amplitude, restDuration, riseDuration, recoverDuration } = params;
  const cycleLength = restDuration + riseDuration + recoverDuration;
  const points = [];

  let t = 0;

  // Always start at origin
  points.push({ t: 0, v: 0 });

  while (t < totalTime) {
    const restEnd    = t + restDuration;
    const riseEnd    = restEnd + riseDuration;
    const recoverEnd = riseEnd + recoverDuration;

    // Clamp to totalTime so we don't overshoot
    if (restEnd > t) {
      // End of rest phase — still at 0
      const te = Math.min(restEnd, totalTime);
      points.push({ t: te, v: 0 });
      if (te >= totalTime) break;
    }

    if (riseEnd > restEnd) {
      // End of rise phase — peak; also serves as crash-top (same t, different v follows)
      const te = Math.min(riseEnd, totalTime);
      if (te >= totalTime) { points.push({ t: te, v: amplitude }); break; }
    }

    // Instantaneous crash: two points at the same t, top then bottom
    points.push({ t: riseEnd, v: amplitude });
    points.push({ t: riseEnd, v: -amplitude });

    if (recoverEnd > riseEnd) {
      // End of recover phase — back to 0
      const te = Math.min(recoverEnd, totalTime);
      points.push({ t: te, v: 0 });
      if (te >= totalTime) break;
    }

    t += cycleLength;
  }

  return points;
}

/**
 * Generate {t, v} points for System 2, driven by System 1 crash triggers.
 *
 * Manual trace (params1={amplitude:1,restDuration:2,riseDuration:3,recoverDuration:1},
 *   params2={amplitude:1,riseDuration:2,recoverDuration:2}, couplingDelay=0, totalTime=36):
 *
 *   cycleLength1 = 6; crash times = 5,11,17,23,29,35 (all < 36).
 *   Trigger t=5  → currentLevel=0; rise 0→1 over t=5..7; crash: (7,1),(7,-1); recover to 0 by t=9.
 *   Trigger t=11 → currentLevel=0; rise 0→1 over t=11..13; crash: (13,1),(13,-1); recover to 0 by t=15.
 *   Each subsequent trigger follows the same pattern (System 2 is idle/flat at 0 between t=9→11,
 *   t=15→17, etc.) — no resonance accumulation under these params, shape repeats cleanly. ✓
 *
 * Coupling rules:
 *  - System 2 is flat at 0 until the first trigger.
 *  - On each trigger: interpolate currentLevel from the active phase; immediately start a rise
 *    of +riseHeight from that level over riseDuration2.
 *  - Rise end: instantaneous crash — emit (t, peak) then (t, peak − 2×riseHeight).
 *  - Recover linearly to 0 over recoverDuration2.
 *  - New trigger during rise or recovery: interrupt, interpolate current level, start new rise.
 *
 * @param {{ amplitude: number, restDuration: number, riseDuration: number, recoverDuration: number }} params1
 * @param {{ amplitude: number, riseDuration: number, recoverDuration: number }} params2
 * @param {number} couplingDelay
 * @param {number} totalTime
 * @returns {{ t: number, v: number }[]}
 */
function generateCoupledWaveform(params1, params2, couplingDelay, totalTime) {
  const { restDuration: rest1, riseDuration: rise1, recoverDuration: recover1 } = params1;
  const { amplitude: riseHeight, riseDuration: rise2, recoverDuration: recover2 } = params2;
  const cycleLength1 = rest1 + rise1 + recover1;

  // Step 1: collect System 1 crash times and offset to trigger arrival times
  const triggers = [];
  for (let n = 0; ; n++) {
    const crashTime = n * cycleLength1 + rest1 + rise1;
    if (crashTime >= totalTime) break;
    const triggerTime = crashTime + couplingDelay;
    if (triggerTime < totalTime) triggers.push(triggerTime);
  }

  // Flat-at-zero shortcut when no triggers fire
  if (triggers.length === 0) {
    return [{ t: 0, v: 0 }, { t: totalTime, v: 0 }];
  }

  // Step 2: forward simulation
  // Phases: 'idle' | 'rising' | 'recovering'
  // For 'rising':  level goes from phaseStartLevel to phaseStartLevel + riseHeight
  //                over [phaseStartTime, phaseStartTime + rise2]
  // For 'recovering': level goes from phaseStartLevel to 0
  //                   over [phaseStartTime, phaseStartTime + recover2]
  // For 'idle':    level is constant 0

  const points = [];
  points.push({ t: 0, v: 0 });

  let phase = 'idle';
  let phaseStartTime  = 0;
  let phaseEndTime    = Infinity;
  let phaseStartLevel = 0;
  let phaseEndLevel   = 0;

  /** Interpolate level at time t within the current phase */
  function levelAt(t) {
    if (phase === 'idle') return 0;
    const frac = (phaseEndTime - phaseStartTime) > 0
      ? (t - phaseStartTime) / (phaseEndTime - phaseStartTime)
      : 1;
    return phaseStartLevel + frac * (phaseEndLevel - phaseStartLevel);
  }

  /** Advance simulation up to (but not including) nextEvent, emitting phase-boundary points */
  function advanceTo(nextEvent) {
    if (phase === 'idle') {
      // Nothing to emit; level stays 0
      return;
    }

    // If the current phase ends before (or at) nextEvent, walk through it
    while (phase !== 'idle' && phaseEndTime <= nextEvent) {
      if (phase === 'rising') {
        const peak = phaseStartLevel + riseHeight;
        // Emit rise end = crash top, then crash bottom (instantaneous crash encoding)
        points.push({ t: phaseEndTime, v: peak });
        points.push({ t: phaseEndTime, v: peak - 2 * riseHeight });

        // Transition to recovering
        phase          = 'recovering';
        phaseStartTime = phaseEndTime;
        phaseEndTime   = phaseStartTime + recover2;
        phaseStartLevel = peak - 2 * riseHeight;
        phaseEndLevel   = 0;

      } else if (phase === 'recovering') {
        // Recovery complete — back to 0
        points.push({ t: phaseEndTime, v: 0 });

        phase          = 'idle';
        phaseStartTime = phaseEndTime;
        phaseEndTime   = Infinity;
        phaseStartLevel = 0;
        phaseEndLevel   = 0;
      }
    }
  }

  for (const trigger of triggers) {
    // Advance through any phases that complete before this trigger
    advanceTo(trigger);

    // Interpolate current level at the trigger instant
    const current = levelAt(trigger);

    // Emit a point at the trigger instant so the line is flat up to here when idle,
    // or correctly interrupted when mid-phase
    points.push({ t: trigger, v: current });

    // Start new rise from current level
    phase           = 'rising';
    phaseStartTime  = trigger;
    phaseEndTime    = trigger + rise2;
    phaseStartLevel = current;
    phaseEndLevel   = current + riseHeight;
  }

  // Advance through any remaining phases after the last trigger
  advanceTo(totalTime);

  // If still mid-phase at totalTime, emit a final boundary point
  if (phase !== 'idle' && phaseEndTime > totalTime) {
    points.push({ t: totalTime, v: levelAt(totalTime) });
  } else if (phase === 'idle') {
    // Ensure the line extends to totalTime
    const lastT = points[points.length - 1].t;
    if (lastT < totalTime) {
      points.push({ t: totalTime, v: 0 });
    }
  }

  return points;
}

// ─── Chart setup ────────────────────────────────────────────────────────────

const MARGIN = { top: 20, right: 24, bottom: 44, left: 52 };

const container = document.getElementById('chart');

function chartWidth() {
  return container.clientWidth - MARGIN.left - MARGIN.right;
}
const HEIGHT = 320 - MARGIN.top - MARGIN.bottom;

const svg = d3.select('#chart')
  .append('svg')
    .attr('width', '100%')
    .attr('height', HEIGHT + MARGIN.top + MARGIN.bottom);

// Clip path to constrain the line to the plot area
const clipId = 'plot-clip';
svg.append('defs')
  .append('clipPath')
    .attr('id', clipId)
  .append('rect')
    .attr('x', 0)
    .attr('y', -MARGIN.top)
    .attr('width', chartWidth())
    .attr('height', HEIGHT + MARGIN.top);

const g = svg.append('g')
  .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

// Zero reference line
const zeroLine = g.append('line')
  .attr('class', 'zero-line')
  .attr('x1', 0)
  .attr('x2', chartWidth());

// Axis groups
const xAxisG = g.append('g').attr('class', 'axis x-axis').attr('transform', `translate(0,${HEIGHT})`);
const yAxisG = g.append('g').attr('class', 'axis y-axis');

// Axis labels
g.append('text')
  .attr('class', 'axis-label')
  .attr('text-anchor', 'middle')
  .attr('x', chartWidth() / 2)
  .attr('y', HEIGHT + 38)
  .attr('id', 'x-label')
  .text('Time');

g.append('text')
  .attr('class', 'axis-label')
  .attr('text-anchor', 'middle')
  .attr('transform', `rotate(-90)`)
  .attr('x', -(HEIGHT / 2))
  .attr('y', -40)
  .text('Value');

// Waveform paths (clipped)
const clipGroup = g.append('g').attr('clip-path', `url(#${clipId})`);

const linePath = clipGroup.append('path')
    .attr('class', 'waveform-line system1-line');

const linePath2 = clipGroup.append('path')
    .attr('class', 'waveform-line system2-line');

// Scales (mutable refs updated on render)
let xScale  = d3.scaleLinear();
let yScale  = d3.scaleLinear();

// The base (un-zoomed) x scale — updated on data change, referenced by zoom
let xScaleBase = d3.scaleLinear();

// ─── D3 line generator ───────────────────────────────────────────────────────

const lineGen = d3.line()
  .x(d => xScale(d.t))
  .y(d => yScale(d.v));

// ─── Zoom behaviour ──────────────────────────────────────────────────────────

const zoom = d3.zoom()
  .scaleExtent([0.5, 50])
  .on('zoom', (event) => {
    xScale = event.transform.rescaleX(xScaleBase);
    redrawAxesAndLine();
  });

svg.call(zoom);

// Reset zoom button
document.getElementById('reset-btn').addEventListener('click', () => {
  svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
});

// ─── Render logic ────────────────────────────────────────────────────────────

let currentData  = [];
let currentData2 = [];

function redrawAxesAndLine() {
  xAxisG.call(d3.axisBottom(xScale).ticks(8).tickSizeOuter(0));
  linePath.attr('d', lineGen(currentData));
  linePath2.attr('d', lineGen(currentData2));

  // Keep zero line in sync with current x extent
  const [x0, x1] = xScale.range();
  const y0 = yScale(0);
  zeroLine.attr('x1', x0).attr('x2', x1).attr('y1', y0).attr('y2', y0);
}

function render(params1, params2, couplingDelay) {
  const cycleLength = params1.restDuration + params1.riseDuration + params1.recoverDuration;
  const totalTime   = cycleLength * 6;

  currentData  = generateWaveform(params1, totalTime);
  currentData2 = generateCoupledWaveform(params1, params2, couplingDelay, totalTime);

  // Y scale: derived from actual data extents across both systems, padded 20%
  const allValues = currentData.map(d => d.v).concat(currentData2.map(d => d.v));
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const span = Math.max(maxVal - minVal, params1.amplitude * 0.1); // avoid zero-span
  const pad  = span * 0.2;
  yScale = d3.scaleLinear()
    .domain([minVal - pad, maxVal + pad])
    .range([HEIGHT, 0]);

  // X base scale
  xScaleBase = d3.scaleLinear()
    .domain([0, totalTime])
    .range([0, chartWidth()]);

  // Reset zoom to identity so the new data fills the view
  svg.call(zoom.transform, d3.zoomIdentity);

  // Axes
  xAxisG.call(d3.axisBottom(xScaleBase).ticks(8).tickSizeOuter(0));
  yAxisG.call(d3.axisLeft(yScale).ticks(6).tickSizeOuter(0));

  // X axis label position (may change if chart resized)
  d3.select('#x-label').attr('x', chartWidth() / 2);

  // Zero line Y position
  const y0 = yScale(0);
  zeroLine.attr('x1', 0).attr('x2', chartWidth()).attr('y1', y0).attr('y2', y0);

  // Line paths
  xScale = xScaleBase;
  linePath.attr('d', lineGen(currentData));
  linePath2.attr('d', lineGen(currentData2));
}

// ─── Controls wiring ─────────────────────────────────────────────────────────

function readParams() {
  return {
    amplitude:       +document.getElementById('amplitude-num').value,
    restDuration:    +document.getElementById('rest-num').value,
    riseDuration:    +document.getElementById('rise-num').value,
    recoverDuration: +document.getElementById('recover-num').value,
  };
}

function readParams2() {
  return {
    amplitude:       +document.getElementById('s2-amplitude-num').value,
    riseDuration:    +document.getElementById('s2-rise-num').value,
    recoverDuration: +document.getElementById('s2-recover-num').value,
  };
}

function readCouplingDelay() {
  return +document.getElementById('coupling-delay-num').value;
}

function wireControl(sliderId, numId) {
  const slider = document.getElementById(sliderId);
  const num    = document.getElementById(numId);

  slider.addEventListener('input', () => {
    num.value = slider.value;
    render(readParams(), readParams2(), readCouplingDelay());
  });

  num.addEventListener('input', () => {
    slider.value = num.value;
    render(readParams(), readParams2(), readCouplingDelay());
  });
}

// System 1 controls
wireControl('amplitude-slider', 'amplitude-num');
wireControl('rest-slider',      'rest-num');
wireControl('rise-slider',      'rise-num');
wireControl('recover-slider',   'recover-num');

// System 2 controls
wireControl('s2-amplitude-slider', 's2-amplitude-num');
wireControl('s2-rise-slider',      's2-rise-num');
wireControl('s2-recover-slider',   's2-recover-num');

// Coupling control
wireControl('coupling-delay-slider', 'coupling-delay-num');

// ─── Initial render ──────────────────────────────────────────────────────────

render(readParams(), readParams2(), readCouplingDelay());

console.log('coupled-system viz ready');
