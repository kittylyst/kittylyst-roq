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

function render(params1, params2) {
  const cycleLength = params1.restDuration + params1.riseDuration + params1.recoverDuration;
  const totalTime   = cycleLength * 6;

  currentData  = generateWaveform(params1, totalTime);
  currentData2 = generateWaveform(params2, totalTime);

  // Y scale: symmetric around 0, padded 20% — spans both systems' amplitudes
  const maxAmp = Math.max(params1.amplitude, params2.amplitude);
  const pad = maxAmp * 0.2;
  yScale = d3.scaleLinear()
    .domain([-maxAmp - pad, maxAmp + pad])
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
    restDuration:    +document.getElementById('s2-rest-num').value,
    riseDuration:    +document.getElementById('s2-rise-num').value,
    recoverDuration: +document.getElementById('s2-recover-num').value,
  };
}

function wireControl(sliderId, numId) {
  const slider = document.getElementById(sliderId);
  const num    = document.getElementById(numId);

  slider.addEventListener('input', () => {
    num.value = slider.value;
    render(readParams(), readParams2());
  });

  num.addEventListener('input', () => {
    slider.value = num.value;
    render(readParams(), readParams2());
  });
}

// System 1 controls
wireControl('amplitude-slider', 'amplitude-num');
wireControl('rest-slider',      'rest-num');
wireControl('rise-slider',      'rise-num');
wireControl('recover-slider',   'recover-num');

// System 2 controls
wireControl('s2-amplitude-slider', 's2-amplitude-num');
wireControl('s2-rest-slider',      's2-rest-num');
wireControl('s2-rise-slider',      's2-rise-num');
wireControl('s2-recover-slider',   's2-recover-num');

// ─── Initial render ──────────────────────────────────────────────────────────

render(readParams(), readParams2());

console.log('coupled-system viz ready');
