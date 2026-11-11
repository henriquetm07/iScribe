import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  // Each component's docs page is listed as "Main" in the sidebar
  docs: { defaultName: 'Main' },
  // Top bar: only the Light / Dark toggle (manager.ts). Turn off the other toolbar tools.
  features: {
    backgrounds: false,
    measure: false,
    outline: false,
    viewport: false,
  },
  // Logo and favicon (served from the site root)
  staticDirs: ['./public'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
