import { createElement as h, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { addons, types } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import {
  asCursor,
  CURSOR_EVENT,
  CURSOR_STORAGE_KEY,
  CURSORS,
  DEFAULT_CURSOR_SVG,
  installCursor,
  PRESENTATION_CURSOR_SVG,
  readSavedCursor,
  retroCursorUrl,
  type CursorMode,
} from './cursors';

/*
 * Storybook's own UI (sidebar and top bar), styled like the iScribe brand guidelines site:
 * a near-black sidebar and toolbar, grey text, a navy highlight for the selected page and thin dividers.
 * Finer sidebar details (section titles, rows, dividers) are in manager-head.html.
 * Logo and favicon files live in .storybook/public.
 */
const brand = {
  bg: '#0a0c0f',
  border: '#232527',
  text: '#9ba3ac',
  muted: '#6d747c',
  bright: '#f0f2f4',
  accent: '#3966ff',
};

/** Logo width in the sidebar: 64px, as on the brand guidelines site */
const LOGO_WIDTH = 64;

addons.setConfig({
  theme: create({
    base: 'dark',
    // brandTitle accepts HTML; an explicit width keeps the logo at the brand size
    brandTitle: `<img src="./logo-white.svg" alt="iScribe" width="${LOGO_WIDTH}" style="display:block;width:${LOGO_WIDTH}px;height:auto" />`,
    brandUrl: './',
    brandTarget: '_self',
    fontBase: "'Figtree', system-ui, sans-serif",

    colorPrimary: brand.accent,
    colorSecondary: brand.accent,

    appBg: brand.bg,
    appBorderColor: brand.border,
    appBorderRadius: 6,

    textColor: brand.text,
    textMutedColor: brand.muted,
    textInverseColor: brand.bg,

    barBg: brand.bg,
    barTextColor: brand.text,
    barHoverColor: brand.bright,
    barSelectedColor: brand.bright,

    inputBg: brand.bg,
    inputBorder: brand.border,
    inputTextColor: brand.bright,
    inputBorderRadius: 6,
  }),
  // Top bar: hide Storybook's own tools; only the Light / Dark toggle below stays
  toolbar: {
    zoom: { hidden: true },
    eject: { hidden: true },
    copy: { hidden: true },
    fullscreen: { hidden: true },
  },
  sidebar: {
    filters: {
      // Components list only their Main (docs) page; their stories still show on that page
      patterns: (item) => !(item.type === 'story' && item.title.startsWith('Components/')),
    },
  },
});

/*
 * Light / Dark toggle in the top bar, modelled on the Tabs component: two equal options in a pill,
 * with a periwinkle glass selection that slides to the picked mode. It saves the mode in the browser and
 * tells the page (preview.ts), which switches its colors in place — no reload. Styles are in manager-head.html.
 */
const STORAGE_KEY = 'iscribe-mode';
const MODE_EVENT = 'iscribe/mode';
type Mode = 'light' | 'dark';
const savedMode = (): Mode => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

const MODES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const;

const ModeToggle = () => {
  const [mode, setMode] = useState<Mode>(savedMode);
  const set = (value: Mode) => {
    if (value === mode) return;
    setMode(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Private windows can block storage; the switch still works for this visit
    }
    addons.getChannel().emit(MODE_EVENT, value);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      set(e.key === 'Home' ? 'light' : e.key === 'End' ? 'dark' : mode === 'light' ? 'dark' : 'light');
    }
  };
  return h(
    'div',
    { className: 'is-mode-toggle', role: 'radiogroup', 'aria-label': 'Color mode', 'data-mode': mode, onKeyDown },
    h('span', { className: 'is-mode-toggle__glass', 'aria-hidden': true }),
    ...MODES.map((m) =>
      h(
        'button',
        {
          key: m.value,
          type: 'button',
          role: 'radio',
          'aria-checked': mode === m.value,
          tabIndex: mode === m.value ? 0 : -1,
          className: `is-mode-toggle__option${mode === m.value ? ' is-mode-toggle__option--on' : ''}`,
          onClick: () => set(m.value),
        },
        m.label,
      ),
    ),
  );
};

/*
 * Cursor picker: a secondary icon button next to the Light / Dark toggle. It opens a small menu
 * (Default, Presentation, Touch, 90s), saves the pick in the browser and tells the page (preview.ts).
 * The cursor itself is drawn by cursors.ts, here in Storybook's own UI and in the page.
 */
const cursor = installCursor(window);
cursor.set(readSavedCursor());
window.addEventListener('storage', (e) => {
  if (e.key === CURSOR_STORAGE_KEY) cursor.set(asCursor(e.newValue));
});

const svg = (size: number, body: string, viewBox = '0 0 16 16') =>
  h('svg', { width: size, height: size, viewBox, 'aria-hidden': true, dangerouslySetInnerHTML: { __html: body } });
const img = (src: string, width: number, height: number, pixelated = false) =>
  h('img', { src, width, height, alt: '', style: pixelated ? { imageRendering: 'pixelated' } : undefined });
const svgSrc = (markup: string) => `data:image/svg+xml,${encodeURIComponent(markup)}`;

/** The arrow of Figma "cursor/default", in the button's text color (the top bar is dark) */
const ARROW_PATH = (DEFAULT_CURSOR_SVG.match(/ d="([^"]+)"/) ?? [])[1] ?? '';
const RETRO_ICON = retroCursorUrl(document, 2);

/** Menu previews: each option shows its Figma cursor */
const glyphs: Record<CursorMode, () => ReturnType<typeof h>> = {
  default: () => img(svgSrc(DEFAULT_CURSOR_SVG), 20, 21),
  presentation: () => img(svgSrc(PRESENTATION_CURSOR_SVG), 24, 26),
  touch: () =>
    svg(
      22,
      '<circle cx="22" cy="22" r="22" fill="#3966FF" fill-opacity="0.2"/><circle cx="22" cy="22" r="8" fill="#3966FF" fill-opacity="0.2"/>',
      '0 0 44 44',
    ),
  '90s': () => img(RETRO_ICON, 11, 19, true),
};

const CursorPicker = () => {
  const [value, setValue] = useState<CursorMode>(readSavedCursor);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  const pick = (next: CursorMode) => {
    setOpen(false);
    btn.current?.focus();
    if (next === value) return;
    setValue(next);
    cursor.set(next);
    try {
      localStorage.setItem(CURSOR_STORAGE_KEY, next);
    } catch {
      // Private windows can block storage; the cursor still changes for this visit
    }
    addons.getChannel().emit(CURSOR_EVENT, next);
  };

  const toggle = () => {
    const r = btn.current?.getBoundingClientRect();
    if (r) setPos({ top: r.bottom + 8, right: Math.max(8, window.innerWidth - r.right) });
    setOpen((o) => !o);
  };

  // Close on a press outside, or Escape; focus the picked option when it opens
  useEffect(() => {
    if (!open) return;
    const items = () => [...(menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? [])];
    (items().find((el) => el.getAttribute('aria-checked') === 'true') ?? items()[0])?.focus();
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      // The touch cursor's shield passes the press on to what is under it: wait for that one
      if (t?.classList?.contains('is-cur-shield')) return;
      if (!menu.current?.contains(t) && !btn.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const onMenuKey = (e: KeyboardEvent) => {
    const items = [...(menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? [])];
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    const go = (n: number) => items[(n + items.length) % items.length]?.focus();
    if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(items.length - 1);
    else if (e.key === 'Tab') setOpen(false);
    else return;
    if (e.key !== 'Tab') e.preventDefault();
  };

  const current = CURSORS.find((c) => c.value === value) ?? CURSORS[0];
  return h(
    'div',
    { className: 'is-cursor-picker' },
    h(
      'button',
      {
        ref: btn,
        type: 'button',
        className: `is-cursor-btn${open ? ' is-cursor-btn--open' : ''}`,
        'aria-label': `Cursor: ${current.label}`,
        title: `Cursor: ${current.label}`,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        onClick: toggle,
        onKeyDown: (e: KeyboardEvent) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault();
            toggle();
          }
        },
      },
      // Figma Icon Button (secondary) with the cursor/default icon, 16px
      svg(16, `<path d="${ARROW_PATH}" fill="currentColor"/>`, '1.5 1 16 16'),
    ),
    open &&
      h(
        'div',
        { ref: menu, className: 'is-cursor-menu', role: 'menu', 'aria-label': 'Cursor', style: { top: pos.top, right: pos.right }, onKeyDown: onMenuKey },
        h('p', { className: 'is-cursor-menu__title' }, 'Cursor'),
        ...CURSORS.map((c) =>
          h(
            'button',
            {
              key: c.value,
              type: 'button',
              role: 'menuitemradio',
              'aria-checked': c.value === value,
              tabIndex: -1,
              className: `is-cursor-menu__item${c.value === value ? ' is-cursor-menu__item--on' : ''}`,
              onClick: () => pick(c.value),
            },
            h('span', { className: 'is-cursor-menu__glyph' }, glyphs[c.value]()),
            h('span', { className: 'is-cursor-menu__text' }, h('span', { className: 'is-cursor-menu__label' }, c.label), h('span', { className: 'is-cursor-menu__hint' }, c.hint)),
            h('span', { className: 'is-cursor-menu__check' }, c.value === value ? svg(14, '<path d="M3 8.4l3.2 3.1L13 4.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>') : null),
          ),
        ),
      ),
  );
};

/* Styles for the picker (Storybook's top bar is always dark) */
const pickerStyle = document.createElement('style');
pickerStyle.textContent = `
  .is-top-tools { display: inline-flex; align-items: center; gap: 8px; margin-right: 4px; }
  .is-top-tools .is-mode-toggle { margin-right: 0; }
  /* Figma "Icon Button" (secondary, 40 × 40, radius 12px), in its dark-mode colors:
     Button Secondary Default BG = TWhite 10, Secondary Stroke = TWhite 8, Active = TWhite 18 */
  .is-cursor-btn { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; background: rgba(255, 255, 255, 0.1); color: #f0f2f4;
    cursor: pointer; transition: background-color 150ms ease; }
  .is-cursor-btn:hover, .is-cursor-btn--open { background: rgba(255, 255, 255, 0.18); }
  .is-cursor-btn:focus-visible { outline: 2px solid #3966ff; outline-offset: 2px; }
  .is-cursor-menu { position: fixed; z-index: 2147483000; width: 272px; padding: 6px; border: 1px solid #232527; border-radius: 16px;
    background: #121418; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45); font-family: 'Figtree', system-ui, sans-serif;
    white-space: normal; text-align: left;
    animation: is-cursor-menu-in 180ms cubic-bezier(0.22, 1, 0.36, 1); }
  @keyframes is-cursor-menu-in { from { opacity: 0; transform: translateY(-4px) scale(0.98); } }
  .is-cursor-menu__title { margin: 6px 10px 6px; color: #6d747c; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
  .is-cursor-menu__item { display: flex; align-items: center; gap: 12px; width: 100%; padding: 8px 10px; border: 1px solid transparent;
    border-radius: 10px; background: none; color: #9ba3ac; font: inherit; text-align: left; cursor: pointer; }
  .is-cursor-menu__item:hover, .is-cursor-menu__item:focus-visible { background: rgba(255, 255, 255, 0.05); color: #f0f2f4; outline: none; }
  .is-cursor-menu__item--on { background: rgba(57, 102, 255, 0.16); border-color: rgba(255, 255, 255, 0.06); color: #f0f2f4; }
  .is-cursor-menu__item--on:hover, .is-cursor-menu__item--on:focus-visible { background: rgba(57, 102, 255, 0.22); }
  .is-cursor-menu__glyph { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 28px; height: 28px;
    border-radius: 8px; background: rgba(255, 255, 255, 0.05); color: #f0f2f4; }
  .is-cursor-menu__text { display: flex; flex: 1; flex-direction: column; gap: 1px; min-width: 0; }
  .is-cursor-menu__label { font-size: 13px; font-weight: 600; }
  .is-cursor-menu__hint { color: #6d747c; font-size: 12px; line-height: 1.3; }
  .is-cursor-menu__check { display: inline-flex; flex: none; width: 14px; color: #6f8cff; }
  @media (prefers-reduced-motion: reduce) { .is-cursor-menu { animation: none; } }
`;
document.head.appendChild(pickerStyle);

addons.register('iscribe/mode', () => {
  addons.add('iscribe/mode/toggle', {
    // TOOLEXTRA = the right-hand end of the top bar: Light / Dark, then the cursor picker
    type: types.TOOLEXTRA,
    title: 'Light / Dark',
    match: () => true,
    render: () => h('div', { className: 'is-top-tools' }, h(ModeToggle), h(CursorPicker)),
  });
});
