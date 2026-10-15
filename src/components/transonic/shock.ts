// TRANSONIC · the shock pass.
//
// At transonic speed the shocks stand almost normal to the flow: near-vertical sheets
// that wrinkle, fork and cross. You see them only because they bend light, so the
// scenery behind them looks creased, like crinkled film. That is what this draws:
//   - a group of shock sheets crosses the field, each one a lens a few pixels wide
//     that pushes or pulls what is behind it (the footage and the type);
//   - each sheet is lit like a knife-edge schlieren image: a hard bright core with
//     darker flanks, or the reverse, depending on which way it bends light;
//   - the sheets are straighter near the airframe (the title's axis) and wilder far
//     from it, and they flutter, the way the photographs show them;
//   - the type appears creased inside the group and is solid once the group has passed.
// Nothing is applied to the type as decoration: the type sits where the airframe would.

export type ShockGround = "dark" | "light";

export type ShockParams = {
  lines: number; // shock sheets in the group, up to 16
  groupPx: number; // spread of the group, lead sheet to last
  speed: number; // px per ms
  dispPx: number; // how hard each sheet bends the footage behind it
  dispTextPx: number; // how hard it bends the type (kept below fold-over)
  lensPx: number; // half-width of each sheet's lens
  wobblePx: number; // flutter amplitude far from the axis
  lean: number; // backward sweep of the sheets (dx per dy)
  feather: number; // top and bottom feather for band fields, px (0 = none)
  fillPx: number; // distance behind the lead sheet over which the type comes in
  seed: number;
};

export const DEFAULT_SHOCK: ShockParams = {
  lines: 16,
  groupPx: 460,
  speed: 1.15,
  dispPx: 21,
  dispTextPx: 6,
  lensPx: 7,
  wobblePx: 16,
  lean: 0.2,
  feather: 0,
  fillPx: 240,
  seed: 7,
};

export type ScenePainter = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

export type ShockRun = {
  host: HTMLElement;
  field: { x: number; y: number; w: number; h: number }; // overlay rect, host CSS px
  text: HTMLCanvasElement; // the type, painted in overlay coordinates at dpr
  dpr: number;
  axisY: number; // the title's centre line, overlay CSS px
  textBox: { l: number; t: number; r: number; b: number };
  ground: ShockGround;
  params: ShockParams;
  scene?: ScenePainter; // paints what is behind the type (the footage), so it can be refracted
  clock: () => number;
  onLocked: () => void;
  onDone: () => void;
};

const MAX_LINES = 16;

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uText;
uniform sampler2D uScene;
uniform float uSceneOn;
uniform vec2 uSize;
uniform float uX;
uniform float uY0;
uniform float uT;
uniform vec4 uL[${MAX_LINES}];
uniform float uN;
uniform float uDisp;
uniform float uDispText;
uniform float uLens;
uniform float uWob;
uniform float uLean;
uniform float uGroup;
uniform float uGround;
uniform float uFeather;
uniform float uFill;
uniform float uTextOn;

// Where sheet L crosses height y. x: distance behind the lead, y: sweep, z: strength, w: phase.
float sheetX(vec4 L, float y) {
  float dy = y - uY0;
  float far = clamp(abs(dy) / 320.0, 0.0, 1.0);
  float amp = uWob * (0.25 + 0.75 * far);
  // long, slow bends with the odd kink, never a regular squiggle
  float wob = amp * (0.62 * sin(dy * 0.0085 + L.w + uT * 1.9)
                   + 0.30 * sin(dy * 0.0215 - L.w * 1.7 - uT * 3.1)
                   + 0.10 * sin(dy * 0.049 + L.w * 2.9 + uT * 4.7));
  return uX - L.x - L.y * abs(dy) + wob;
}

vec4 tex(sampler2D s, vec2 q) {
  vec2 uv = vec2(q.x / uSize.x, 1.0 - q.y / uSize.y);
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec4(0.0);
  return texture2D(s, uv);
}

vec4 over(vec4 top, vec4 under) { return top + under * (1.0 - top.a); }

void main() {
  vec2 p = vec2(vUv.x * uSize.x, (1.0 - vUv.y) * uSize.y);
  float dy = abs(p.y - uY0);
  float reach = uLean * 1.6 * dy + uWob + 3.0 * uLens + 30.0;

  // Well ahead of the group: undisturbed air, and the type has not appeared yet.
  if (p.x > uX + reach) { gl_FragColor = vec4(0.0); return; }

  // Well behind it: undisturbed again, and the type is solid.
  if (p.x < uX - uGroup - reach) {
    gl_FragColor = uTextOn > 0.5 ? tex(uText, p) : vec4(0.0);
    return;
  }

  float disp = 0.0;
  float dispT = 0.0;
  float relief = 0.0;
  float core = 0.0;
  float near = 1e4;
  for (int i = 0; i < ${MAX_LINES}; i++) {
    if (float(i) >= uN) break;
    vec4 L = uL[i];
    float u = p.x - sheetX(L, p.y);
    float lens = uLens * (0.45 + 1.1 * fract(L.w * 0.613));
    float k = u / lens;
    float g = exp(-0.5 * k * k);
    disp += L.z * k * g;
    // type is sliced at each crease: a crisp step in offset inside a short window, so a
    // letter crossing a sheet looks cut and shifted, never melted
    float st = clamp(u / 1.3, -8.0, 8.0);
    float e2 = exp(2.0 * st);
    float wq = u / 18.0;
    dispT += L.z * ((e2 - 1.0) / (e2 + 1.0)) * exp(-wq * wq * wq * wq);
    // a knife edge sees the deflection itself: light on one side of the crease, dark on the other
    relief += L.z * k * g * 1.6;
    core += abs(L.z) * exp(-0.5 * (u / 0.7) * (u / 0.7));
    near = min(near, abs(u));
  }

  vec2 q = p - vec2(disp * uDisp, 0.0);
  vec2 qt = p - vec2(dispT * uDispText, 0.0);
  vec3 lit = uGround < 0.5 ? vec3(0.941, 0.910, 0.847) : vec3(0.071, 0.071, 0.102);
  vec3 shade = uGround < 0.5 ? vec3(0.0) : vec3(1.0);

  vec4 acc = vec4(0.0);
  float typeA = 0.0;

  // The footage, creased where the sheets cross it. Only the disturbed air is redrawn;
  // everywhere else the page's own picture shows through untouched.
  if (uSceneOn > 0.5) {
    float m = 1.0 - smoothstep(18.0, 46.0, near);
    acc = tex(uScene, q) * m;
  }

  // The type: absent ahead of the lead sheet, creased inside the group, solid behind it.
  if (uTextOn > 0.5) {
    float lead = p.x - sheetX(uL[0], p.y);
    float come = clamp(-lead / uFill, 0.0, 1.0);
    vec4 t = tex(uText, qt) * smoothstep(0.0, 1.0, come);
    acc = over(t, acc);
    typeA = t.a;
  }

  // Knife-edge light on each sheet: one side of the crease catches light, the other falls
  // away. Over the picture it reads as a fold in the air; over black only the filament shows.
  float ground = 0.55;
  if (uSceneOn > 0.5) {
    vec3 sc = tex(uScene, p).rgb;
    ground = smoothstep(0.04, 0.22, dot(sc, vec3(0.299, 0.587, 0.114)));
  }
  float r = clamp(relief, -1.0, 1.0) * mix(mix(0.18, 1.0, ground), 1.25, typeA);
  acc = over(vec4(shade, 1.0) * clamp(-r, 0.0, 1.0) * 0.4, acc);
  acc = over(vec4(lit, 1.0) * clamp(clamp(r, 0.0, 1.0) * 0.36 + core * 0.24, 0.0, 0.75), acc);

  if (uFeather > 0.0) {
    acc *= smoothstep(0.0, uFeather, p.y) * smoothstep(0.0, uFeather, uSize.y - p.y);
  }
  gl_FragColor = acc;
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

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

// The group: uneven spacing, a couple of close pairs that fork, mostly swept back with a
// few swept forward so they cross, strength falling toward the rear, lens direction mixed.
function makeSheets(P: ShockParams) {
  const n = Math.max(1, Math.min(MAX_LINES, Math.round(P.lines)));
  const r = rng(P.seed);
  // Three clusters, the way a real airframe throws them: nose, wing, tail.
  const clusters = [
    { at: 0, share: 0.36, sweep: 1.0 },
    { at: 0.5, share: 0.36, sweep: 0.55 },
    { at: 0.92, share: 0.28, sweep: 0.75 },
  ];
  const out = new Float32Array(MAX_LINES * 4);
  let i = 0;
  clusters.forEach((c, ci) => {
    const count = ci === clusters.length - 1 ? n - i : Math.max(1, Math.round(n * c.share));
    let x = c.at * P.groupPx;
    for (let j = 0; j < count && i < n; j++, i++) {
      if (j > 0) x += r() < 0.35 ? 3 + r() * 5 : 8 + r() * 16;
      let sweep = P.lean * c.sweep * (0.3 + 0.7 * r());
      if (j > 0 && r() < 0.26) sweep = -P.lean * (0.3 + 0.45 * r());
      const strength = (0.55 + 0.45 * r()) * (j === 0 ? 1 : 0.85) * (r() < 0.66 ? 1 : -1);
      out.set([x, sweep, strength, r() * Math.PI * 2], i * 4);
    }
  });
  return { n, data: out };
}

export function supportsShock(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

// Paints every visible character inside `root` onto a canvas in overlay coordinates,
// glyph by glyph where the browser laid it out, so the hand-off back to the DOM at lock
// is pixel-registered.
export function paintType(root: Element, originClient: { x: number; y: number }, size: { w: number; h: number }, dpr: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(size.w * dpr));
  canvas.height = Math.max(1, Math.round(size.h * dpr));
  const ctx = canvas.getContext("2d");
  const box = { l: Infinity, t: Infinity, r: -Infinity, b: -Infinity };
  if (!ctx) return { canvas, box };
  ctx.scale(dpr, dpr);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const el = node.parentElement;
    if (!el) continue;
    const cs = getComputedStyle(el);
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    ctx.fillStyle = cs.color;
    ctx.textBaseline = "alphabetic";
    // carry a text shadow across so the hand-off doesn't pop (shadow values are device px)
    const sh =
      cs.textShadow && cs.textShadow !== "none"
        ? cs.textShadow.match(/(rgba?\([^)]*\)|#[0-9a-f]{3,8})\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px/i)
        : null;
    ctx.shadowColor = sh ? sh[1] : "transparent";
    ctx.shadowOffsetX = sh ? parseFloat(sh[2]) * dpr : 0;
    ctx.shadowOffsetY = sh ? parseFloat(sh[3]) * dpr : 0;
    ctx.shadowBlur = sh ? parseFloat(sh[4]) * dpr : 0;
    const upper = cs.textTransform === "uppercase";
    const data = node.data;
    for (let i = 0; i < data.length; i++) {
      const ch = data[i];
      if (/\s/.test(ch)) continue;
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const rects = range.getClientRects();
      if (!rects.length) continue;
      const rc = rects[0];
      const glyph = upper ? ch.toUpperCase() : ch;
      const m = ctx.measureText(glyph);
      const ascent = m.fontBoundingBoxAscent || parseFloat(cs.fontSize) * 0.9;
      const x = rc.left - originClient.x;
      const y = rc.top - originClient.y;
      ctx.fillText(glyph, x, y + ascent);
      box.l = Math.min(box.l, x);
      box.t = Math.min(box.t, y);
      box.r = Math.max(box.r, rc.right - originClient.x);
      box.b = Math.max(box.b, rc.bottom - originClient.y);
    }
  }
  return { canvas, box };
}

export function runShock(run: ShockRun): (() => void) | null {
  const { host, field, text, dpr, axisY, textBox, ground, params: P, clock, scene } = run;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(field.w * dpr));
  canvas.height = Math.max(1, Math.round(field.h * dpr));
  canvas.setAttribute("aria-hidden", "true");
  canvas.className = "wd-shock-overlay";
  Object.assign(canvas.style, {
    position: "absolute",
    left: `${field.x}px`,
    top: `${field.y}px`,
    width: `${field.w}px`,
    height: `${field.h}px`,
    pointerEvents: "none",
    zIndex: "40",
  } as CSSStyleDeclaration);

  const gl = (canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false }) ||
    canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
  if (!gl) return null;
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
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

  const makeTex = (unit: number, src: TexImageSource) => {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  };
  makeTex(0, text);

  // The scene behind the type (the footage), repainted every frame so it can be refracted.
  let sceneCanvas: HTMLCanvasElement | null = null;
  let sceneCtx: CanvasRenderingContext2D | null = null;
  const sceneDpr = Math.min(dpr, 1.5);
  if (scene) {
    sceneCanvas = document.createElement("canvas");
    sceneCanvas.width = Math.max(1, Math.round(field.w * sceneDpr));
    sceneCanvas.height = Math.max(1, Math.round(field.h * sceneDpr));
    sceneCtx = sceneCanvas.getContext("2d");
  }
  const paintScene = () => {
    if (!sceneCanvas || !sceneCtx || !scene) return;
    sceneCtx.setTransform(sceneDpr, 0, 0, sceneDpr, 0, 0);
    sceneCtx.clearRect(0, 0, field.w, field.h);
    scene(sceneCtx, field.w, field.h);
  };
  if (sceneCanvas) {
    paintScene();
    makeTex(1, sceneCanvas);
  }

  const u = (n: string) => gl.getUniformLocation(prog, n);
  const sheets = makeSheets(P);
  gl.uniform1i(u("uText"), 0);
  gl.uniform1i(u("uScene"), 1);
  gl.uniform1f(u("uSceneOn"), sceneCanvas ? 1 : 0);
  gl.uniform2f(u("uSize"), field.w, field.h);
  gl.uniform1f(u("uY0"), axisY);
  gl.uniform4fv(u("uL"), sheets.data);
  gl.uniform1f(u("uN"), sheets.n);
  gl.uniform1f(u("uDisp"), P.dispPx);
  gl.uniform1f(u("uDispText"), P.dispTextPx);
  gl.uniform1f(u("uLens"), P.lensPx);
  gl.uniform1f(u("uWob"), P.wobblePx);
  gl.uniform1f(u("uLean"), P.lean);
  gl.uniform1f(u("uGroup"), P.groupPx);
  gl.uniform1f(u("uGround"), ground === "light" ? 1 : 0);
  gl.uniform1f(u("uFeather"), P.feather);
  gl.uniform1f(u("uFill"), P.fillPx);
  const uX = u("uX");
  const uT = u("uT");
  const uTextOn = u("uTextOn");
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.disable(gl.BLEND);
  host.appendChild(canvas);

  const sweep = (dy: number) => P.lean * 1.6 * dy + P.wobblePx + 3 * P.lensPx + 30;
  const startX = -40;
  const dyText = Math.max(Math.abs(textBox.t - axisY), Math.abs(textBox.b - axisY));
  const lockX = textBox.r + Math.max(P.groupPx, P.fillPx) + sweep(dyText);
  const dyField = Math.max(axisY, field.h - axisY);
  const endX = field.w + P.groupPx + sweep(dyField);

  let raf = 0;
  let locked = false;
  let finished = false;
  const t0 = clock();

  const cleanup = () => {
    cancelAnimationFrame(raf);
    canvas.remove();
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };

  const frame = () => {
    const t = clock() - t0;
    const x = startX + t * P.speed;
    if (!locked && x >= lockX) {
      locked = true;
      run.onLocked();
    }
    if (sceneCanvas) {
      paintScene();
      gl.activeTexture(gl.TEXTURE1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sceneCanvas);
    }
    gl.uniform1f(uX, x);
    gl.uniform1f(uT, t / 1000);
    gl.uniform1f(uTextOn, locked ? 0 : 1);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (x >= endX) {
      finished = true;
      cleanup();
      run.onDone();
      return;
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return () => {
    if (finished) return;
    cleanup();
    if (!locked) run.onLocked();
  };
}
