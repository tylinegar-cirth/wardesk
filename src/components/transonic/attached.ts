// TRANSONIC · the copy at speed. At rest the words are cut.
//
// In the F-35 photographs the shocks are not drawn on anything. You see them because whatever
// sits behind them breaks: the mountains jog and stream across each line. Here the shocks stand
// in front of the copy, so where one crosses a word the letters themselves jog, squeeze and catch
// light, and so does the picture behind them.
//
// Each word flies in. It comes out of its own left edge at speed, its nose (the full stop)
// first, and brakes to a hard stop in its place. While it is supersonic it wears its shocks: a
// bow shock standing off the nose, and a shock through a handful of its letters, each raked
// back at the Mach angle, so the word carries a nest of chevrons across the picture and through
// the copy around it. Then the bow shock tears off and runs on ahead across the page: the boom.
// The word stops dead.
//
// As it stops, its shocks lock into it (freeze, cut). A hairline of light flashes along each one
// and cools away, and every letter is cut once at the shocks' own lean (34 degrees off vertical,
// the Mach angle at Mach 1.2): a face in the light and a face turned from it. Over film the
// turned face takes the light of the film behind it (reflect), so it warms in the dust and cools
// at night. The shocks' trails out in the picture die, so the page at rest is clean, and every few
// seconds a glint runs along the cuts. Scrolling hard brings the shocks back out, as if the words
// were flying again.
//
// With freeze and cut at 0 (v7) the shocks stand up instead as the word brakes through Mach 1,
// shiver and split, and stay on its letters, quiet and nearly upright, and never still: they
// buffet, out in the air they kink like cracks, and now and then one surges and divides.
//
// The page keeps its own type for layout, selection and screen readers, but stops painting it
// while the engine draws it (the class wd-transonic-drawn); if the engine stops, the page's type
// comes back. Two canvases share one set of shocks: the picture is bent under the page's grade,
// the type is drawn bent above it. On a dark ground with no picture, a shock shows past the type
// as a faint line of light (dark-field schlieren); on a light ground only the type shows it.

import { sampleMach } from "./mach";

export type ShockGround = "dark" | "light";

export type AttachedParams = {
  fly: number; // how far a word travels as it lands, in cap heights
  flyMs: number; // how long it takes to brake to a stop
  mach: number; // how fast it arrives: its Mach number as it comes out
  hit: number; // a letter's shock while the word flies: its jump, as a share of cap height
  rest: number; // a letter's shock at rest
  settleMs: number; // once the word drops below Mach 1, how fast its shocks settle
  bow: number; // the bow shock's jump, as a share of cap height
  boom: number; // the boom's jump as it tears off, as a share of cap height
  boomSpeed: number; // how fast the boom runs across the page, px/s
  boomMs: number; // how fast it fades
  spacing: number; // between the shocks on a word, in cap heights
  seams: number; // the most shocks on one word (a word over several lines shares them out by width)
  reach: number; // how far a resting shock runs into the air beyond the copy, in cap heights
  rake: number; // how far a resting shock trails back, above and below its letter, per px
  lens: number; // width of the bent band either side of a shock, as a share of cap height
  magnify: number; // the rod of air along a shock over the picture: how hard it magnifies
  magnifyType: number; // and over the type
  tilt: number; // the vertical share of a resting shock's jump, so the cap line steps
  fracture: number; // kinks out in the air at rest, in cap heights
  buffet: number; // how far a resting shock swings, as lean
  pulse: number; // how much its strength wavers, as a share
  gusts: number; // surges per second per title (0 none)
  gustAmp: number; // how hard a surge pushes, as a share of cap height
  life: number; // rate of all of that unsteadiness (1 = as designed)
  speed: number; // how much harder the shocks work at full scroll speed, as a share
  gloss: number; // light piled up where the bend squeezes
  glint: number; // the fold's own light (0 none .. 1 full)
  line: number; // on a dark ground, a shock's faint light beyond the type (0 none)
  freeze: number; // 1: when a word stops dead its shocks lock into it (a hairline of light flashes
  // along each and cools away) and their trails out in the air die. 0: they stay standing (v7)
  lock: number; // the lean they lock at, dx per px of height (0.6745: 34 degrees off vertical)
  sweep: number; // seconds between passes of light along the cuts (0 none)
  etch: number; // the light a locked shock keeps along its line once it has cooled (0 none .. 1)
  cut: number; // as a word locks, every letter is cut once at the lock lean into a face in the
  // light and a face turned from it, 0 none .. 1 full
  cutK: number; // how dark the turned face is
  reflect: number; // how much the cut faces take the light of the film behind them (0 none)
};

export const DEFAULT_ATTACHED: AttachedParams = {
  fly: 2.1,
  flyMs: 300,
  mach: 1.5,
  hit: 0.12,
  rest: 0.05,
  settleMs: 420,
  bow: 0.3,
  boom: 0.42,
  boomSpeed: 1300,
  boomMs: 450,
  spacing: 1.8,
  seams: 4,
  reach: 4.5,
  rake: 0.07,
  lens: 0.05,
  magnify: 1.2,
  magnifyType: 0.4,
  tilt: 0.5,
  fracture: 0.11,
  buffet: 0.022,
  pulse: 0.4,
  gusts: 0.32,
  gustAmp: 0.07,
  life: 1,
  speed: 1.6,
  gloss: 1.3,
  glint: 0.5,
  line: 0.2,
  freeze: 1,
  lock: 0.6745,
  sweep: 4.2,
  etch: 0,
  cut: 1,
  cutK: 0.3,
  reflect: 0.6,
};

const MAXS_CAP = 28; // shocks per frame at most; fewer where the GPU allows fewer uniforms
const MAXZ = 6; // flying words (one per line of a word)
const TAU_C = 0.72; // the share of the flight before the word drops below Mach 1
const NOISE_W = 256;
const NOISE_H = 64;
const BG: [number, number, number] = [10 / 255, 10 / 255, 12 / 255];
const BONE: [number, number, number] = [0.941, 0.914, 0.847];

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Unsteadiness: irregular swings, each the sum of three incommensurate sines with the shock's own
// frequencies and phases, so no two shocks move together and none of them visibly loops.
type Band = [number[], number[]]; // angular frequencies (rad/s), phases
type Life = { sway: Band; pulse: Band; shiver: Band };
const TAU = Math.PI * 2;

function lifeFor(seed: number): Life {
  const r = rng(seed ^ 0x9e3779b9);
  const band = (hz: number[]): Band => [hz.map((h) => TAU * h * (0.85 + 0.3 * r())), hz.map(() => r() * TAU)];
  return { sway: band([0.9, 1.7, 2.9]), pulse: band([1.3, 2.3, 3.7]), shiver: band([6.3, 9.7, 14.1]) };
}

// in -1..1
function swing(t: number, [f, ph]: Band) {
  return (Math.sin(t * f[0] + ph[0]) + 0.7 * Math.sin(t * f[1] + ph[1]) + 0.45 * Math.sin(t * f[2] + ph[2])) / 2.15;
}

// ---------------------------------------------------------------------------------------------
// The copy, measured from the page itself: every glyph where the browser put it, so the type the
// engine draws lands on the page's own type to the pixel.

type Glyph = {
  ch: string;
  x: number; // origin, band px
  base: number; // baseline, band px
  l: number;
  r: number;
  inkR: number; // where its ink ends (a full stop's dot, not its advance)
  top: number; // cap top
  font: string;
  color: string;
  shadow: string; // the page's text-shadow on it, drawn with the glyph so it bends with it
  word: number;
  echo: boolean;
};
type Line = { base: number; top: number; glyphs: Glyph[] };
type Echo = { el: HTMLElement; l: number; w: number; blaze: number[]; cool: number[] };

function parseColor(c: string): number[] {
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return [0, 0, 0, 0];
  const v = m[1].split(",").map((s) => parseFloat(s));
  return [v[0] / 255, v[1] / 255, v[2] / 255, v.length > 3 ? v[3] : 1];
}

// the first layer of a computed text-shadow: "rgba(0, 0, 0, 0.6) 0px 2px 30px"
function parseShadow(v: string): { color: string; x: number; y: number; blur: number } | null {
  if (!v || v === "none") return null;
  const m = v.match(/^\s*(rgba?\([^)]*\)|#[0-9a-f]+|[a-z]+)\s+(-?[\d.]+)px\s+(-?[\d.]+)px(?:\s+([\d.]+)px)?/i);
  if (!m) return null;
  return { color: m[1], x: parseFloat(m[2]), y: parseFloat(m[3]), blur: parseFloat(m[4] ?? "0") };
}
function shadowReach(v: string) {
  const s = parseShadow(v);
  return s ? s.blur * 1.5 + Math.max(Math.abs(s.x), Math.abs(s.y)) : 0;
}

const isLetter = (ch: string) => ch.toLowerCase() !== ch.toUpperCase() || (ch >= "0" && ch <= "9");

function measureCopy(words: HTMLElement[], band: HTMLElement) {
  const br = band.getBoundingClientRect();
  const range = document.createRange();
  const ctx = document.createElement("canvas").getContext("2d");
  const glyphs: Glyph[] = [];
  let cap = 0;
  let echo: Echo | null = null;
  if (!ctx) return { glyphs, cap, lines: [] as Line[], echo };
  words.forEach((w, wi) => {
    const walker = document.createTreeWalker(w, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const el = node.parentElement;
      if (!el) continue;
      const cs = getComputedStyle(el);
      const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      ctx.font = font;
      const capH = ctx.measureText("H").actualBoundingBoxAscent || parseFloat(cs.fontSize) * 0.7;
      const ascent = ctx.measureText("H").fontBoundingBoxAscent || parseFloat(cs.fontSize) * 0.9;
      cap = Math.max(cap, capH);
      const upper = cs.textTransform === "uppercase";
      const ec = el.closest(".wd-echo") as HTMLElement | null;
      if (ec && !echo) {
        const er = ec.getBoundingClientRect();
        const b = getComputedStyle(ec, "::before");
        const a = getComputedStyle(ec, "::after");
        echo = { el: ec, l: er.left - br.left, w: er.width, blaze: parseColor(b.color), cool: parseColor(a.color) };
      }
      for (let i = 0; i < node.data.length; i++) {
        const raw = node.data[i];
        if (/\s/.test(raw)) continue;
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const rc = range.getClientRects()[0];
        if (!rc) continue;
        const ch = upper ? raw.toUpperCase() : raw;
        const base = rc.top - br.top + ascent;
        const x = rc.left - br.left;
        glyphs.push({
          ch,
          x,
          base,
          l: x,
          r: rc.right - br.left,
          inkR: x + (ctx.measureText(ch).actualBoundingBoxRight || rc.width),
          top: base - capH,
          font,
          color: cs.color,
          shadow: cs.textShadow,
          word: wi,
          echo: !!ec,
        });
      }
    }
  });
  // lines: glyphs that share a baseline
  const lines: Line[] = [];
  for (const g of glyphs) {
    let ln = lines.find((l) => Math.abs(l.base - g.base) < 2);
    if (!ln) {
      ln = { base: g.base, top: g.top, glyphs: [] };
      lines.push(ln);
    }
    ln.glyphs.push(g);
    ln.top = Math.min(ln.top, g.top);
  }
  lines.sort((a, b) => a.base - b.base);
  return { glyphs, cap, lines, echo };
}

// ---------------------------------------------------------------------------------------------
// The airframes: each line of each word flies as one body, its nose the last glyph.

type Seam = {
  x: number; // through the body of a letter, at rest
  amp: number;
  sign: number; // which way it bends: alternates
  vt: number; // which way the cap line steps at rest: alternates too
  lean: number; // how far it trails back at rest
  near: number; // 0 at the tail .. 1 at the nose: letters near the nose see slower flow
  strand: boolean; // it can divide
  row: number;
  phase: number;
  life: Life;
  gustAt: number;
};
type Airframe = {
  word: number;
  l: number; // the slot it comes out of: its own left edge
  zr: number; // where its drawing ends on the right
  zt: number; // and above and below: halfway-ish to the next line, so lines never share pixels
  zb: number;
  top: number;
  base: number;
  mid: number;
  nose: number;
  last: boolean; // the word's last line: it carries the bow shock and the boom
  upFull: number; // in flight its shocks run the whole field
  downFull: number;
  upRest: number; // at rest, only into the air beyond the copy
  downRest: number;
  seams: Seam[];
  row: number;
};

function layoutAirframes(lines: Line[], cap: number, P: AttachedParams, top: number, bottom: number, pad: number, own: boolean): Airframe[] {
  const out: Airframe[] = [];
  const lastLine = new Map<number, number>();
  lines.forEach((ln, li) => ln.glyphs.forEach((g) => lastLine.set(g.word, li)));
  // each word's width across all its lines, to share its shocks out between them
  const wordW = new Map<number, number>();
  lines.forEach((ln) => {
    const seen = new Map<number, [number, number]>();
    for (const g of ln.glyphs) {
      const b = seen.get(g.word);
      seen.set(g.word, b ? [Math.min(b[0], g.l), Math.max(b[1], g.inkR)] : [g.l, g.inkR]);
    }
    seen.forEach(([a, b], w) => wordW.set(w, (wordW.get(w) ?? 0) + (b - a)));
  });
  lines.forEach((ln, li) => {
    const groups: Glyph[][] = [];
    for (const g of ln.glyphs) {
      const cur = groups[groups.length - 1];
      if (cur && cur[0].word === g.word) cur.push(g);
      else groups.push([g]);
    }
    const mid = (ln.top + ln.base) / 2;
    const above = li > 0 ? lines[li - 1].base : null;
    const below = li < lines.length - 1 ? lines[li + 1].top : null;
    const zt = above !== null ? above + 0.7 * (ln.top - above) : ln.top - pad;
    const zb = below !== null ? ln.base + 0.7 * (below - ln.base) : ln.base + pad + 0.3 * cap;
    const upRest = above !== null ? mid - above - 0.2 * (ln.top - above) : Math.min(mid - top, 0.5 * cap + P.reach * cap);
    const downRest = below !== null ? below - mid - 0.2 * (below - ln.base) : Math.min(bottom - mid, 0.5 * cap + 0.5 * P.reach * cap);
    groups.forEach((gs, gi) => {
      const word = gs[0].word;
      const r = rng(7919 + word * 104729 + li * 1301);
      const l = Math.min(...gs.map((g) => g.l));
      const right = Math.max(...gs.map((g) => g.r));
      const next = groups[gi + 1];
      const nose = gs[gs.length - 1].inkR;
      // its shocks: from the nose back, through letters' bodies, never a full stop or a comma
      const letters = gs.filter((g) => isLetter(g.ch));
      const width = nose - l;
      const share = Math.max(1, Math.round((P.seams * width) / Math.max(1, wordW.get(word) ?? width)));
      const sp = Math.max(P.spacing, width / cap / share) * cap;
      const seams: Seam[] = [];
      const amps = [1, 0.75, 0.9, 0.7, 0.85];
      for (let k = 0; k < share; k++) {
        const want = nose - 0.9 * cap - k * sp;
        if (want < l + 0.3 * cap && k > 0) break;
        let best = letters[0];
        if (!best) break;
        for (const g of letters) if (Math.abs((g.l + g.r) / 2 - want) < Math.abs((best.l + best.r) / 2 - want)) best = g;
        const wd = best.r - best.l;
        const x = Math.min(best.r - 0.28 * wd, Math.max(best.l + 0.28 * wd, want));
        if (seams.some((s) => Math.abs(s.x - x) < 0.6 * cap)) continue;
        seams.push({
          x,
          amp: amps[k % amps.length],
          sign: k % 2 ? -1 : 1,
          vt: (k % 2 ? -1 : 1) * P.tilt,
          lean: P.rake * (0.6 + 0.8 * r()),
          near: Math.min(1, Math.max(0, (x - l) / Math.max(1, width))),
          strand: r() < 0.55,
          row: Math.floor(r() * (NOISE_H - 8)) + 2,
          phase: r() * 40,
          life: lifeFor(Math.round(x * 13) + li * 7 + word * 31),
          gustAt: -1e9,
        });
      }
      out.push({
        word,
        l,
        zr: next ? Math.min(right + pad, next[0].l) : right + pad,
        zt,
        zb,
        top: ln.top,
        base: ln.base,
        mid,
        nose,
        last: lastLine.get(word) === li,
        // over the cold open's picture a flying word's shocks run the whole field; on a section
        // title each line keeps them to its own air, so a block of copy never turns to lattice
        upFull: own ? Math.max(0.5 * cap, upRest) : Math.max(0, mid - top),
        downFull: own ? Math.max(0.5 * cap, downRest) : Math.max(0, bottom - mid),
        upRest: Math.max(0.5 * cap, upRest),
        downRest: Math.max(0.5 * cap, downRest),
        seams,
        row: Math.floor(r() * (NOISE_H - 8)) + 2,
      });
    });
  });
  return out;
}

// ---------------------------------------------------------------------------------------------
// GL

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

function frag(mode: 0 | 1, maxs: number) {
  return `
#define MODE ${mode}
#define MAXS ${maxs}
#define MAXZ ${MAXZ}
precision highp float;
varying vec2 vUv;
uniform vec2 uSize;    // canvas, CSS px
uniform vec2 uOrigin;  // canvas origin in band CSS px
uniform float uN;
uniform vec4 uA[MAXS]; // root x, root y, reach up, reach down (px)
uniform vec4 uB[MAXS]; // trail above, trail below (dx per px of height), signed jump px, lens px
uniform vec4 uC[MAXS]; // noise row, nose radius px, fracture zigzag px, streak px
uniform vec4 uD[MAXS]; // vertical share (signed), rod (signed), copy half-height px, air kinks px
uniform sampler2D uNoise;
uniform float uT;      // the unsteadiness clock, s
uniform float uFlow;
uniform float uFlowV;
uniform float uHalf;   // half a device pixel, CSS px
uniform float uGloss;
uniform float uGlint;
uniform float uMag;
#if MODE == 0
uniform sampler2D uVideo;
uniform vec4 uCover;   // where the video is drawn in the band (object-fit: cover)
uniform float uVidA;   // the video's own opacity on the page
uniform vec3 uBg;
uniform float uSmearM; // px of streak at full scroll speed
#else
uniform sampler2D uType;  // the copy, premultiplied
uniform sampler2D uEcho;  // the echo's glyphs (alpha)
uniform vec4 uTypeBox;    // where those textures sit, band px: x, y, w, h
uniform vec2 uEchoLW;     // the echo's box: left, width (band px)
uniform vec2 uEchoOff;    // the blaze and the cool layers' offsets, px
uniform vec4 uBlaze;
uniform vec4 uCool;
uniform vec3 uLight;
uniform float uLine;
uniform float uNZ;
uniform vec4 uZ[MAXZ];    // where each flying word draws: x0, y0, x1, y1 (band px)
uniform vec4 uZo[MAXZ];   // its offset along the flight line (px), whether it shows, and the
                          // left and right of its own glyphs at rest (so it never pulls in a
                          // neighbour's)
uniform float uBowK;      // the bow shock and the boom bend the type this much of what they bend
                          // the picture: a passing shock breaks a word, it doesn't shred it
uniform float uFrz;       // shocks locked into the type as creases (0 none)
uniform vec4 uSweep;      // a pass of light across the facets: x at y = 0, lean, width, strength
uniform float uEtch;      // the light a locked shock keeps along its line once it has cooled
uniform sampler2D uTypeCut; // the copy with every letter cut (premultiplied)
uniform float uCut;       // how much of it shows once a word locks
uniform vec2 uGlintW;     // the sweep as a glint: its core and its halo (px); 0 for a soft band
uniform vec4 uEnv;        // the film's light (its average colour) and how much the cut faces take it
#endif

// piecewise-linear noise: the texture's own linear filter puts a corner at every knot, so a
// shock is straight runs with sharp kinks between them, the way they are in the photographs
float kinks(float row, float s) {
  return texture2D(uNoise, vec2(s / ${NOISE_W}.0, (row + 0.5) / ${NOISE_H}.0)).r * 2.0 - 1.0;
}

float th(float x) {
  float e = exp(2.0 * clamp(x, -9.0, 9.0));
  return (e - 1.0) / (e + 1.0);
}

#if MODE == 1
// the echo's mask: nothing at its left edge, 28% by the middle, full at its right edge
float ramp(float f) {
  return f < 0.48 ? 0.28 * clamp(f, 0.0, 1.0) / 0.48 : 0.28 + 0.72 * (min(f, 1.0) - 0.48) / 0.52;
}

// A word whose shocks have locked into it keeps a hairline of light along each one, hot as it
// locks, cooling away. Now and then a glint runs along the cuts.
vec4 facet(vec4 ty, vec2 p, float cr) {
  vec3 g = ty.rgb / ty.a;
  float sd = p.x - uSweep.x - uSweep.y * p.y;
  float sw = uGlintW.x > 0.0
    ? uSweep.w * (0.95 * exp(-sd * sd / (uGlintW.x * uGlintW.x)) + 0.22 * exp(-sd * sd / (uGlintW.y * uGlintW.y)))
    : uSweep.w * exp(-pow(sd / max(uSweep.z, 1.0), 2.0));
  float lift = cr * (1.0 + 0.8 * sw) + (uGlintW.x > 0.0 ? sw : 0.1 * sw);
  g = 1.0 - (1.0 - g) * (1.0 - clamp(lift, 0.0, 1.0));
  return vec4(g * ty.a, ty.a);
}
#endif

void main() {
  vec2 p = uOrigin + vec2(vUv.x * uSize.x, (1.0 - vUv.y) * uSize.y);
  vec2 dv = vec2(0.0);
  float dd = 0.0; // how fast the bend changes across a shock: where it folds, light piles up
  float infl = 0.0;
  float smear = 0.0;
  vec2 sdir = vec2(0.0, 1.0);
  vec2 ndom = vec2(1.0, 0.0);
  float fmax = 0.0;
#if MODE == 1
  // which flying word this pixel belongs to: it comes out of its own left edge, so nothing of
  // it shows left of there, and the rest of it is still behind that edge
  float off = 0.0;
  float vis = 0.0;
  vec2 src = vec2(0.0);
  float zme = -1.0;
  float cutW = 0.0; // how far this word has locked: 1 + that, in its uZo.y
  for (int z = 0; z < MAXZ; z++) {
    if (float(z) >= uNZ) break;
    vec4 Z = uZ[z];
    if (p.x >= Z.x && p.x < Z.z && p.y >= Z.y && p.y < Z.w) {
      off = uZo[z].x;
      vis = step(0.5, uZo[z].y);
      cutW = max(uZo[z].y - 1.0, 0.0);
      src = uZo[z].zw;
      zme = float(z);
    }
  }
  float crease = 0.0; // the light along the nearest locked shock
#endif
  for (int i = 0; i < MAXS; i++) {
    if (float(i) >= uN) break;
    vec4 A = uA[i];
    vec4 B = uB[i];
    vec4 C = uC[i];
    vec4 D = uD[i];
    float dy = p.y - A.y;
#if MODE == 1
    // a shock locked into its word: a crease, straight, the word's face turning over at it.
    // C.w carries its word (low three bits of the whole part, plus one), the light on it (the
    // rest of the whole part, 0..15) and how far it has locked (the fraction, 0.25..0.75)
    if (uFrz > 0.0 && C.w > 0.5) {
      float I = floor(C.w);
      if (abs(mod(I, 8.0) - 1.0 - zme) < 0.5) {
        float fz = clamp((C.w - I - 0.25) * 2.0, 0.0, 1.0);
        float kf = dy < 0.0 ? B.x : B.y;
        float uf = (p.x - (A.x + kf * abs(dy))) / sqrt(1.0 + kf * kf);
        float hot = floor(I / 8.0) / 15.0;
        float lw = (0.45 + uHalf) * (1.0 + 1.6 * hot);
        crease = max(crease, fz * (uEtch + (1.0 - uEtch) * hot) * exp(-uf * uf / (lw * lw)));
      }
    }
#endif
    float reach = dy < 0.0 ? A.z : A.w;
    if (reach < 1.0) continue;
    float ady = abs(dy);
    float a = ady / reach;
    if (a >= 1.0) continue;
    // the line trails back from its root, above and below: straight, or a hyperbola about a nose
    float k = dy < 0.0 ? B.x : B.y;
    float r = C.y;
    float q = sqrt(r * r + k * k * ady * ady);
    float x0 = A.x + (r > 0.5 ? sign(k) * (q - r) : k * ady);
    float kl = r > 0.5 ? k * abs(k) * ady / max(q, 1e-3) : k;
    float sl = sqrt(1.0 + kl * kl);
    float crink = 0.4 * B.w + 0.6 * C.z;
    float ka = crink * pow(a, 1.1);
    // out in the air, past the copy, a resting shock breaks direction like a crack
    float kbAmp = D.w * smoothstep(D.z, D.z * 1.4 + 10.0, ady);
    if (abs(p.x - x0) > (14.0 * B.w + 2.0 + ka + kbAmp + C.z) * sl) continue;
    float env = 1.0 - smoothstep(0.66, 1.0, a);
    float ph = uT * 0.6 + C.x * 0.37;
    float kk = 0.8 * kinks(C.x, ady / 150.0 + ph) + 0.2 * a * kinks(mod(C.x + 29.0, 56.0) + 2.0, ady / 28.0 + C.x * 0.53 + ph * 1.7);
    float kb = kbAmp * kinks(mod(C.x + 11.0, 56.0) + 2.0, (ady - D.z) / 140.0 + C.x * 0.41 + step(0.0, dy) * 3.7);
    float jog = C.z * pow(a, 0.6) * kinks(mod(C.x + 43.0, 56.0) + 2.0, ady / 22.0 + uT * 2.3);
    float x = x0 + ka * kk + kb + jog;
    vec2 tg = normalize(vec2(kl, dy < 0.0 ? -1.0 : 1.0));
    vec2 n = vec2(-tg.y, tg.x);
    if (n.x < 0.0) n = -n;
    float u = (p.x - x) / sl;
    // surges run out along the shock, so the bend streams instead of sitting still
    float fl = 1.0 + uFlow * kinks(mod(C.x + 17.0, 56.0) + 2.0, (ady - uT * uFlowV) / 110.0 + C.x * 0.71);
    // Across the shock everything jumps, and in a sliver about it everything is squeezed into a
    // fold: the shock is drawn by whatever sits behind it, never a stroke laid on top. Either
    // side a rod of air magnifies or squeezes what it crosses.
    float J = B.z * env * fl;
#if MODE == 1
    // over the type a shock breaks the letters without shredding them: never more than a stroke's
    // worth of jump, whatever it does to the picture behind
    if (C.y > 0.5) J *= uBowK;
    J = clamp(J, -1.4 * B.w, 1.4 * B.w);
#endif
    float R = 3.0 * B.w;
    float w = max(0.6, 0.12 * B.w);
    float e = exp(-abs(u) / R);
    float t = th(u / w);
    float f = J * t * e;
    // the fold's steepness averaged over the pixel, so a fold thinner than a pixel stays even
    float fp = J * ((th((u + uHalf) / w) - th((u - uHalf) / w)) / (2.0 * uHalf) - sign(u) * t / R) * e;
    float Wl = 0.9 * R;
    float cyl = exp(-0.5 * u * u / (Wl * Wl));
    float rod = D.y * env * fl * uMag;
    f += rod * u * cyl;
    fp += rod * (1.0 - u * u / (Wl * Wl)) * cyl;
    dv += f * vec2(n.x, n.y + D.x);
    dd += fp;
    if (abs(fp) > fmax) {
      fmax = abs(fp);
      ndom = n;
    }
    infl = max(infl, env * (1.0 - smoothstep(2.6 * R, 4.4 * R, abs(u))));
#if MODE == 0
    float sm = env * smoothstep(w, 4.0 * w, abs(u)) * exp(-abs(u) / (B.w * 6.0)) * (C.w + uSmearM);
    if (sm > smear) {
      smear = sm;
      sdir = tg;
    }
#endif
  }
  float Jc = abs(1.0 - dd);
  float glint = uGlint * smoothstep(4.0, 34.0, Jc);
  vec3 bone = vec3(${BONE[0]}, ${BONE[1]}, ${BONE[2]});
#if MODE == 0
  if (infl <= 0.0) {
    gl_FragColor = vec4(0.0);
    return;
  }
  vec2 qv = p - dv;
  // a screen pixel covers this much picture across a fold: the taps spread over it, and stream
  // along the shock while a word flies or the page moves fast
  vec2 fv = ndom * (1.0 - dd);
  vec3 vid = vec3(0.0);
  float wsum = 0.0;
  for (int k = -7; k <= 7; k++) {
    float fk = float(k) / 7.0;
    float wt = 1.0 - 0.6 * abs(fk);
    vec2 uv = (qv + fv * (mod(float(k + 7), 5.0) / 4.0 - 0.5) + sdir * (fk * smear) - uCover.xy) / uCover.zw;
    vid += wt * texture2D(uVideo, clamp(uv, 0.0, 1.0)).rgb;
    wsum += wt;
  }
  vid /= wsum;
  // light piles up where the bend squeezes the picture; where it spreads it, it barely dims
  vid = min(vid * pow(clamp(Jc, 0.92, 2.8), uGloss), 1.0);
  vid = 1.0 - (1.0 - vid) * (1.0 - glint * mix(bone, vid, 0.3));
  vec3 col = mix(uBg, vid, uVidA);
  gl_FragColor = vec4(col * infl, infl);
#else
  vec2 q = p - dv - vec2(off, 0.0);
  vis *= step(src.x, q.x) * step(q.x, src.y);
  vec4 col = vec4(0.0);
  if (vis > 0.0) {
    vec4 ty = texture2D(uType, (q - uTypeBox.xy) / uTypeBox.zw);
    if (uCut > 0.0 && cutW > 0.0) {
      vec4 tc = texture2D(uTypeCut, (q - uTypeBox.xy) / uTypeBox.zw);
      // the faces take the light of the film behind them, the face turned from the light most (the
      // face in the light stays nearly bone): warm in the dust, cold at night, different every shot
      if (uEnv.w > 0.0 && tc.a > 0.002 && ty.a > 0.002) {
        vec3 g = tc.rgb / tc.a;
        float lp = dot(ty.rgb / ty.a, vec3(0.299, 0.587, 0.114));
        float lc = dot(g, vec3(0.299, 0.587, 0.114));
        float turned = smoothstep(0.95, 0.8, lc / max(lp, 1e-3));
        float le = dot(uEnv.rgb, vec3(0.299, 0.587, 0.114));
        vec3 hue = mix(vec3(1.0), uEnv.rgb / max(le, 0.04), 0.6);
        vec3 lit = g * mix(vec3(1.0), hue, 0.06 * uEnv.w);
        vec3 shd = g * mix(vec3(1.0), hue * (0.7 + 0.6 * le), 0.55 * uEnv.w);
        tc = vec4(clamp(mix(lit, shd, turned), 0.0, 1.0) * tc.a, tc.a);
      }
      ty = mix(ty, tc, cutW * uCut);
    }
    if ((uFrz > 0.0 || uCut > 0.0) && ty.a > 0.002) ty = facet(ty, p, crease);
    // the echo, bent with the copy: blaze offset one way, cool the other, behind the glyphs
    float mB = texture2D(uEcho, (q - vec2(uEchoOff.x, 0.0) - uTypeBox.xy) / uTypeBox.zw).a;
    float mC = texture2D(uEcho, (q - vec2(uEchoOff.y, 0.0) - uTypeBox.xy) / uTypeBox.zw).a;
    float aB = uBlaze.a * mB * ramp((q.x - uEchoOff.x - uEchoLW.x) / max(uEchoLW.y, 1.0));
    float aC = uCool.a * mC * ramp((q.x - uEchoOff.y - uEchoLW.x) / max(uEchoLW.y, 1.0));
    col = vec4(uBlaze.rgb, 1.0) * aB;
    col = vec4(uCool.rgb, 1.0) * aC + col * (1.0 - aC);
    col = (ty + col * (1.0 - ty.a)) * vis;
  }
  // light piles up in the squeezed type, and the folds catch it, in proportion to the light
  // there is to squeeze: bone type takes a seam of light, dark ink stays ink
  if (col.a > 0.002) {
    vec3 un = col.rgb / col.a;
    float lum = dot(un, vec3(0.299, 0.587, 0.114));
    un = min(un * pow(clamp(Jc, 0.92, 2.8), uGloss), 1.0);
    un = 1.0 - (1.0 - un) * (1.0 - glint * lum * mix(bone, un, 0.3));
    col.rgb = un * col.a;
  }
  // past the type, on a dark ground, the shock's own faint light
  float ln = uLine * smoothstep(2.5, 12.0, Jc) * infl;
  col += vec4(uLight * ln, ln) * (1.0 - col.a);
  gl_FragColor = col;
#endif
}`;
}

type Pass = {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  u: (name: string) => WebGLUniformLocation | null;
  tex: WebGLTexture | null; // the video (mode 0) or the copy (mode 1)
  tex2: WebGLTexture | null; // the echo (mode 1)
  tex3: WebGLTexture | null; // the copy with every letter cut (mode 1)
  maxs: number;
};

function makePass(mode: 0 | 1, noise: Uint8Array, maxsIn?: number): Pass | null {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, { position: "absolute", left: "0px", pointerEvents: "none" } as CSSStyleDeclaration);
  const gl = (canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false }) ||
    canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
  if (!gl) return null;
  // four vec4s per shock, two per flying word, and room for the rest; older phones allow far
  // fewer than desktops
  const limit = Number(gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS)) || 64;
  const maxs = maxsIn ?? Math.max(4, Math.min(MAXS_CAP, Math.floor((limit - 30 - 2 * MAXZ) / 4)));
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
  };
  const vs = sh(gl.VERTEX_SHADER, VERT);
  const fs = sh(gl.FRAGMENT_SHADER, frag(mode, maxs));
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  gl.disable(gl.BLEND);
  const u = (n: string) => gl.getUniformLocation(prog, n);
  const texture = (unit: number, wrap: number) => {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    return t;
  };
  texture(0, gl.REPEAT);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, NOISE_W, NOISE_H, 0, gl.RGBA, gl.UNSIGNED_BYTE, noise);
  gl.uniform1i(u("uNoise"), 0);
  const tex = texture(1, gl.CLAMP_TO_EDGE);
  let tex2: WebGLTexture | null = null;
  let tex3: WebGLTexture | null = null;
  if (mode === 0) {
    gl.uniform1i(u("uVideo"), 1);
    gl.uniform3f(u("uBg"), BG[0], BG[1], BG[2]);
  } else {
    gl.uniform1i(u("uType"), 1);
    tex2 = texture(2, gl.CLAMP_TO_EDGE);
    gl.uniform1i(u("uEcho"), 2);
    tex3 = texture(3, gl.CLAMP_TO_EDGE);
    gl.uniform1i(u("uTypeCut"), 3);
  }
  return { canvas, gl, u, tex, tex2, tex3, maxs };
}

export function supportsAttached(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export type AttachedRun = {
  band: HTMLElement; // the element the shocks are positioned in (the picture band, or a section)
  section: HTMLElement;
  title: HTMLElement; // gets wd-transonic-drawn while the engine paints its copy
  words: HTMLElement[]; // in landing order
  lands: () => number[]; // clock ms each word comes out
  air?: { ceil?: number; floor?: number }; // field "title": the title's own air, band px
  video: HTMLVideoElement | null; // what the shocks bend behind the copy; none, and only the copy bends
  scrim: Element | null; // the page's grade: the picture bends under it, the copy is drawn above it
  ground?: ShockGround; // what the type sits on
  // "section": the shocks run the height of the band (the cold open's picture).
  // "title": only the title's own air.
  field?: "section" | "title";
  params: AttachedParams;
  clock: () => number;
  onTick?: (now: number) => void;
};

const smooth = (a: number, b: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

// The preview rig's way in: a development build takes params from window.__wdTransonic, so one
// page can be rendered several ways. Production builds never read it.
function devParams(): Partial<AttachedParams> {
  if (typeof process === "undefined" || process.env.NODE_ENV === "production") return {};
  const w = (globalThis as unknown as { __wdTransonic?: Partial<AttachedParams> }).__wdTransonic;
  return w && typeof w === "object" ? w : {};
}

export function attachShocks(run: AttachedRun): (() => void) | null {
  const { band, section, title, words, lands, video, scrim, clock, onTick } = run;
  const P: AttachedParams = { ...run.params, ...devParams() };
  const FZ = Math.min(1, Math.max(0, P.freeze || 0));
  const ground = run.ground ?? "dark";
  const field = run.field ?? "section";
  const r = rng(424242);
  const noise = new Uint8Array(NOISE_W * NOISE_H * 4);
  for (let i = 0; i < NOISE_W * NOISE_H; i++) {
    const v = Math.round(r() * 255);
    noise.set([v, v, v, 255], i * 4);
  }
  const typ = makePass(1, noise);
  if (!typ) return null;
  const MAXS = typ.maxs;
  const pic = video ? makePass(0, noise, MAXS) : null;

  // Paint order: picture, its bend, the grade, the copy. With no grade the copy goes first in
  // the band, under its (positioned) content, whose own glyphs stop painting while we draw.
  if (pic) video!.after(pic.canvas);
  if (scrim) scrim.after(typ.canvas);
  else band.prepend(typ.canvas);
  const raster = document.createElement("canvas");
  const rasterEcho = document.createElement("canvas");
  const rasterCut = P.cut > 0 ? document.createElement("canvas") : null;

  let dpr = 1;
  let bandW = 0;
  let bandH = 0;
  let top = 0; // the shocks' air, band px
  let bottom = 0;
  let canTop = 0; // both canvases, band px
  let canH = 0;
  let cap = 0;
  let pad = 0; // room around the type for its shadow and its echo
  let glyphs: Glyph[] = [];
  let frames: Airframe[] = [];
  let echo: Echo | null = null;
  let box = [0, 0, 1, 1]; // the copy's textures, band px: x, y, w, h

  // the whole copy, drawn glyph by glyph where the page put it, once per layout
  const rasterize = () => {
    const w = Math.max(1, Math.round(box[2] * dpr));
    const h = Math.max(1, Math.round(box[3] * dpr));
    // cut: every letter cut once through its middle at the lock lean ("/"), the face up and to
    // the left in the light, the face down and to the right turned from it
    const lean = P.lock;
    const nl = Math.hypot(1, lean);
    const cutFill = (ctx: CanvasRenderingContext2D, g: Glyph) => {
      const [r0, g0, b0, a0] = parseColor(g.color);
      const lum = 0.299 * r0 + 0.587 * g0 + 0.114 * b0;
      const k = P.cutK;
      const rgba = (r1: number, g1: number, b1: number) => `rgba(${Math.round(255 * Math.min(1, r1))},${Math.round(255 * Math.min(1, g1))},${Math.round(255 * Math.min(1, b1))},${a0})`;
      const hi = lum > 0.4 ? rgba(r0, g0, b0) : rgba(r0 + (1 - r0) * 0.28, g0 + (1 - g0) * 0.28, b0 + (1 - b0) * 0.28);
      const lo = lum > 0.4 ? rgba(r0 * (1 - 1.04 * k), g0 * (1 - k), b0 * (1 - 0.95 * k)) : rgba(r0, g0, b0);
      const cx = (g.l + g.inkR) / 2;
      const cy = (g.top + g.base) / 2;
      const R = g.base - g.top;
      const nx = 1 / nl;
      const ny = lean / nl;
      const gr = ctx.createLinearGradient(cx - nx * R, cy - ny * R, cx + nx * R, cy + ny * R);
      gr.addColorStop(0, hi);
      gr.addColorStop(0.5, hi);
      gr.addColorStop(0.5, lo);
      gr.addColorStop(1, lo);
      return gr;
    };
    const paint = (cv: HTMLCanvasElement, echoOnly: boolean, cut = false) => {
      cv.width = w;
      cv.height = h;
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, -box[0] * dpr, -box[1] * dpr);
      ctx.clearRect(box[0], box[1], box[2], box[3]);
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";
      for (const g of glyphs) {
        if (echoOnly && !g.echo) continue;
        ctx.font = g.font;
        ctx.fillStyle = echoOnly ? "#fff" : cut && isLetter(g.ch) ? cutFill(ctx, g) : g.color;
        const s = echoOnly ? null : parseShadow(g.shadow);
        if (s) {
          ctx.shadowColor = s.color;
          ctx.shadowOffsetX = s.x * dpr;
          ctx.shadowOffsetY = s.y * dpr;
          ctx.shadowBlur = s.blur * dpr;
        } else {
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        }
        ctx.fillText(g.ch, g.x, g.base);
      }
    };
    paint(raster, false);
    paint(rasterEcho, true);
    if (rasterCut) paint(rasterCut, false, true);
    const { gl } = typ;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, typ.tex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, raster);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, typ.tex2);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, gl.ALPHA, gl.UNSIGNED_BYTE, rasterEcho);
    if (rasterCut) {
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, typ.tex3);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rasterCut);
    }
  };

  const layout = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const b = band.getBoundingClientRect();
    const s = section.getBoundingClientRect();
    bandW = b.width;
    bandH = b.height;
    const m = measureCopy(words, band);
    glyphs = m.glyphs;
    cap = m.cap;
    echo = m.echo;
    if (!glyphs.length) return;
    const gTop = Math.min(...glyphs.map((g) => g.top));
    const gBot = Math.max(...glyphs.map((g) => g.base));
    const secTop = s.top - b.top;
    const secBot = secTop + s.height;
    if (field === "title") {
      top = Math.max(secTop + 4, run.air?.ceil ?? gTop - 1.6 * cap);
      bottom = Math.min(secBot - 4, run.air?.floor ?? gBot + 1.0 * cap);
    } else {
      top = video ? 4 : Math.max(secTop + 4, gTop - 2.4 * cap);
      bottom = video ? bandH - 2 : Math.min(secBot - 4, gBot + 1.2 * cap);
    }
    canTop = Math.floor(Math.min(top, gTop - 0.4 * cap)) - 4;
    canH = Math.ceil(Math.max(bottom, gBot + 0.4 * cap)) + 4 - canTop;
    if (video) {
      canTop = Math.max(0, canTop);
      canH = Math.min(bandH, canTop + canH) - canTop;
    }
    pad = Math.max(0.4 * cap, glyphs.reduce((mx, g) => Math.max(mx, shadowReach(g.shadow)), 0));
    frames = layoutAirframes(m.lines, cap, P, top, bottom, pad, field === "title");
    // the textures on the device pixel grid, so the drawn type lands texel for pixel
    const gl0 = Math.min(...glyphs.map((g) => g.l));
    const gr0 = Math.max(...glyphs.map((g) => g.r));
    const bx0 = Math.floor((gl0 - pad) * dpr) / dpr;
    const by0 = Math.floor((gTop - pad) * dpr) / dpr;
    const bx1 = Math.ceil((gr0 + pad) * dpr) / dpr;
    const by1 = Math.ceil((gBot + pad + 0.3 * cap) * dpr) / dpr;
    box = [bx0, by0, bx1 - bx0, by1 - by0];
    for (const p of [pic, typ]) {
      if (!p) continue;
      Object.assign(p.canvas.style, { top: `${canTop}px`, width: `${bandW}px`, height: `${canH}px` });
      p.canvas.width = Math.max(1, Math.round(bandW * dpr));
      p.canvas.height = Math.max(1, Math.round(canH * dpr));
    }
    rasterize();
  };
  layout();

  const A = new Float32Array(MAXS * 4);
  const B = new Float32Array(MAXS * 4);
  const C = new Float32Array(MAXS * 4);
  const Ct = new Float32Array(MAXS * 4); // C for the type: its last slot carries the creases
  const D = new Float32Array(MAXS * 4);
  const Z = new Float32Array(MAXZ * 4);
  const Zo = new Float32Array(MAXZ * 4);
  const t0 = clock();
  let lastVideoTime = -1;
  // Until the video can be drawn (still loading, or a reel only asked to play as it comes near),
  // what is on screen is its poster: bend that instead, so a shock never waits on the network.
  let poster: HTMLImageElement | null = null;
  if (video?.poster) {
    poster = new Image();
    poster.decoding = "async";
    poster.src = video.poster;
  }
  let lastSrc = "";

  // reflect: the film's light, its average colour sampled a few times a second and eased, so a
  // cut in the film turns the light on the letters within a few frames
  const envCv = P.cut > 0 && P.reflect > 0 && video ? document.createElement("canvas") : null;
  if (envCv) {
    envCv.width = 8;
    envCv.height = 4;
  }
  const envCtx = envCv ? envCv.getContext("2d", { willReadFrequently: true }) : null;
  const env = [0.5, 0.5, 0.5];
  const envTo = [0.5, 0.5, 0.5];
  let envAt = -1e9;
  let envLast = -1e9;
  const sampleEnv = (now: number) => {
    if (!envCtx || !video) return;
    if (now - envAt >= 66) {
      envAt = now;
      const live = video.readyState >= 2 && video.videoWidth > 0;
      const src = live ? video : poster && poster.complete && poster.naturalWidth > 0 ? poster : null;
      if (src) {
        try {
          envCtx.drawImage(src, 0, 0, 8, 4);
          const d = envCtx.getImageData(0, 0, 8, 4).data;
          let r = 0;
          let g = 0;
          let b = 0;
          for (let i = 0; i < d.length; i += 4) {
            r += d[i];
            g += d[i + 1];
            b += d[i + 2];
          }
          const k = 255 * (d.length / 4);
          envTo[0] = r / k;
          envTo[1] = g / k;
          envTo[2] = b / k;
        } catch {
          // a picture from another origin can't be read: the letters keep their own light
        }
      }
    }
    const e = envLast < -1e8 ? 1 : 1 - Math.exp(-Math.max(0, now - envLast) / 140);
    envLast = now;
    for (let i = 0; i < 3; i++) env[i] += (envTo[i] - env[i]) * e;
  };

  let lifeT = 0;
  const draw = (pass: Pass, n: number, sc: number[], extra: (gl: WebGLRenderingContext) => void) => {
    const { gl, u, canvas } = pass;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.disable(gl.SCISSOR_TEST);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const x0 = Math.max(0, Math.floor(sc[0] * dpr));
    const x1 = Math.min(canvas.width, Math.ceil(sc[2] * dpr));
    const yT = Math.max(0, Math.floor((sc[1] - canTop) * dpr));
    const yB = Math.min(canvas.height, Math.ceil((sc[3] - canTop) * dpr));
    if (x1 <= x0 || yB <= yT) return;
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(x0, canvas.height - yB, x1 - x0, yB - yT);
    gl.uniform2f(u("uSize"), bandW, canH);
    gl.uniform2f(u("uOrigin"), 0, canTop);
    gl.uniform1f(u("uN"), n);
    gl.uniform4fv(u("uA"), A);
    gl.uniform4fv(u("uB"), B);
    gl.uniform4fv(u("uC"), C);
    gl.uniform4fv(u("uD"), D);
    gl.uniform1f(u("uHalf"), 0.5 / dpr);
    gl.uniform1f(u("uT"), lifeT);
    gl.uniform1f(u("uGloss"), P.gloss);
    gl.uniform1f(u("uGlint"), P.glint);
    extra(gl);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  let raf = 0;
  let visible = true;
  let alive = true;
  let shown = false; // the page's own glyphs handed over to the engine
  let lastNow = t0;
  let lastDraw = -1e9;
  let nextGust = t0 + 1400;

  const release = () => {
    if (shown) title.classList.remove("wd-transonic-drawn");
    shown = false;
  };

  const frame = () => {
    raf = 0;
    if (!alive) return;
    const now = clock();
    const dt = Math.min(0.1, Math.max(0, (now - lastNow) / 1000));
    lastNow = now;
    onTick?.(now);
    const m = sampleMach(now);
    lifeT += dt * P.life * (1 + 0.6 * m);
    if (!glyphs.length || !(cap > 0)) {
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
      return;
    }
    const L = lands();
    const T = Math.max(1, P.flyMs);
    const D0 = P.fly * cap;
    const lens = Math.max(2, P.lens * cap);
    // now and then one resting shock surges and divides
    // (not once the words are cut: then the glint and the film's light are all that moves)
    if (P.gusts > 0 && !(FZ > 0 && P.cut > 0) && now >= nextGust) {
      const resting = frames.filter((af) => now > (L[af.word] ?? Infinity) + T + P.settleMs * 2).flatMap((af) => af.seams);
      if (resting.length) resting[Math.floor(Math.random() * resting.length)].gustAt = now;
      nextGust = now + (1000 / P.gusts) * (0.55 + 0.9 * Math.random());
    }
    let n = 0;
    let nz = 0;
    let active = m > 0.02;
    const sx = [Infinity, -Infinity];
    const put = (x: number, y: number, up: number, down: number, kUp: number, kDown: number, jump: number, ln: number, row: number, noseR: number, jog: number, streak: number, vt: number, rod: number, half: number, air: number, crease = 0) => {
      if (n >= MAXS) return;
      A.set([x, y, up, down], n * 4);
      B.set([kUp, kDown, jump, ln], n * 4);
      C.set([row, noseR, jog, streak], n * 4);
      Ct.set([row, noseR, jog, crease], n * 4);
      D.set([vt, rod, half, air], n * 4);
      n++;
      const reach = Math.max(up, down);
      const trail = Math.max(Math.abs(kUp) * up, Math.abs(kDown) * down) + noseR;
      sx[0] = Math.min(sx[0], x - trail - 16 * ln - jog - air);
      sx[1] = Math.max(sx[1], x + 16 * ln + jog + air + 0.2 * reach);
    };
    // what to keep when the GPU allows fewer shocks: the bow and the boom, then each word's
    // nearest shocks to its nose, then the rest, then the strands
    const queue: { pri: number; go: () => void }[] = [];
    for (const af of frames) {
      const tl = L[af.word] ?? Infinity;
      if (!(now >= tl) || nz >= MAXZ) continue;
      const tau = (now - tl) / T;
      const tc = Math.min(1, tau);
      const td = tl + TAU_C * T; // it drops below Mach 1
      const off = -D0 * Math.pow(1 - tc, 3) + (now >= tl + T && now < tl + T + 34 ? 0.035 * cap : 0);
      const M = tau < TAU_C ? 1 + (P.mach - 1) * Math.pow(1 - tau / TAU_C, 1.3) : Math.max(0, 1 - (tau - TAU_C) * 0.9);
      const bump = Math.exp(-Math.pow((M - 1) / 0.09, 2)); // the transonic moment
      const settle = now > td ? 1 - Math.exp(-(now - td) / Math.max(1, P.settleMs)) : 0;
      const fresh = Math.exp(-(now - tl) / 100);
      if (settle < 0.995) active = true;
      // where it draws: out of its own left edge while it flies; at rest, its shadow too
      Z.set([af.l - (tc >= 1 ? pad : 0), af.zt, af.zr, af.zb], nz * 4);
      // how far it has locked (its letters cut, when cut is on) rides on its "shows"
      Zo.set([off, 1 + (P.cut > 0 ? 0.999 * smooth(tl + T - 30, tl + T + 90, now) : 0), af.l - pad, af.zr], nz * 4);
      const zi = nz;
      nz++;
      // the bow shock, standing off the nose while the word is supersonic
      if (af.last && now <= td + 20) {
        const mu = Math.asin(1 / Math.max(M, 1.0005));
        const k = -1 / Math.tan(mu);
        const delta = cap * (0.12 + 0.6 * Math.exp(-5 * (M - 1)));
        const Rc = cap * (0.6 + 1.2 * Math.exp(-3 * Math.max(0, M - 1)));
        const bx = af.nose + off + delta;
        const bj = P.bow * cap * (1 + 0.25 * bump);
        const bz = cap * 0.05 * bump;
        const bs = 24 + 70 * fresh;
        queue.push({ pri: 0, go: () => put(bx, af.mid, af.upFull, af.downFull, k, k, bj, 0.06 * cap, af.row, Rc, bz, bs, 0, 1, 0, 0) });
      }
      // the boom: as the word drops below Mach 1 the bow shock tears off and runs on ahead
      if (af.last && now > td) {
        const db = (now - td) / 1000;
        const s = P.boom * Math.exp(-db / (P.boomMs / 1000));
        if (s > 0.012) {
          active = true;
          const fade = Math.exp(-db / 0.9);
          const k = -Math.tan((10 * Math.PI) / 180);
          const bx = af.nose + 0.72 * cap + P.boomSpeed * db;
          queue.push({
            pri: 0,
            go: () => put(bx, af.mid, af.upFull * (0.6 + 0.4 * fade), af.downFull * (0.6 + 0.4 * fade), k, k, s * cap, 0.075 * cap, (af.row + 9) % (NOISE_H - 4), cap * (2.2 + 4 * db), cap * 0.015, 8, 0, Math.min(1.4, s / P.hit), 0, 0),
          });
        }
      }
      // the shocks through its letters: raked back at the Mach angle while it flies, standing up
      // and splitting as it slows through Mach 1, then settling quiet and nearly upright
      af.seams.forEach((sm, si) => {
        const Mi = 1 + (M - 1) * (0.5 + 0.5 * (1 - sm.near));
        const flight = Mi > 1.0005 ? 1 / Math.tan(Math.asin(1 / Mi)) : 0;
        const tt = lifeT + sm.phase;
        const gt = now - sm.gustAt;
        const gust = gt >= 0 ? (1 - Math.exp(-gt / 45)) * Math.exp(-gt / 320) : 0;
        if (gust > 0.03) active = true;
        // freeze: as the word stops dead its shocks lock into it as creases, at the lock lean,
        // and their trails out in the air die; they come back out only when the page moves hard
        const lockT = tl + T;
        const fz = FZ * smooth(lockT - 30, lockT + 90, now);
        const gone = FZ * smooth(lockT - 40, lockT + 260, now);
        const still = FZ * (1 - smooth(0.05, 0.45, m));
        const sway = P.buffet * (1 + 2 * m) * (swing(tt, sm.life.sway) + 0.3 * swing(tt, sm.life.shiver)) * (1 - fz);
        let lean = flight * (1 - settle) + (sm.lean + sway) * settle + 0.5 * m;
        if (FZ > 0) lean += (Math.max(flight, P.lock) - lean) * FZ;
        const wav = 1 + P.pulse * swing(tt, sm.life.pulse);
        const amp = (P.hit * sm.amp * (1 + 0.35 * bump) * (1 - settle) * (1 - gone) + (P.rest * wav + P.gustAmp * gust) * settle * (1 - still)) * (1 + P.speed * m);
        // the crease, packed for the type pass: its word, the light on it, how far it has locked
        const glow = Math.max(now >= lockT ? Math.exp(-(now - lockT) / 260) : 0, gust);
        const crease = fz > 0.002 ? Math.round(15 * Math.min(1, glow)) * 8 + zi + 1 + 0.25 + 0.5 * Math.min(1, fz) : 0;
        const jump = sm.sign * cap * amp;
        const rod = sm.sign * Math.min(1.4, amp / P.hit);
        const up = af.upFull + (af.upRest - af.upFull) * settle;
        const down = af.downFull + (af.downRest - af.downFull) * settle;
        const x = sm.x + off + bump * cap * 0.05 * Math.sin(lifeT * TAU * 17 + sm.phase);
        const half = 0.5 * (af.base - af.top) + 0.06 * cap;
        const jz = cap * 0.03 * bump;
        const ss = 10 + 30 * fresh;
        const air = P.fracture * cap * settle;
        queue.push({ pri: si < 2 ? 1 : 2, go: () => put(x, af.mid, up, down, -lean, -lean, jump, lens, sm.row, 0, jz, ss, sm.vt * settle, rod, half, air, crease) });
        // it divides: at the transonic moment, and when it surges or the page moves hard
        const div = Math.max(bump, sm.strand ? Math.max(gust, smooth(0.35, 0.8, m)) : 0);
        if (div > 0.08) {
          const lean2 = lean * 1.15 + 0.06 + 0.1 * bump;
          const x2 = x + 0.07 * cap * div;
          queue.push({
            pri: 3,
            go: () => put(x2, af.mid, up * (0.5 + 0.4 * div), down * (0.5 + 0.4 * div), -lean2, -lean2, -0.6 * jump * div, 0.8 * lens, (sm.row + 23) % (NOISE_H - 4), 0, cap * 0.05 * bump, 10, -sm.vt * settle, -0.6 * rod * div, half, air),
          });
        }
      });
    }
    queue.sort((a, b) => a.pri - b.pri);
    for (const q of queue) q.go();
    sampleEnv(now);
    // freeze: once every word has locked, a pass of light crosses the facets now and then, at the
    // creases' own lean
    const sweep = [0, 0, 1, 0];
    if ((FZ > 0 || P.cut > 0) && P.sweep > 0) {
      const done = Math.max(...frames.map((af) => L[af.word] ?? Infinity)) + T + 700;
      if (Number.isFinite(done) && now > done) {
        const dur = 1300;
        const ph = (now - done) % (P.sweep * 1000);
        if (ph < dur) {
          active = true;
          // cut: a glint along the cuts ("/"); otherwise a band along the creases ("\")
          const yMid = box[1] + box[3] / 2;
          const xAt = box[0] - 1.5 * cap + (ph / dur) * (box[2] + 3 * cap);
          const sl = P.cut > 0 ? -P.lock : P.lock;
          sweep[0] = xAt - sl * yMid;
          sweep[1] = sl;
          sweep[2] = 0.5 * cap;
          sweep[3] = Math.sin((Math.PI * ph) / dur);
        }
      }
    }
    if (!nz) {
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
      return;
    }
    // the copy is always drawn, whether or not a shock crosses it right now
    const sc = [Math.min(sx[0], box[0]), Math.min(top, box[1]), Math.max(sx[1], box[0] + box[2]), Math.max(bottom, box[1] + box[3])];
    // at rest the air moves slowly: half the frames are enough
    if (!active && now - lastDraw < 30) {
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
      return;
    }
    lastDraw = now;
    if (pic && video) {
      const live = video.readyState >= 2 && video.videoWidth > 0;
      const still = !live && !!poster && poster.complete && poster.naturalWidth > 0;
      const pw = live ? video.videoWidth : still ? poster!.naturalWidth : 0;
      const ph = live ? video.videoHeight : still ? poster!.naturalHeight : 0;
      draw(pic, pw && ph ? n : 0, [sx[0], top, sx[1], bottom], (gl) => {
        const { u } = pic;
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, pic.tex);
        if (live ? video.currentTime !== lastVideoTime || lastSrc !== "video" : lastSrc !== "poster") {
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, live ? video : poster!);
          lastVideoTime = live ? video.currentTime : -1;
          lastSrc = live ? "video" : "poster";
        }
        const s = Math.max(bandW / pw, bandH / ph);
        // object-fit: cover at the picture's own object-position (centre unless the page says
        // otherwise, as the cold open does on phones), so the bend stays registered with it
        const op = (getComputedStyle(video).objectPosition || "").split(" ");
        const pct = (v: string | undefined) => {
          const n = v && v.endsWith("%") ? parseFloat(v) / 100 : NaN;
          return Number.isFinite(n) ? n : 0.5;
        };
        const ax = pct(op[0]);
        const ay = pct(op[1]);
        gl.uniform4f(u("uCover"), (bandW - pw * s) * ax, (bandH - ph * s) * ay, pw * s, ph * s);
        gl.uniform1f(u("uVidA"), parseFloat(getComputedStyle(video).opacity) || 0);
        gl.uniform1f(u("uSmearM"), 10 * m);
        gl.uniform1f(u("uFlow"), 0.5);
        gl.uniform1f(u("uFlowV"), 160);
        gl.uniform1f(u("uMag"), P.magnify);
      });
    }
    draw(typ, n, sc, (gl) => {
      const { u } = typ;
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, typ.tex);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, typ.tex2);
      gl.uniform4fv(u("uC"), Ct);
      gl.uniform1f(u("uFrz"), FZ);
      gl.uniform4f(u("uSweep"), sweep[0], sweep[1], sweep[2], sweep[3]);
      gl.uniform1f(u("uEtch"), P.etch);
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, typ.tex3);
      gl.uniform1f(u("uCut"), P.cut);
      gl.uniform4f(u("uEnv"), env[0], env[1], env[2], envCtx ? P.reflect : 0);
      gl.uniform2f(u("uGlintW"), P.cut > 0 ? 0.6 + 0.012 * cap : 0, P.cut > 0 ? 0.12 * cap : 0);
      gl.uniform4f(u("uTypeBox"), box[0], box[1], box[2], box[3]);
      gl.uniform1f(u("uNZ"), nz);
      gl.uniform4fv(u("uZ"), Z);
      gl.uniform4fv(u("uZo"), Zo);
      gl.uniform1f(u("uFlow"), 0.15);
      gl.uniform1f(u("uFlowV"), 160);
      gl.uniform1f(u("uMag"), P.magnifyType);
      gl.uniform1f(u("uBowK"), 0.35);
      let ob = 0;
      let oc = 0;
      if (echo) {
        const off = (pseudo: string) => {
          const tr = getComputedStyle(echo!.el, pseudo).transform;
          const mm = tr && tr !== "none" ? tr.match(/matrix\(([^)]+)\)/) : null;
          return mm ? parseFloat(mm[1].split(",")[4]) || 0 : 0;
        };
        ob = off("::before");
        oc = off("::after");
        gl.uniform2f(u("uEchoLW"), echo.l, echo.w);
        gl.uniform4f(u("uBlaze"), echo.blaze[0], echo.blaze[1], echo.blaze[2], echo.blaze[3]);
        gl.uniform4f(u("uCool"), echo.cool[0], echo.cool[1], echo.cool[2], echo.cool[3]);
      } else {
        gl.uniform4f(u("uBlaze"), 0, 0, 0, 0);
        gl.uniform4f(u("uCool"), 0, 0, 0, 0);
      }
      gl.uniform2f(u("uEchoOff"), ob, oc);
      gl.uniform3f(u("uLight"), BONE[0], BONE[1], BONE[2]);
      // over a picture the bent picture shows the shock; on a light ground only the type does
      gl.uniform1f(u("uLine"), pic || ground === "light" ? 0 : P.line);
    });
    // hand the page's own glyphs over once the engine has drawn them
    if (!shown) {
      title.classList.add("wd-transonic-drawn");
      shown = true;
    }
    if (visible && !document.hidden) raf = requestAnimationFrame(frame);
  };

  const wake = () => {
    if (!raf && alive && visible && !document.hidden) raf = requestAnimationFrame(frame);
  };
  const io = new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    wake();
  });
  io.observe(band);
  const onVis = () => wake();
  document.addEventListener("visibilitychange", onVis);
  const ro = new ResizeObserver(() => layout());
  ro.observe(band);
  // if the GPU drops the canvas, the page's own type comes straight back
  const lost = (e: Event) => {
    e.preventDefault();
    alive = false;
    release();
  };
  typ.canvas.addEventListener("webglcontextlost", lost);
  wake();

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    typ.canvas.removeEventListener("webglcontextlost", lost);
    release();
    for (const p of [pic, typ]) {
      if (!p) continue;
      p.canvas.remove();
      p.gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  };
}
