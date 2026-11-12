/*
 * Cursor picker for the board (top bar button in manager.ts). The same module runs in Storybook's own UI
 * (manager.ts) and in the page (preview.ts), so the cursor follows the pointer everywhere.
 *
 *   default       the system cursor
 *   presentation  a big arrow with a label that names every mouse action (Click, Double-click, Drag, Scroll…)
 *   touch         a 40px fingertip: no hover effects; on press the inner circle grows to the outer ring
 *   90s           an 8-bit arrow (Figma "cursor/90s", 3552:2727) with a glittery trail, like old blogs
 */
export type CursorMode = 'default' | 'presentation' | 'touch' | '90s';

/** Shared by manager.ts and preview.ts: where the choice is saved, and the message the picker sends */
export const CURSOR_STORAGE_KEY = 'iscribe-cursor';
export const CURSOR_EVENT = 'iscribe/cursor';

export const CURSORS: { value: CursorMode; label: string; hint: string }[] = [
  { value: 'default', label: 'Default', hint: 'Your system cursor' },
  { value: 'presentation', label: 'Presentation', hint: 'Big, and names every click, drag and scroll' },
  { value: 'touch', label: 'Touch', hint: 'A 40px fingertip, with no hover' },
  { value: '90s', label: '90s', hint: '8-bit arrow with a glitter trail' },
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

const css = (retroUrl: string, retroUrl2x: string) => `
html.is-cur--presentation, html.is-cur--presentation *,
html.is-cur--touch, html.is-cur--touch * { cursor: none !important; }
html.is-cur--90s, html.is-cur--90s * {
  cursor: url(${retroUrl}) 0 0, auto !important;
  cursor: image-set(url(${retroUrl}) 1x, url(${retroUrl2x}) 2x) 0 0, auto !important;
}

.is-cur-layer { position: fixed; inset: 0; z-index: 2147483647; overflow: hidden; pointer-events: none; }
.is-cur-layer * { pointer-events: none; box-sizing: border-box; }
.is-cur-hidden { opacity: 0 !important; }

/* Presentation: big arrow + action label */
.is-cur-pres { position: absolute; top: 0; left: 0; will-change: transform; transition: opacity 120ms ease; }
.is-cur-pres svg { display: block; width: 30px; height: 42px; filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  transform-origin: 2px 2px; transition: transform 120ms ease; }
.is-cur-pres--down svg { transform: scale(0.9); }
.is-cur-pres__label { position: absolute; top: 34px; left: 22px; padding: 5px 11px; border-radius: 1000px;
  background: #3966ff; color: #fff; font: 600 14px/1.2 'Figtree', system-ui, sans-serif; letter-spacing: 0.01em;
  white-space: nowrap; box-shadow: 0 4px 14px rgba(57, 102, 255, 0.35); opacity: 0; transform: scale(0.8);
  transform-origin: 0 0; transition: opacity 180ms ease, transform 180ms ease; }
.is-cur-pres__label--on { opacity: 1; transform: none; transition: opacity 120ms ease, transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1); }
.is-cur-ripple { position: absolute; top: 0; left: 0; width: 48px; height: 48px; margin: -24px 0 0 -24px; border: 3px solid #3966ff;
  border-radius: 50%; animation: is-cur-ripple 480ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes is-cur-ripple { from { opacity: 0.9; transform: scale(0.2); } to { opacity: 0; transform: scale(1); } }

/* Touch: 40px fingertip; the inner circle fills the ring while pressed */
.is-cur-touch { position: absolute; top: 0; left: 0; width: 40px; height: 40px; margin: -20px 0 0 -20px; border-radius: 50%;
  border: 1.5px solid rgba(57, 102, 255, 0.6); background: rgba(57, 102, 255, 0.1);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.35); will-change: transform; transition: opacity 120ms ease; }
.is-cur-touch__dot { position: absolute; top: 50%; left: 50%; width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 50%;
  background: rgba(57, 102, 255, 0.5); transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1); }
.is-cur-touch--down .is-cur-touch__dot { transform: scale(${(37 / 14).toFixed(3)}); transition-duration: 220ms; }

/* 90s: glitter trail */
.is-cur-spark { position: absolute; top: 0; left: 0; width: var(--s); height: var(--s); margin: calc(var(--s) / -2) 0 0 calc(var(--s) / -2);
  background: var(--c); filter: drop-shadow(0 0 3px var(--c));
  clip-path: polygon(50% 0, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0 50%, 39% 39%);
  animation: is-cur-spark var(--t) ease-out forwards; }
@keyframes is-cur-spark {
  0% { opacity: 1; transform: translate(var(--x), var(--y)) scale(1) rotate(0); }
  35% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0; transform: translate(calc(var(--x) + var(--dx)), calc(var(--y) + var(--dy))) scale(0.1) rotate(var(--r)); }
}

/* Touch: catches the real pointer so nothing gets hover, and passes taps, drags and scrolls through */
.is-cur-shield { position: fixed; inset: 0; z-index: 2147483646; background: transparent; touch-action: none; }

@media (prefers-reduced-motion: reduce) {
  .is-cur-touch__dot, .is-cur-pres__label, .is-cur-pres svg { transition: none !important; }
  .is-cur-ripple { animation-duration: 1ms; }
}
`;

const ARROW_SVG =
  '<svg viewBox="0 0 24 34" aria-hidden="true"><path d="M2 2 L2 27 L8.2 21.4 L12.6 31.4 L17 29.4 L12.7 19.8 L21 19.8 Z" ' +
  'fill="#0a0c0f" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>';

const SPARK_COLORS = ['#ff5ccf', '#ffe14d', '#7df9ff', '#b38cff', '#ffffff', '#3966ff', '#ff9a3c'];

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
  pres.innerHTML = ARROW_SVG;
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
    // 2 screen pixels per art pixel, with a sharp version for high-density screens
    style.textContent = css(retroCursorUrl(doc, 2), retroCursorUrl(doc, 4));
    doc.head.appendChild(style);
    doc.body.appendChild(layer);
    apply();
  };

  const place = () => {
    const t = `translate3d(${x}px, ${y}px, 0)`;
    if (mode === 'presentation') pres.style.transform = `translate3d(${x - 2}px, ${y - 2}px, 0)`;
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
  const ripple = () => {
    const r = doc.createElement('span');
    r.className = 'is-cur-ripple';
    r.style.left = `${x}px`;
    r.style.top = `${y}px`;
    layer.appendChild(r);
    setTimeout(() => r.remove(), 600);
  };

  /* 90s glitter */
  let sparkX = 0;
  let sparkY = 0;
  let sparks = 0;
  const sparkle = () => {
    if (reducedMotion || sparks > 70) return;
    const dist = Math.hypot(x - sparkX, y - sparkY);
    if (dist < 7) return;
    sparkX = x;
    sparkY = y;
    const n = dist > 30 ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const s = doc.createElement('span');
      s.className = 'is-cur-spark';
      const size = 5 + Math.random() * 9;
      const time = 650 + Math.random() * 600;
      s.style.cssText =
        `--s:${size.toFixed(1)}px;--c:${SPARK_COLORS[(Math.random() * SPARK_COLORS.length) | 0]};` +
        `--x:${(x + 6 + (Math.random() - 0.5) * 14).toFixed(1)}px;--y:${(y + 10 + (Math.random() - 0.5) * 14).toFixed(1)}px;` +
        `--dx:${((Math.random() - 0.5) * 24).toFixed(1)}px;--dy:${(12 + Math.random() * 26).toFixed(1)}px;` +
        `--r:${((Math.random() - 0.5) * 360).toFixed(0)}deg;--t:${time.toFixed(0)}ms`;
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
      ripple();
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
          width: 40,
          height: 40,
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
    if (mode !== 'default') root.classList.add(`is-cur--${mode}`);
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
