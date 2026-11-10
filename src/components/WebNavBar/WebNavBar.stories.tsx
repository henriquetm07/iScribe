import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { WebNavBar, type WebNavBarItem, type WebNavBarProps } from './WebNavBar';
import { webNavBarSpecComment } from './WebNavBar.docs';

/** The menu from the Figma "Web Nav Bar" */
const items: WebNavBarItem[] = [
  { value: 'visits', label: 'Visits' },
  { value: 'work-list', label: 'Work List' },
  { value: 'coding-insights', label: 'Coding Insights' },
  { value: 'admin', label: 'Admin' },
  { value: 'support', label: 'Support' },
  { value: 'reports', label: 'Reports' },
  { value: 'my-account', label: 'My Account' },
  { value: 'log-out', label: 'Log Out', destructive: true },
];

/** Practices from the Figma example */
const practices = [
  'MI - Oakland Pediatrics',
  'MI - Oaklawn Medical Group',
  'MI - OneHealth',
  'MI - Orthopaedic Associates of Muskegon',
  'MI - Well-Being Pediatrics',
  'MI - Williams, Stephen Internal Medicine',
  'Michigan Ear Institute',
  'Michigan Vein Care Specialists',
  'Midlands Orthopaedics',
  'Midlands Orthopaedics Surgery Center, LLC',
].map((label) => ({ value: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'), label }));

/** Story-only: the width of the box the bar sits in, to see it compact */
type StoryArgs = WebNavBarProps & { barWidth?: number };

const meta = {
  title: 'Components/Web Nav Bar',
  component: WebNavBar,
  args: {
    items,
    defaultValue: 'visits',
    menu: 'auto',
    chromeExtension: true,
    chromeExtensionLabel: 'Download Chrome Extension',
    practices,
    defaultPractice: 'midlands-orthopaedics',
    connectivityAlert: true,
    onNavigate: fn(),
    onChromeExtensionClick: fn(),
    onPracticeChange: fn(),
    onAccountSelect: fn(),
    onSearch: fn(),
    onConnectivityClick: fn(),
  },
  argTypes: {
    menu: { control: 'inline-radio', options: ['auto', 'default', 'compressed'] },
    barWidth: { name: 'bar width (story only)', control: { type: 'range', min: 600, max: 1440, step: 10 } },
    items: { table: { disable: true } },
    practices: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    practice: { table: { disable: true } },
    defaultPractice: { table: { disable: true } },
    accountItems: { table: { disable: true } },
    logo: { table: { disable: true } },
    'aria-label': { table: { disable: true } },
    onNavigate: { table: { disable: true } },
    onChromeExtensionClick: { table: { disable: true } },
    onPracticeChange: { table: { disable: true } },
    onAccountSelect: { table: { disable: true } },
    onSearch: { table: { disable: true } },
    onConnectivityClick: { table: { disable: true } },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        transform: (code: string, ctx: { args: StoryArgs }) => {
          const m = code.match(/^([ \t]*)<WebNavBar\b[\s\S]*?\/>/m);
          const indent = m ? m[1].length : 0;
          const jsx = (m ? m[0].slice(indent).replace(new RegExp(`^ {${indent}}`, 'gm'), '') : code).replace(
            /\n\s*on[A-Z]\w*=\{[^}]*\}\}?/g,
            '',
          );
          return `${webNavBarSpecComment(ctx.args)}\n${jsx}`;
        },
      },
    },
  },
  /* Room below the bar so its menus can open */
  render: ({ barWidth, ...args }) => (
    <div style={{ padding: '24px 24px 360px', boxSizing: 'border-box', background: 'var(--is-background-base-background, transparent)' }}>
      <div style={{ width: barWidth ?? '100%', maxWidth: '100%' }}>
        <WebNavBar {...args} />
      </div>
    </div>
  ),
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The full menu. Make the window (or "bar width") narrower and the menu compacts into a dropdown. */
export const Default: Story = {};

/** Figma Menu State=Compressed: the current page with a menu icon; it opens a Selection List of the items. */
export const Compressed: Story = { args: { menu: 'compressed' } };

/** With the user's avatar, which opens the account menu (My Account, Log Out). */
export const WithAvatar: Story = {
  name: 'With avatar',
  args: { menu: 'compressed', avatar: { initials: 'CN', name: 'Casey Nguyen' } },
};

/** A narrow bar: there is no room for every item, so the menu compacts automatically. */
export const Narrow: Story = { name: 'Narrow (auto-compacted)', args: { barWidth: 1000 } };
