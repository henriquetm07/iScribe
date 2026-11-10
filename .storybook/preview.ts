import type { Preview } from '@storybook/react-vite';
import { create } from 'storybook/theming';
import { createElement } from 'react';
import { Blueprint } from './blueprint/Blueprint';
import { DocsBlueprint } from './blueprint/DocsBlueprint';
import '../src/styles/colors.css';
import '../src/styles/variables.css';
import '../src/styles/tokens.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    // Docs pages (headings, text, tables) in Figtree instead of Storybook's default font
    docs: {
      theme: create({ base: 'light', fontBase: "'Figtree', system-ui, -apple-system, 'Segoe UI', sans-serif" }),
    },
    options: {
      storySort: { order: ['Introduction', 'Foundations', ['Colors', 'Variables', 'Icons', 'Animated Icons'], 'Simple Components', 'Complex Components'] },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    blueprint: {
      // Toggled by the "Blueprint" toolbar button (.storybook/manager.ts)
      description: 'Show each story as a blueprint: size, padding, gaps, specs and nested components',
    },
    theme: {
      description: 'Light or dark tokens',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    blueprint: false,
  },
  decorators: [
    // Blueprint view: wraps the story and draws its structure.
    // Story pages: the "Blueprint" button in the top toolbar. Docs pages: a "Blueprint" button next to
    // Reload story / Zoom in / Zoom out / Reset zoom above the preview (or the top toolbar for every story).
    (Story, context) => {
      if (context.viewMode === 'docs') {
        return createElement(DocsBlueprint, { title: context.title, forced: !!context.globals.blueprint }, Story());
      }
      return context.globals.blueprint ? createElement(Blueprint, { title: context.title }, Story()) : Story();
    },
    (Story, context) => {
      const theme = context.globals.theme === 'dark' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      return Story();
    },
  ],
  tags: ['autodocs'],
};

export default preview;
