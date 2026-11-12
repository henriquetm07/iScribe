/*
 * Cursor picker for the board (top bar button in manager.ts). The same module runs in Storybook's own UI
 * (manager.ts) and in the page (preview.ts), so the cursor follows the pointer everywhere.
 *
 * Each one follows its Figma component (Storybook Support page, 3552:1653):
 *   default       "cursor/default": a dark rounded arrow with a thin white edge
 *   presentation  "cursor/presentation": a 40px periwinkle arrow, plus the "Label" pill that names every
 *                 mouse action (Click, Double-click, Hold, Drag, Drop, Right-click, Scroll)
 *   touch         "cursor/touch" at 44px: a fingertip (two periwinkle 20% circles); no hover effects; on press the
 *                 inner circle grows smoothly to the outer one
 *   90s           "cursor/90s": an 8-bit arrow with a trail of twinkling pixel sparkles (Frames 1–5)
 */
export type CursorMode = 'default' | 'presentation' | 'touch' | '90s';

/** Shared by manager.ts and preview.ts: where the choice is saved, and the message the picker sends */
export const CURSOR_STORAGE_KEY = 'iscribe-cursor';
export const CURSOR_EVENT = 'iscribe/cursor';

export const CURSORS: { value: CursorMode; label: string; hint: string }[] = [
  { value: 'default', label: 'Default', hint: 'iScribe cursor' },
  { value: 'presentation', label: 'Presentation', hint: 'Big, bold and labeled' },
  { value: 'touch', label: 'Touch', hint: 'A 44px fingertip (no hover)' },
  { value: '90s', label: "90's Whimsy", hint: 'Feeling old and sparkly, but mainly old' },
];

export const asCursor = (value: unknown): CursorMode =>
  value === 'presentation' || value === 'touch' || value === '90s' ? value : 'default';

export const readSavedCursor = (): CursorMode => {
  try {
    return asCursor(localStorage.getItem(CURSOR_STORAGE_KEY));
  } catch {
    return 'default';
  }
};

/* ---------- 90s cursor: the Figma pixel art, drawn at 2× ---------- */

/** One letter per pixel (11 × 19), from Figma "cursor/90s"; "." is transparent */
const PIXELS = [
  'A..........',
  'CA.........',
  'DCA........',
  'DECA.......',
  'DEECA......',
  'DEFECA.....',
  'DEFGECA....',
  'DEFGGECA...',
  'DEGGGGECA..',
  'DEEEEEEECA.',
  'DEEECCCAAAA',
  'DEEACDA....',
  'DDA.DGEA...',
  'DA..DGGA...',
  '.....EGEA..',
  '.....DGGA..',
  '......EGDA.',
  '......DDDA.',
  '.......AAA.',
];
const PIXEL_COLORS: Record<string, string> = {
  A: '#1d1c1e',
  C: '#3966ff',
  D: '#6c78ef',
  E: '#8b93f6',
  F: '#d6dbfe',
  G: '#b3bbfb',
};

/** The 90s arrow as a PNG data URL, `scale` screen pixels per art pixel */
export const retroCursorUrl = (doc: Document, scale = 2): string => {
  const canvas = doc.createElement('canvas');
  canvas.width = 11 * scale;
  canvas.height = 19 * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  PIXELS.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const color = PIXEL_COLORS[ch];
      if (!color) return;
      ctx.fillStyle = color;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }),
  );
  return canvas.toDataURL('image/png');
};

/* ---------- Styles ---------- */

/** Figma "cursor/default" (20 × 21 with its shadow); the tip is at 2, 2 */
export const DEFAULT_CURSOR_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">' +
  '<filter id="d" x="0" y="1.5" width="19" height="19" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">' +
  '<feDropShadow dx="0" dy="2" stdDeviation="1" flood-opacity="0.1"/></filter>' +
  '<path filter="url(#d)" d="M2.93555 1.81136C3.08464 1.77617 3.24041 1.78342 3.38574 1.83186L16.1621 6.0887H16.1631C16.3282 6.14541 16.4712 6.25326 16.5713 6.39632C16.6713 6.5393 16.724 6.71014 16.7207 6.8846V6.88557C16.7177 7.06017 16.659 7.22963 16.5537 7.36897C16.4748 7.47332 16.3724 7.55648 16.2559 7.61311L16.1348 7.66096L11.0391 9.19124H11.0381C10.7255 9.28609 10.441 9.45637 10.21 9.68733C10.0077 9.88961 9.85131 10.133 9.75195 10.4002L9.71289 10.5164L8.18262 15.6131C8.13191 15.7799 8.02977 15.927 7.89062 16.0321C7.75133 16.1372 7.5817 16.1951 7.40723 16.1981H7.40332C7.22839 16.2038 7.05573 16.1541 6.91113 16.0555C6.80253 15.9814 6.71365 15.8828 6.65137 15.7684L6.59863 15.6492L2.34277 2.87483C2.29433 2.7295 2.28708 2.57373 2.32227 2.42464C2.35746 2.27551 2.43364 2.13943 2.54199 2.03108C2.65034 1.92273 2.78642 1.84655 2.93555 1.81136Z" fill="#1D1C1E" stroke="white" stroke-width="0.6"/></svg>';

/** Figma "cursor/presentation" (42 × 45 with its shadow); the tip is at 4, 3.3 */
export const PRESENTATION_CURSOR_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="42" height="45" viewBox="0 0 42 45" fill="none" aria-hidden="true">' +
  '<filter id="is-cur-pres-shadow" x="0" y="3.3" width="41.4" height="41.4" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">' +
  '<feDropShadow dx="0" dy="4" stdDeviation="2" flood-opacity="0.25"/></filter><g filter="url(#is-cur-pres-shadow)">' +
  '<path d="M37.3788 15.3125C37.3698 15.8417 37.1931 16.3543 36.8741 16.7766C36.5551 17.1989 36.1103 17.5091 35.6038 17.6625L24.2788 21.0625C23.6887 21.2415 23.1518 21.5633 22.7157 21.9994C22.2796 22.4355 21.9578 22.9723 21.7788 23.5625L18.3788 34.8875C18.2254 35.394 17.9152 35.8388 17.4929 36.1578C17.0706 36.4767 16.558 36.6535 16.0288 36.6625C15.4987 36.6798 14.9769 36.528 14.5387 36.2292C14.1005 35.9303 13.7687 35.4998 13.5913 35L4.12883 6.6C3.98193 6.15951 3.96061 5.68681 4.06726 5.23489C4.17392 4.78296 4.40432 4.36967 4.73266 4.04133C5.061 3.71299 5.47429 3.48259 5.92622 3.37593C6.37814 3.26928 6.85084 3.2906 7.29133 3.4375L35.6913 12.9C36.1917 13.0718 36.6246 13.398 36.9279 13.8315C37.2311 14.265 37.389 14.7836 37.3788 15.3125Z" fill="#3966FF"/>' +
  '<path d="M5.92621 3.37551C6.37809 3.26888 6.85099 3.29015 7.29144 3.43703L35.6909 12.8999C36.1912 13.0718 36.6249 13.398 36.9282 13.8316C37.2312 14.2649 37.3884 14.7833 37.3784 15.312C37.3693 15.8412 37.1934 16.3546 36.8745 16.7769L36.7485 16.9292C36.4427 17.2736 36.0472 17.5284 35.6039 17.6626L24.2787 21.062C23.6886 21.241 23.1513 21.5635 22.7153 21.9995L22.558 22.1675C22.2019 22.5704 21.9354 23.0457 21.7787 23.562L18.3784 34.8872C18.225 35.3937 17.9149 35.8388 17.4926 36.1577C17.0703 36.4766 16.5578 36.6536 16.0287 36.6626C15.4987 36.6799 14.9767 36.5279 14.5385 36.229C14.1004 35.9302 13.7686 35.4993 13.5912 34.9995L4.12836 6.60011C3.98148 6.15966 3.96021 5.68676 4.06684 5.23488C4.16012 4.83958 4.34833 4.47366 4.61371 4.16847L4.73285 4.04152C5.06119 3.71318 5.47428 3.48216 5.92621 3.37551ZM6.97504 4.38625C6.71074 4.29811 6.42686 4.28515 6.1557 4.34914C5.88462 4.41315 5.63684 4.55159 5.43988 4.74855C5.24292 4.94551 5.10448 5.19329 5.04047 5.46437C4.97648 5.73553 4.98944 6.01941 5.07758 6.28371L14.5375 34.6753C14.6448 34.9709 14.8421 35.2255 15.102 35.4028C15.3321 35.5598 15.6007 35.6497 15.8774 35.6626H16.0121C16.3294 35.6571 16.6368 35.5511 16.8901 35.3599C17.1435 35.1685 17.3293 34.9011 17.4213 34.5972L20.8207 23.2749L20.8217 23.272C21.0484 22.5247 21.4561 21.8448 22.0082 21.2925C22.5606 20.7401 23.2412 20.3327 23.9887 20.106L23.9916 20.105L35.3159 16.7046C35.6189 16.6124 35.8856 16.4271 36.0766 16.1743C36.268 15.9209 36.3739 15.6129 36.3793 15.2954V15.2935C36.3854 14.9762 36.2906 14.6649 36.1088 14.4048C35.9269 14.1448 35.6668 13.9493 35.3666 13.8462H35.3657L6.97504 4.38625Z" fill="white"/></g></svg>';

const svgUrl = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

/** Pixel sparkle (Figma Frames 1–5): a 3 × 3 plus, at the same scale as the 90s arrow */
const PLUS = 'polygon(33.34% 0, 66.67% 0, 66.67% 33.34%, 100% 33.34%, 100% 66.67%, 66.67% 66.67%, 66.67% 100%, 33.34% 100%, 33.34% 66.67%, 0 66.67%, 0 33.34%, 33.34% 33.34%)';

const css = (retroUrl: string, retroUrl2x: string) => `
html.is-cur--default, html.is-cur--default * { cursor: ${svgUrl(DEFAULT_CURSOR_SVG)} 2 2, default !important; }
html.is-cur--default :is(input:not([type=range]):not([type=checkbox]):not([type=radio]):not([type=color]), textarea, [contenteditable="true"]) { cursor: text !important; }
html.is-cur--presentation, html.is-cur--presentation *,
html.is-cur--touch, html.is-cur--touch * { cursor: none !important; }
html.is-cur--90s, html.is-cur--90s * {
  cursor: url(${retroUrl}) 0 0, auto !important;
  cursor: image-set(url(${retroUrl}) 1x, url(${retroUrl2x}) 2x) 0 0, auto !important;
}

.is-cur-layer { position: fixed; inset: 0; z-index: 2147483647; overflow: hidden; pointer-events: none; }
.is-cur-layer * { pointer-events: none; box-sizing: border-box; }
.is-cur-hidden { opacity: 0 !important; }

/* Presentation: Figma "cursor/presentation" (40 × 40) and its "Label" 40px right, 32px down */
.is-cur-pres { position: absolute; top: 0; left: 0; width: 40px; height: 40px; will-change: transform; transition: opacity 120ms ease; }
.is-cur-pres svg { display: block; width: 42px; height: 45px; transform-origin: 4px 3.3px; transition: transform 120ms ease; }
.is-cur-pres--down svg { transform: scale(0.9); }
/* Label: Figma's 12px copy and 0 × 4px padding, each 2px bigger (14px copy, 2 × 6px padding) */
.is-cur-pres__label { position: absolute; top: 32px; left: 40px; display: flex; align-items: center; padding: 2px 6px;
  border-radius: 1000px; background: #d6dbfe; color: #000; font: 400 14px/1.2 'Figtree', system-ui, sans-serif; white-space: nowrap;
  opacity: 0; transform: scale(0.8); transform-origin: 0 50%; transition: opacity 180ms ease, transform 180ms ease; }
.is-cur-pres__label--on { opacity: 1; transform: none; transition: opacity 120ms ease, transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1); }

/* Touch: Figma "cursor/touch" at 44px — the circle and its 16px inner circle, both periwinkle at 20%.
   While pressed, the inner circle grows smoothly to fill the outer one */
.is-cur-touch { position: absolute; top: 0; left: 0; width: 44px; height: 44px; margin: -22px 0 0 -22px; border-radius: 50%;
  background: rgba(57, 102, 255, 0.2); will-change: transform; transition: opacity 120ms ease; }
.is-cur-touch__dot { position: absolute; top: 50%; left: 50%; width: 16px; height: 16px; margin: -8px 0 0 -8px; border-radius: 50%;
  background: rgba(57, 102, 255, 0.2); transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1); }
.is-cur-touch--down .is-cur-touch__dot { transform: scale(2.75); transition-duration: 240ms; }

/* 90s: pixel sparkles (Figma Frames 1–5) that twinkle and drift down behind the arrow */
.is-cur-spark { position: absolute; top: 0; left: 0; width: var(--s); height: var(--s); background: var(--c); clip-path: ${PLUS};
  animation: is-cur-spark var(--t) steps(6, end) forwards; }
@keyframes is-cur-spark {
  0% { opacity: 1; transform: translate(var(--x), var(--y)); }
  30% { opacity: 0.2; }
  45% { opacity: 1; }
  70% { opacity: 0.3; }
  85% { opacity: 1; }
  100% { opacity: 0; transform: translate(calc(var(--x) + var(--dx)), calc(var(--y) + var(--dy))); }
}

/* Touch: catches the real pointer so nothing gets hover, and passes taps, drags and scrolls through */
.is-cur-shield { position: fixed; inset: 0; z-index: 2147483646; background: transparent; touch-action: none; }

@media (prefers-reduced-motion: reduce) {
  .is-cur-touch__dot, .is-cur-pres__label, .is-cur-pres svg { transition: none !important; }
}
`;

/** Sparkle colors from Figma: Periwinkle Main and Periwinkle 4 */
const SPARK_COLORS = ['#3966ff', '#3966ff', '#6c78ef'];

/* ---------- Install ---------- */

export interface CursorController {
  set: (mode: CursorMode) => void;
  get: () => CursorMode;
}

/**
 * Adds the cursor layer to a window's document. `set` switches the cursor. In "touch", a transparent shield
 * takes the real pointer (so nothing on the page sees hover) and passes presses, drags, taps and scrolls to
 * whatever is under the fingertip.
 */
export const installCursor = (win: Window): CursorController => {
  const doc = win.document;
  let mode: CursorMode = 'default';
  let ready = false;
  const reducedMotion = win.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  const style = doc.createElement('style');
  const layer = doc.createElement('div');
  layer.className = 'is-cur-layer';
  layer.setAttribute('aria-hidden', 'true');

  const pres = doc.createElement('div');
  pres.className = 'is-cur-pres is-cur-hidden';
  pres.innerHTML = PRESENTATION_CURSOR_SVG;
  const label = doc.createElement('span');
  label.className = 'is-cur-pres__label';
  pres.appendChild(label);

  const touch = doc.createElement('div');
  touch.className = 'is-cur-touch is-cur-hidden';
  const dot = doc.createElement('span');
  dot.className = 'is-cur-touch__dot';
  touch.appendChild(dot);

  const shield = doc.createElement('div');
  shield.className = 'is-cur-shield';

  let x = -100;
  let y = -100;
  let visible = false;

  const mount = () => {
    if (ready) return;
    ready = true;
    // 1 screen pixel per art pixel (11 × 19, the size of the 18px default arrow), sharp on dense screens
    style.textContent = css(retroCursorUrl(doc, 1), retroCursorUrl(doc, 2));
    doc.head.appendChild(style);
    doc.body.appendChild(layer);
    apply();
  };

  const place = () => {
    const t = `translate3d(${x}px, ${y}px, 0)`;
    if (mode === 'presentation') pres.style.transform = `translate3d(${x - 4}px, ${(y - 3.3).toFixed(1)}px, 0)`;
    if (mode === 'touch') touch.style.transform = t;
  };
  const show = (on: boolean) => {
    visible = on;
    pres.classList.toggle('is-cur-hidden', !on);
    touch.classList.toggle('is-cur-hidden', !on);
  };

  /* Presentation label */
  let labelTimer: ReturnType<typeof setTimeout> | undefined;
  const say = (text: string, hold = false) => {
    if (mode !== 'presentation') return;
    clearTimeout(labelTimer);
    if (label.textContent !== text || !label.classList.contains('is-cur-pres__label--on')) {
      label.textContent = text;
      label.classList.remove('is-cur-pres__label--on');
      void label.offsetWidth;
      label.classList.add('is-cur-pres__label--on');
    }
    if (!hold) labelTimer = setTimeout(() => label.classList.remove('is-cur-pres__label--on'), 900);
  };

  /* 90s glitter */
  let sparkX = 0;
  let sparkY = 0;
  let sparks = 0;
  const sparkle = () => {
    if (reducedMotion || sparks > 70) return;
    const dist = Math.hypot(x - sparkX, y - sparkY);
    if (dist < 5) return;
    sparkX = x;
    sparkY = y;
    const n = dist > 30 ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const s = doc.createElement('span');
      s.className = 'is-cur-spark';
      // 3 × 3 pixels, like the arrow, snapped to the pixel grid; placed below-right of the arrow as in Figma
      const size = 3;
      const time = 700 + Math.random() * 600;
      const px = (v: number) => Math.round(v);
      s.style.cssText =
        `--s:${size}px;--c:${SPARK_COLORS[(Math.random() * SPARK_COLORS.length) | 0]};` +
        `--x:${px(x + 18 + (Math.random() - 0.5) * 12)}px;--y:${px(y + 22 + (Math.random() - 0.5) * 14)}px;` +
        `--dx:${px((Math.random() - 0.5) * 10)}px;--dy:${px(6 + Math.random() * 14)}px;--t:${time.toFixed(0)}ms`;
      layer.appendChild(s);
      sparks++;
      setTimeout(() => {
        s.remove();
        sparks--;
      }, time + 50);
    }
  };

  /* ---------- Pointer tracking (visuals) ---------- */
  let pressed = false;
  let dragging = false;
  let downX = 0;
  let downY = 0;
  let holdTimer: ReturnType<typeof setTimeout> | undefined;
  let scrollTimer: ReturnType<typeof setTimeout> | undefined;

  const opts = { capture: true, passive: true } as const;
  win.addEventListener(
    'pointermove',
    (e) => {
      x = e.clientX;
      y = e.clientY;
      if (mode === 'default') return;
      if (!visible) show(true);
      place();
      if (mode === '90s') sparkle();
      if (pressed && !dragging && Math.hypot(x - downX, y - downY) > 6) {
        dragging = true;
        clearTimeout(holdTimer);
        say('Drag', true);
      }
    },
    opts,
  );
  win.addEventListener(
    'pointerdown',
    (e) => {
      x = e.clientX;
      y = e.clientY;
      downX = x;
      downY = y;
      if (mode === 'default') return;
      show(true);
      place();
      pressed = true;
      dragging = false;
      pres.classList.add('is-cur-pres--down');
      touch.classList.add('is-cur-touch--down');
      if (e.button === 2) say('Right-click');
      else if (e.button === 1) say('Middle-click');
      else {
        clearTimeout(holdTimer);
        holdTimer = setTimeout(() => pressed && !dragging && say('Hold', true), 500);
      }
    },
    opts,
  );
  const release = (e: PointerEvent) => {
    if (!pressed) return;
    pressed = false;
    clearTimeout(holdTimer);
    pres.classList.remove('is-cur-pres--down');
    touch.classList.remove('is-cur-touch--down');
    if (mode !== 'presentation') return;
    if (dragging) {
      say('Drop');
    } else if (e.button === 0) {
      say('Click');
    }
    dragging = false;
  };
  win.addEventListener('pointerup', release, opts);
  win.addEventListener('pointercancel', release, opts);
  // The browser decides what counts as a double-click (it follows the system setting)
  win.addEventListener('dblclick', () => say('Double-click'), opts);
  win.addEventListener(
    'wheel',
    () => {
      if (mode !== 'presentation') return;
      say('Scroll', true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => say('Scroll'), 250);
    },
    opts,
  );
  // Hide when the pointer leaves the window, or moves into an embedded frame (which draws its own cursor)
  doc.addEventListener('mouseout', (e) => {
    const to = e.relatedTarget as Element | null;
    if (!to || to.tagName === 'IFRAME') show(false);
  });

  /* ---------- Touch: shield and pass-through ---------- */
  let shieldOn = false;
  let shieldPaused = false;
  let target: Element | null = null;
  let range: HTMLInputElement | null = null;
  let moved = false;

  const under = (px: number, py: number) => doc.elementsFromPoint(px, py).find((el) => el !== shield && !layer.contains(el)) ?? null;

  const forward = (type: string, e: MouseEvent, el: Element | null) => {
    if (!el) return;
    const init = {
      bubbles: true,
      cancelable: true,
      composed: true,
      clientX: e.clientX,
      clientY: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      button: e.button,
      buttons: e.buttons,
      detail: e.detail,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      metaKey: e.metaKey,
      view: win,
    };
    const ev = type.startsWith('pointer')
      ? new (win as typeof window).PointerEvent(type, {
          ...init,
          pointerId: (e as PointerEvent).pointerId ?? 1,
          pointerType: 'touch',
          isPrimary: true,
          width: 44,
          height: 44,
          pressure: type === 'pointerup' ? 0 : 0.5,
        })
      : new (win as typeof window).MouseEvent(type, init);
    try {
      el.dispatchEvent(ev);
    } catch {
      // A handler on the page failed; the fingertip keeps working
    }
  };

  const setRange = (el: HTMLInputElement, px: number) => {
    const r = el.getBoundingClientRect();
    const min = Number(el.min || 0);
    const max = Number(el.max || 100);
    const step = el.step === 'any' ? 0 : Number(el.step || 1);
    let v = min + Math.min(1, Math.max(0, (px - r.left) / r.width)) * (max - min);
    if (step) v = Math.round((v - min) / step) * step + min;
    Object.getOwnPropertyDescriptor((win as typeof window).HTMLInputElement.prototype, 'value')?.set?.call(el, String(v));
    el.dispatchEvent(new (win as typeof window).Event('input', { bubbles: true }));
  };

  const FOCUSABLE = 'input, textarea, select, button, a[href], [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
  const stop = (e: Event) => e.stopPropagation();

  // The shield never shows over an embedded frame: the frame has its own fingertip
  const pauseShieldOverFrames = (el: Element | null) => {
    if (el?.tagName === 'IFRAME') {
      shieldPaused = true;
      shield.style.pointerEvents = 'none';
      show(false);
      return true;
    }
    return false;
  };
  win.addEventListener(
    'pointermove',
    (e) => {
      if (shieldOn && shieldPaused && e.target !== shield && (e.target as Element)?.tagName !== 'IFRAME') {
        shieldPaused = false;
        shield.style.pointerEvents = '';
      }
    },
    opts,
  );

  shield.addEventListener('pointerdown', (e) => {
    stop(e);
    target = under(e.clientX, e.clientY);
    if (pauseShieldOverFrames(target)) return;
    moved = false;
    range = target instanceof (win as typeof window).HTMLInputElement && target.type === 'range' ? target : null;
    forward('pointerdown', e, target);
    if (range) setRange(range, e.clientX);
  });
  shield.addEventListener('mousedown', (e) => {
    stop(e);
    // Keep the browser from moving focus to the page; focus what the fingertip pressed instead
    e.preventDefault();
    forward('mousedown', e, target);
    const focusable = target?.closest(FOCUSABLE) as HTMLElement | null;
    if (focusable) focusable.focus({ preventScroll: true });
    else (doc.activeElement as HTMLElement | null)?.blur?.();
  });
  shield.addEventListener('pointermove', (e) => {
    stop(e);
    if (!pressed) {
      pauseShieldOverFrames(under(e.clientX, e.clientY));
      return; // a finger in the air: no hover, no move events
    }
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > 10) moved = true;
    const el = range ?? under(e.clientX, e.clientY);
    forward('pointermove', e, el);
    forward('mousemove', e, el);
    if (range) setRange(range, e.clientX);
  });
  shield.addEventListener('pointerup', (e) => {
    stop(e);
    const el = range ?? under(e.clientX, e.clientY);
    forward('pointerup', e, el);
    if (range) range.dispatchEvent(new (win as typeof window).Event('change', { bubbles: true }));
  });
  shield.addEventListener('mouseup', (e) => {
    stop(e);
    forward('mouseup', e, range ?? under(e.clientX, e.clientY));
  });
  shield.addEventListener('click', (e) => {
    stop(e);
    const el = under(e.clientX, e.clientY);
    if (moved || range || !el) return;
    forward('click', e, el);
    // Native pickers (select, color, date) need a real gesture: we are inside one
    const picker = el.closest('select, input[type="color"], input[type="date"], input[type="time"], input[type="datetime-local"]');
    if (picker && 'showPicker' in picker) {
      try {
        (picker as HTMLInputElement).showPicker();
      } catch {
        // Not supported here
      }
    }
  });
  shield.addEventListener('dblclick', (e) => {
    stop(e);
    if (!moved) forward('dblclick', e, under(e.clientX, e.clientY));
  });
  shield.addEventListener('contextmenu', (e) => {
    stop(e);
    e.preventDefault();
  });
  shield.addEventListener(
    'wheel',
    (e) => {
      stop(e);
      // Scroll the nearest scrollable box under the fingertip (the page itself scrolls by default)
      let el: Element | null = under(e.clientX, e.clientY);
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? win.innerHeight : 1;
      while (el && el !== doc.body && el !== doc.documentElement) {
        const s = win.getComputedStyle(el);
        const canY = /(auto|scroll|overlay)/.test(s.overflowY) && el.scrollHeight > el.clientHeight;
        const canX = /(auto|scroll|overlay)/.test(s.overflowX) && el.scrollWidth > el.clientWidth;
        if ((canY && e.deltaY) || (canX && e.deltaX)) {
          e.preventDefault();
          el.scrollBy({ left: e.deltaX * unit, top: e.deltaY * unit });
          return;
        }
        el = el.parentElement;
      }
    },
    { passive: false },
  );

  /* ---------- Switch ---------- */
  const apply = () => {
    if (!ready) return;
    const root = doc.documentElement;
    CURSORS.forEach((c) => root.classList.remove(`is-cur--${c.value}`));
    // Default too: it is the Figma arrow, not the system cursor
    root.classList.add(`is-cur--${mode}`);
    pres.remove();
    touch.remove();
    label.classList.remove('is-cur-pres__label--on');
    if (mode === 'presentation') layer.appendChild(pres);
    if (mode === 'touch') layer.appendChild(touch);
    shieldOn = mode === 'touch';
    shieldPaused = false;
    shield.style.pointerEvents = '';
    if (shieldOn) doc.body.appendChild(shield);
    else shield.remove();
    place();
    show(visible && mode !== 'default');
  };

  if (doc.body) mount();
  else doc.addEventListener('DOMContentLoaded', mount, { once: true });

  return {
    set: (next) => {
      mode = next;
      apply();
    },
    get: () => mode,
  };
};
