import { addons } from 'storybook/manager-api';
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
  sidebar: {
    filters: {
      // Components list only their Main (docs) page; their stories still show on that page
      patterns: (item) => !(item.type === 'story' && item.title.startsWith('Components/')),
    },
  },
});
