import { createElement, useEffect, useState, type ComponentProps } from 'react';
import type { Preview } from '@storybook/react-vite';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { addons } from 'storybook/preview-api';
import { create } from 'storybook/theming';
import '../src/styles/colors.css';
import '../src/styles/variables.css';
import '../src/styles/tokens.css';

/*
 * Light / Dark mode for the whole board, not only the components.
 * The toggle in the top bar (manager.ts) saves the mode in the browser and tells this page; we set
 * data-theme on the page, which flips every --is- variable, and re-theme the docs. Nothing is reloaded or
 * re-rendered from scratch, and colors fade smoothly (preview-head.html, .is-mode-switching).
 */
type Mode = 'light' | 'dark';
const font = "'Figtree', system-ui, -apple-system, 'Segoe UI', sans-serif";
const docsThemes = {
  light: create({ base: 'light', fontBase: font }),
  // Dark docs: iScribe dark surfaces (Elevated Background #17191C) with light text
  dark: create({
    base: 'dark',
    fontBase: font,
    colorPrimary: '#3966ff',
    colorSecondary: '#3966ff',
    appBg: '#17191c',
    appContentBg: '#17191c',
    appPreviewBg: '#17191c',
    appBorderColor: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    textMutedColor: '#9ba3ac',
    barBg: '#1d1f23',
    barTextColor: '#9ba3ac',
    barSelectedColor: '#ffffff',
    inputBg: '#0a0c0f',
    inputBorder: 'rgba(255, 255, 255, 0.12)',
    inputTextColor: '#ffffff',
  }),
};

/** Shared with manager.ts: where the mode is saved, and the message the toggle sends */
const STORAGE_KEY = 'iscribe-mode';
const MODE_EVENT = 'iscribe/mode';
const asMode = (value: unknown): Mode => (value === 'dark' ? 'dark' : 'light');
const readSavedMode = (): Mode => {
  try {
    return asMode(localStorage.getItem(STORAGE_KEY));
  } catch {
    return 'light';
  }
};
const applyMode = (mode: Mode) => {
  if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', mode);
};

// Start in the saved mode before anything renders, so there is no flash of the other mode
let currentMode: Mode = readSavedMode();
applyMode(currentMode);

const listeners = new Set<(mode: Mode) => void>();
let fadeTimer: ReturnType<typeof setTimeout> | undefined;
const switchMode = (next: Mode) => {
  if (next === currentMode) return;
  currentMode = next;
  // Fade colors for a moment while switching (see preview-head.html)
  const root = document.documentElement;
  root.classList.add('is-mode-switching');
  clearTimeout(fadeTimer);
  fadeTimer = setTimeout(() => root.classList.remove('is-mode-switching'), 400);
  applyMode(next);
  listeners.forEach((listener) => listener(next));
};

// Follow the toggle on every page, including docs pages that have no stories (Introduction, Foundations)
addons.getChannel().on(MODE_EVENT, (mode: unknown) => switchMode(asMode(mode)));
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) switchMode(asMode(e.newValue));
  });
}

/** Docs pages: re-themed in place when the mode changes (no reload) */
const ThemedDocsContainer = (props: ComponentProps<typeof DocsContainer>) => {
  const [mode, setMode] = useState<Mode>(currentMode);
  useEffect(() => {
    listeners.add(setMode);
    setMode(currentMode);
    return () => {
      listeners.delete(setMode);
    };
  }, []);
  return createElement(DocsContainer, { ...props, theme: docsThemes[mode] });
};

const preview: Preview = {
  parameters: {
    layout: 'centered',
    // Docs pages (headings, text, tables) in Figtree, light or dark with the toggle
    docs: {
      container: ThemedDocsContainer,
    },
    options: {
      storySort: { order: [
        'Introduction', 'Foundations', ['Colors', 'Variables', 'Icons', 'Animated Icons'],
        'Components', ['Bottom Tab', ['Bottom Tab', 'Alert', 'Send Slider'], 'Button', 'Dropdown', 'Icon Button', 'Selection List', ['Selection List', 'Selection List Item'], 'Tabs', ['Tabs', 'Tab Item'], 'Toggle', 'Web Nav Bar'],
      ] },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    // Every story renders in the current mode
    (Story) => {
      applyMode(currentMode);
      return Story();
    },
  ],
  tags: ['autodocs'],
};

export default preview;
