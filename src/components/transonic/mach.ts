// TRANSONIC · airspeed.
// The page's scroll speed as a share of "full", 0 to 1. Shocks grow with it: scroll hard and
// the titles go transonic, stop and they settle back. Fast to build, slow to relax, the way
// the shocks on the airframe come and go with the throttle.

type Clocked = Window & { __wdClock?: () => number };

// The page clock. A capture rig can drive time through window.__wdClock; otherwise real time.
export function clockNow(): number {
  if (typeof window === "undefined") return 0;
  const c = (window as Clocked).__wdClock;
  return c ? c() : performance.now();
}

const DEAD = 200; // px/s of drift that counts as standing still
const FULL = 2800; // px/s that counts as full speed
const ATTACK = 70; // ms
const RELEASE = 620; // ms

let lastY = 0;
let lastT = -1;
let mach = 0;

// Safe to call from several loops in one frame: samples closer than 4ms apart return the
// last value instead of reading a near-zero velocity.
export function sampleMach(now: number): number {
  if (typeof window === "undefined") return 0;
  const y = window.scrollY;
  if (lastT < 0) {
    lastY = y;
    lastT = now;
    return mach;
  }
  const dt = now - lastT;
  if (dt < 4) return mach;
  const v = (Math.abs(y - lastY) / dt) * 1000;
  const target = Math.min(1, Math.max(0, (v - DEAD) / (FULL - DEAD)));
  const tau = target > mach ? ATTACK : RELEASE;
  mach += (target - mach) * (1 - Math.exp(-dt / tau));
  lastY = y;
  lastT = now;
  return mach;
}
