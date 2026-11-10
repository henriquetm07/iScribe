import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

/*
 * Storybook's own UI (sidebar and toolbar). The iScribe logo comes from the Figma "Logo" page:
 * the white version on a dark sidebar, the black one on a light sidebar, following the system setting.
 * Logo and favicon files live in .storybook/public.
 */
const dark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;

addons.setConfig({
  theme: create({
    base: dark ? 'dark' : 'light',
    brandTitle: 'iScribe',
    brandUrl: './',
    brandTarget: '_self',
    brandImage: dark ? './logo-white.svg' : './logo-black.svg',
    fontBase: "'Figtree', system-ui, sans-serif",
  }),
});
