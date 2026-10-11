/**
 * Pure camera geometry for one continuous overhead-tiger to frontal-SLP move.
 * Phase is clamped to [0, 1]; NaN and an omitted phase use the start.
 * Angles and the analytical basis avoid lookAt roll ambiguity at the pole.
 */
export const DURATION = 5.2;
// The oblique waypoint is route progress 2/3; this is inverse smoothstep(2/3).
// It is a descriptive marker, not a separate camera segment or easing boundary.
export const JOIN_PHASE = 0.5908699837580154;
export const INTRO_SECONDS = DURATION * JOIN_PHASE;
export const REVEAL_SECONDS = DURATION - INTRO_SECONDS;

const RADIUS = 23;
const TARGET = [0, 2.55, 0];
const DEG_TO_RAD = Math.PI / 180;
const OBLIQUE_ROUTE = 2 / 3;
const smoothstep = t => t * t * t * (t * (t * 6 - 15) + 10);
const vector = (...values) => values.map(value => value === 0 ? 0 : value);

/**
 * One quintic smoothstep eases only the start and end of the entire move.
 * At JOIN_PHASE the camera passes azimuth 60deg/elevation 30deg without stopping.
 * segment/localPhase retain the former API as labels around that waypoint.
 * introT/revealT normalize global eased progress before/after the waypoint;
 * neither is used to calculate the camera curve. zoomMix is global eased
 * progress, intended for one continuous overhead-to-front framing interpolation.
 * Basis vectors are camera-local axes expressed in world coordinates.
 */
export function sampleCamera(phase = 0) {
  const p = Number.isNaN(phase) ? 0 : Math.min(1, Math.max(0, phase));
  const segment = p < JOIN_PHASE ? 'intro' : 'reveal';
  const localPhase = segment === 'intro'
    ? p / JOIN_PHASE
    : (p - JOIN_PHASE) / (1 - JOIN_PHASE);
  const route = smoothstep(p);
  const introT = segment === 'intro' ? route / OBLIQUE_ROUTE : 1;
  const revealT = segment === 'reveal'
    ? Math.max(0, (route - OBLIQUE_ROUTE) / (1 - OBLIQUE_ROUTE))
    : 0;
  // The cubic arc peaks at 60deg at route=2/3, while elevation always descends.
  const azimuth = 405 * route * route * (1 - route) * DEG_TO_RAD;
  const elevation = 90 * (1 - route) * DEG_TO_RAD;

  const sinA = Math.sin(azimuth);
  const cosA = Math.cos(azimuth);
  // Make the initial pole exact, rather than retaining cos(pi/2) roundoff.
  const sinE = p === 0 ? 1 : Math.sin(elevation);
  const cosE = p === 0 ? 0 : Math.cos(elevation);
  const right = vector(cosA, 0, -sinA);
  const up = vector(-sinA * sinE, cosE, -cosA * sinE);
  const back = vector(sinA * cosE, sinE, cosA * cosE);

  return {
    position: vector(
      TARGET[0] + RADIUS * back[0],
      TARGET[1] + RADIUS * back[1],
      TARGET[2] + RADIUS * back[2],
    ),
    right,
    up,
    back,
    zoomMix: route,
    segment,
    localPhase,
    introT,
    revealT,
  };
}
