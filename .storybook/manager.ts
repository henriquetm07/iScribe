import { createElement } from 'react';
import { addons, types, useGlobals } from 'storybook/manager-api';
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
});

/*
 * "Blueprint" toolbar button, next to Reload and the zoom buttons. It toggles the `blueprint` global;
 * the preview then draws each story as a blueprint (see .storybook/blueprint/Blueprint.tsx).
 */
const BlueprintTool = () => {
  const [globals, updateGlobals] = useGlobals();
  const on = !!globals.blueprint;
  const icon = createElement(
    'svg',
    { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, 'aria-hidden': true },
    createElement('rect', { x: 1.5, y: 1.5, width: 11, height: 11, rx: 1.5 }),
    createElement('path', { d: 'M1.5 5h11M5 1.5v11M7.5 8h3M7.5 10h2', strokeDasharray: '0' }),
  );
  return createElement(
    'button',
    {
      type: 'button',
      title: on ? 'Hide blueprint' : 'Show blueprint: structure, spacing, specs and nested components',
      'aria-pressed': on,
      onClick: () => updateGlobals({ blueprint: !on }),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 28,
        margin: '0 2px',
        padding: '0 8px',
        border: 0,
        borderRadius: 4,
        background: on ? 'rgba(2, 156, 253, 0.14)' : 'transparent',
        color: on ? '#029CFD' : 'inherit',
        font: "600 12px 'Figtree', system-ui, sans-serif",
        cursor: 'pointer',
      },
    },
    icon,
    'Blueprint',
  );
};

addons.register('iscribe/blueprint', () => {
  addons.add('iscribe/blueprint/tool', {
    type: types.TOOL,
    title: 'Blueprint',
    match: ({ viewMode, tabId }) => !tabId && (viewMode === 'story' || viewMode === 'docs'),
    render: BlueprintTool,
  });
});
