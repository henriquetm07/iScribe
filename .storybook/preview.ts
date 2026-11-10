import type { Preview } from '@storybook/react-vite';
import { create } from 'storybook/theming';
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
      storySort: { order: [
        'Introduction', 'Foundations', ['Colors', 'Variables', 'Icons', 'Animated Icons'],
        'Components', ['Bottom Tab', ['Bottom Tab', 'Alert', 'Send Slider'], 'Button', 'Icon Button', 'Selection List', ['Selection List', 'Selection List Item']],
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
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === 'dark' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      return Story();
    },
  ],
  tags: ['autodocs'],
};

export default preview;
