import { createElement, useEffect, useState, type ComponentProps } from 'react';
import type { Preview } from '@storybook/react-vite';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { addons } from 'storybook/preview-api';
import { create } from 'storybook/theming';
import '../src/styles/colors.css';
import '../src/styles/variables.css';
import '../src/styles/tokens.css';

/*
 * Light / Dark mode for the whole board, not only the components:
 * the "theme" global (switched by the toggle in the top bar, see manager.ts) sets data-theme on the page,
 * which flips every --is- variable, and the docs pages switch to a matching light or dark docs theme.
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

const applyMode = (mode: Mode) => {
  if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', mode);
};
const modeOf = (globals?: Record<string, unknown>): Mode => (globals?.theme === 'dark' ? 'dark' : 'light');

// Follow the toggle on every page, including docs pages that have no stories (Introduction, Foundations)
const channel = addons.getChannel();
let currentMode: Mode = 'light';
const onGlobals = ({ globals }: { globals?: Record<string, unknown> }) => {
  currentMode = modeOf(globals);
  applyMode(currentMode);
};
channel.on('setGlobals', onGlobals);
channel.on('globalsUpdated', onGlobals);

/** Docs pages: re-themed when the mode changes */
const ThemedDocsContainer = (props: ComponentProps<typeof DocsContainer>) => {
  const [mode, setMode] = useState<Mode>(currentMode);
  useEffect(() => {
    const on = ({ globals }: { globals?: Record<string, unknown> }) => setMode(modeOf(globals));
    channel.on('globalsUpdated', on);
    channel.on('setGlobals', on);
    return () => {
      channel.off('globalsUpdated', on);
      channel.off('setGlobals', on);
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
        'Components', ['Bottom Tab', ['Bottom Tab', 'Alert', 'Send Slider'], 'Button', 'Dropdown', 'Icon Button', 'Selection List', ['Selection List', 'Selection List Item'], 'Tabs', ['Tabs', 'Tab Item'], 'Web Nav Bar'],
      ] },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    // Switched by the Light / Dark toggle in the top bar (manager.ts)
    theme: {
      description: 'Light or dark mode',
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      applyMode(modeOf(context.globals));
      return Story();
    },
  ],
  tags: ['autodocs'],
};

export default preview;
