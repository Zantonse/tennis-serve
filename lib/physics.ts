// Constants
const BALL_MASS = 0.057; // kg (57g)
const CONTACT_TIME = 0.0045; // seconds (4.5ms)
const NET_HEIGHT = 0.914; // meters (center)
const COURT_LENGTH = 23.77; // meters (baseline to baseline)
const GRAVITY = 9.81; // m/s²
const AIR_DENSITY = 1.225; // kg/m³
const BALL_RADIUS = 0.0335; // meters
const BALL_AREA = Math.PI * BALL_RADIUS * BALL_RADIUS;
const DRAG_COEFFICIENT = 0.55;

export {
  BALL_MASS,
  CONTACT_TIME,
  NET_HEIGHT,
  COURT_LENGTH,
  GRAVITY,
  AIR_DENSITY,
  BALL_RADIUS,
  BALL_AREA,
  DRAG_COEFFICIENT,
};

/**
 * Compute a simplified 2D Magnus trajectory for a tennis ball.
 * Returns an array of ~50 {x, y} points representing the flight path.
 *
 * @param speed      Ball speed in km/h
 * @param spinRate   Spin rate in RPM
 * @param spinType   'topspin' | 'slice' | 'flat' | 'kick'
 * @param launchAngle  Optional launch angle in degrees (overrides spinType default)
 */
export function magnusTrajectory(
  speed: number,
  spinRate: number,
  spinType: "topspin" | "slice" | "flat" | "kick",
  launchAngle?: number
): { x: number; y: number }[] {
  // Default launch angles per spin type
  const defaultAngles: Record<string, number> = {
    topspin: 8,
    slice: 4,
    flat: 5,
    kick: 12,
  };

  const angleDeg =
    launchAngle !== undefined ? launchAngle : defaultAngles[spinType];
  const angleRad = (angleDeg * Math.PI) / 180;

  // Convert speed: km/h -> m/s
  const v0 = (speed * 1000) / 3600;

  // Convert spin: RPM -> rad/s
  const omega = (spinRate * 2 * Math.PI) / 60;

  // Magnus lift coefficient (Cl) varies by spin type and magnitude
  // Positive Cl -> upward Magnus force (slice), negative -> downward (topspin/kick)
  const spinFactor = omega / 1000; // normalise
  let Cl: number;
  switch (spinType) {
    case "topspin":
      Cl = -0.25 * spinFactor; // downward force
      break;
    case "kick":
      Cl = -0.35 * spinFactor; // more downward
      break;
    case "slice":
      Cl = 0.20 * spinFactor; // upward force
      break;
    case "flat":
    default:
      Cl = -0.05 * spinFactor; // near-zero, slight downward
      break;
  }

  const dt = 0.02; // seconds per step
  const SERVE_HEIGHT = 2.5; // approximate contact height above ground (m)

  let x = 0;
  let y = SERVE_HEIGHT;
  let vx = v0 * Math.cos(angleRad);
  let vy = v0 * Math.sin(angleRad);

  const points: { x: number; y: number }[] = [];
  points.push({ x, y });

  while (y > 0 && x < COURT_LENGTH) {
    const v = Math.sqrt(vx * vx + vy * vy);

    // Drag force magnitude: F_drag = 0.5 * Cd * rho * A * v²
    const F_drag = 0.5 * DRAG_COEFFICIENT * AIR_DENSITY * BALL_AREA * v * v;
    // Drag decelerates along velocity direction
    const ax_drag = -(F_drag / BALL_MASS) * (vx / (v || 1));
    const ay_drag = -(F_drag / BALL_MASS) * (vy / (v || 1));

    // Magnus force magnitude: F_magnus = 0.5 * Cl * rho * A * v²
    const F_magnus = 0.5 * Cl * AIR_DENSITY * BALL_AREA * v * v;
    // Magnus acts perpendicular to velocity — for 2D, apply as vertical component
    const ay_magnus = F_magnus / BALL_MASS;

    // Total accelerations
    const ax = ax_drag;
    const ay = ay_drag + ay_magnus - GRAVITY;

    // Euler integration
    vx += ax * dt;
    vy += ay * dt;
    x += vx * dt;
    y += vy * dt;

    points.push({ x, y: Math.max(0, y) });

    // Stop once grounded
    if (y <= 0) break;
  }

  // Downsample to ~50 points if more were generated
  if (points.length > 50) {
    const step = Math.ceil(points.length / 50);
    const sampled: { x: number; y: number }[] = [];
    for (let i = 0; i < points.length; i += step) {
      sampled.push(points[i]);
    }
    // Always include the last point
    const last = points[points.length - 1];
    if (sampled[sampled.length - 1] !== last) sampled.push(last);
    return sampled;
  }

  return points;
}

/**
 * Estimate ball speed after impact using the simplified coefficient-of-restitution model.
 *
 * @param racketSpeed  Racket head speed in km/h
 * @param racketMass   Racket mass in kg
 * @param cor          Coefficient of restitution (default 0.85)
 * @returns Ball speed in km/h
 */
export function ballSpeed(
  racketSpeed: number,
  racketMass: number,
  cor: number = 0.85
): number {
  // v_ball = racketSpeed * (1 + cor) * racketMass / (BALL_MASS + racketMass)
  return (racketSpeed * (1 + cor) * racketMass) / (BALL_MASS + racketMass);
}

/**
 * Estimate the peak contact force during ball-racket impact.
 *
 * @param racketSpeed  Racket head speed in km/h
 * @param racketMass   Racket mass in kg
 * @returns Contact force in Newtons
 */
export function contactForce(
  racketSpeed: number,
  racketMass: number
): number {
  // Convert racket speed to m/s
  const v_racket_ms = (racketSpeed * 1000) / 3600;

  // Resulting ball speed in m/s (cor = 0.85 default)
  const v_ball_kmh = ballSpeed(racketSpeed, racketMass);
  const v_ball_ms = (v_ball_kmh * 1000) / 3600;

  // deltaV for the ball (from stationary to v_ball_ms)
  const deltaV = v_ball_ms;

  // F = m * deltaV / contactTime
  // Also account for racket deceleration — simplified: use ball momentum change
  void v_racket_ms; // suppress unused-variable warning
  return (BALL_MASS * deltaV) / CONTACT_TIME;
}

/**
 * Calculate how efficiently kinetic energy is transferred from racket to ball.
 *
 * @param racketSpeed       Racket head speed in km/h
 * @param racketMass        Racket mass in kg
 * @param resultBallSpeed   Resulting ball speed in km/h
 * @returns Energy efficiency as a percentage (0–100)
 */
export function energyEfficiency(
  racketSpeed: number,
  racketMass: number,
  resultBallSpeed: number
): number {
  const v_racket_ms = (racketSpeed * 1000) / 3600;
  const v_ball_ms = (resultBallSpeed * 1000) / 3600;

  const KE_racket = 0.5 * racketMass * v_racket_ms * v_racket_ms;
  const KE_ball = 0.5 * BALL_MASS * v_ball_ms * v_ball_ms;

  if (KE_racket === 0) return 0;
  return (KE_ball / KE_racket) * 100;
}

/**
 * Estimate the post-bounce height of the ball based on speed and spin.
 *
 * @param speed     Ball speed in km/h at bounce
 * @param spinRate  Spin rate in RPM
 * @param spinType  Spin type string
 * @returns Estimated bounce height in meters
 */
export function bounceHeight(
  speed: number,
  spinRate: number,
  spinType: string
): number {
  // Base bounce height scales with incoming speed
  const baseHeight = 0.3 + speed * 0.001;

  // Spin modifier: topspin raises bounce, slice lowers it
  const spinFactor = spinRate / 3000; // normalise to ~1 at typical 3000 RPM

  let modifier = 0;
  switch (spinType.toLowerCase()) {
    case "topspin":
    case "kick":
      modifier = 0.25 * spinFactor;
      break;
    case "slice":
      modifier = -0.15 * spinFactor;
      break;
    case "flat":
    default:
      modifier = 0;
      break;
  }

  return Math.max(0.1, baseHeight + modifier);
}

/**
 * Estimate the vertical clearance margin: how much room the ball has to clear
 * the net and still land within the service box.
 *
 * @param speed         Ball speed in km/h
 * @param spinRate      Spin rate in RPM
 * @param netClearance  Actual net clearance of the trajectory in meters
 * @returns Vertical margin in meters (positive = clears net; negative = fault)
 */
export function verticalMargin(
  speed: number,
  spinRate: number,
  netClearance: number
): number {
  // The required minimum clearance above net to land inside the service box
  // depends on speed and spin — faster and heavier topspin allow tighter margins
  const v_ms = (speed * 1000) / 3600;
  const spinFactor = spinRate / 3000;

  // Rough model: faster ball needs less arc clearance; topspin adds extra downward dip
  const requiredClearance = Math.max(
    0.05,
    0.3 - v_ms * 0.005 - spinFactor * 0.05
  );

  return netClearance - requiredClearance;
}
