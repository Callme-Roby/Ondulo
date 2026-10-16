/** A Billy outline exported from Figma (see scripts/figma-blobs.py). */
export interface BlobGradient {
  /** gradientTransform of the radial gradient (a b c d e f). */
  matrix: number[];
  stops: [number, string][];
}

export interface BlobShape {
  width: number;
  height: number;
  /** Body outline: M start, then one cubic segment [x1 y1 x2 y2 x y] per anchor, closed. */
  start: number[];
  segments: number[][];
  /** Gradient fills stacked on the body (the design layers two gradients). */
  layers: BlobGradient[];
  /** Outline-only Billy (splash screen). */
  stroke: (BlobGradient & { width: number }) | null;
  /** Eyes and smile. */
  face: { d: string; fill: string }[];
  shadow: { blur: number; rgba: number[] } | null;
}

export interface Wobble {
  /** Unit vector from the centre through each anchor. */
  normals: number[][];
  phases: number[];
}

/** Direction in which each anchor of the outline ripples. */
export function wobbleFor(shape: BlobShape): Wobble {
  const anchors = shape.segments.map((s) => [s[4], s[5]]);
  const cx = anchors.reduce((sum, p) => sum + p[0], 0) / anchors.length;
  const cy = anchors.reduce((sum, p) => sum + p[1], 0) / anchors.length;
  const normals = anchors.map(([x, y]) => {
    const len = Math.hypot(x - cx, y - cy) || 1;
    return [(x - cx) / len, (y - cy) / len];
  });
  // Irregular phases so the outline never pulses as a whole
  const phases = anchors.map((_, i) => i * 2.39996);
  return { normals, phases };
}

/**
 * The outline at time `t` (radians, loops every 2π): each anchor moves along
 * its normal and drags its two control points with it, so the curve stays smooth.
 */
export function blobPath(
  start: number[],
  segments: number[][],
  wobble: Wobble,
  t: number,
  amplitude: number
): string {
  'worklet';
  const n = segments.length;
  const dx: number[] = [];
  const dy: number[] = [];
  for (let i = 0; i < n; i++) {
    const phase = wobble.phases[i];
    const r = amplitude * (0.65 * Math.sin(t + phase) + 0.35 * Math.sin(2 * t + phase * 1.7));
    dx.push(wobble.normals[i][0] * r);
    dy.push(wobble.normals[i][1] * r);
  }
  // The start point is the end anchor of the last segment
  const last = n - 1;
  let d = `M${(start[0] + dx[last]).toFixed(2)} ${(start[1] + dy[last]).toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const s = segments[i];
    const prev = i === 0 ? last : i - 1;
    d +=
      `C${(s[0] + dx[prev]).toFixed(2)} ${(s[1] + dy[prev]).toFixed(2)} ` +
      `${(s[2] + dx[i]).toFixed(2)} ${(s[3] + dy[i]).toFixed(2)} ` +
      `${(s[4] + dx[i]).toFixed(2)} ${(s[5] + dy[i]).toFixed(2)}`;
  }
  return `${d}Z`;
}
