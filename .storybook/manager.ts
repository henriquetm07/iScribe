import { createElement as h, useState, type KeyboardEvent } from 'react';
import { addons, types } from 'storybook/manager-api';
import { create } from 'storybook/theming';

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

addons.register('iscribe/mode', () => {
  addons.add('iscribe/mode/toggle', {
    // TOOLEXTRA = the right-hand end of the top bar
    type: types.TOOLEXTRA,
    title: 'Light / Dark',
    match: () => true,
    render: () => h(ModeToggle),
  });
});
