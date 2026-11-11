import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

/*
 * Storybook's own UI (sidebar and toolbar). The iScribe logo comes from the Figma "Logo" page:
 * the white version on a dark sidebar, the black one on a light sidebar, following the system setting.
 * Logo and favicon files live in .storybook/public.
 */
const dark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;

const logo = dark ? './logo-white.svg' : './logo-black.svg';
/** Logo width in the sidebar: 105px (70% of the 150px it filled before). */
const LOGO_WIDTH = 105;

addons.setConfig({
  theme: create({
    base: dark ? 'dark' : 'light',
    // brandTitle accepts HTML; an explicit width keeps the logo smaller than the sidebar allows
    brandTitle: `<img src="${logo}" alt="iScribe" width="${LOGO_WIDTH}" style="display:block;width:${LOGO_WIDTH}px;height:auto" />`,
    brandUrl: './',
    brandTarget: '_self',
    fontBase: "'Figtree', system-ui, sans-serif",
  }),
  sidebar: {
    filters: {
      // Components list only their Main (docs) page; their stories still show on that page
      patterns: (item) => !(item.type === 'story' && item.title.startsWith('Components/')),
    },
  },
});
