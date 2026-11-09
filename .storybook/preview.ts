import type { Preview } from '@storybook/react-vite';
import '../src/styles/colors.css';
import '../src/styles/variables.css';
import '../src/styles/tokens.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    options: {
      storySort: { order: ['Introduction', 'Foundations', ['Colors', 'Variables'], 'Components'] },
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
