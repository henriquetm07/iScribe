import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Tabs, type TabsOption, type TabsProps } from './Tabs';
import { tabsSpecComment } from './Tabs.docs';

/** Five tabs, as in the Figma "Tab" component */
const labels: TabsOption[] = ['Label', 'Label', 'Label', 'Label', 'Label'].map((label, i) => ({ value: `tab-${i + 1}`, label }));

const meta = {
  title: 'Components/Tabs/Tabs',
  component: Tabs,
  args: {
    options: labels,
    defaultValue: 'tab-1',
    device: 'iphone',
    width: 630,
    tint: 'periwinkle',
    refraction: 22,
    lens: 1.05,
    elasticity: 0.6,
    'aria-label': 'Sections',
    onChange: fn(),
  },
  argTypes: {
    device: { control: 'inline-radio', options: ['iphone', 'ipad', 'web'] },
    width: { control: { type: 'number', min: 200, max: 1000, step: 10 } },
    tint: { control: 'inline-radio', options: ['periwinkle', 'white'] },
    refraction: { control: { type: 'range', min: 0, max: 40, step: 1 } },
    lens: { control: { type: 'range', min: 1, max: 1.25, step: 0.01 } },
    elasticity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    options: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onChange: { table: { disable: true } },
    'aria-label': { table: { disable: true } },
  },
  parameters: {
    docs: {
      source: {
        transform: (code: string, ctx: { args: TabsProps }) =>
          `${tabsSpecComment(ctx.args)}\n${code.replace(/\n\s*onChange=\{[^}]*\}\}?/g, '')}`,
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IPhone: Story = { name: 'iPhone' };

export const IPad: Story = { name: 'iPad', args: { device: 'ipad', width: 620 } };

export const Web: Story = { args: { device: 'web', width: 620 } };

/** Real labels with count badges (Figma "Notification") — e.g. the search panel's Patients / Jobs */
export const WithCounts: Story = {
  name: 'With counts',
  args: {
    width: 360,
    options: [
      { value: 'patients', label: 'Patients', count: 12 },
      { value: 'jobs', label: 'Jobs', count: 3 },
    ],
    defaultValue: 'patients',
    'aria-label': 'Search in',
  },
};

/** The same glass over a periwinkle-and-white gradient, where its blur and sheen are easier to see. */
export const OnColor: Story = {
  name: 'On a colorful background',
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '40px 24px',
          borderRadius: 24,
          background:
            // Periwinkle and white only: Periwinkle Main (#3966FF), a lighter periwinkle and white
            'radial-gradient(60% 90% at 15% 20%, #3966ff 0, transparent 60%), radial-gradient(50% 80% at 85% 30%, #ffffff 0, transparent 60%), radial-gradient(60% 90% at 55% 100%, #7f9bff 0, transparent 60%), #b9c8ff',
        }}
      >
        <Story />
      </div>
    ),
  ],
};
