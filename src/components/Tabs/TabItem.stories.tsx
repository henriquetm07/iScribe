import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TabItem, type TabItemProps, type TabsDevice } from './Tabs';
import { tabItemSpecComment } from './Tabs.docs';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;

const meta = {
  title: 'Components/Tabs/Tab Item',
  component: TabItem,
  args: {
    children: 'Label',
    device: 'iphone',
    selected: false,
    tint: 'periwinkle',
    onClick: fn(),
  },
  argTypes: {
    device: { control: 'inline-radio', options: ['iphone', 'ipad', 'web'] },
    tint: { control: 'inline-radio', options: ['periwinkle', 'white'] },
    children: { name: 'label', control: 'text' },
    count: { control: 'text' },
  },
  // Tab items are 120px wide in Figma; inside Tabs they share the bar's width
  decorators: [(Story, ctx) => (ctx.parameters.sheet ? <Story /> : <div style={{ display: 'grid', width: 120 }}><Story /></div>)],
  parameters: {
    docs: {
      source: {
        transform: (code: string, ctx: { args: TabItemProps }) =>
          `${tabItemSpecComment(ctx.args)}\n${code.replace(/\n\s*onClick=\{[^}]*\}\}?/g, '')}`,
      },
    },
  },
} satisfies Meta<typeof TabItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = { args: { selected: true } };

export const WithCount: Story = { name: 'With count', args: { selected: true, count: 12 } };

/** Every device in both states — mirrors the Figma "Tab item" sheet. */
export const AllStates: Story = {
  name: 'All devices & states',
  parameters: { sheet: true, controls: { include: ['children'] } },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 120px 120px', gap: '14px 20px', alignItems: 'center' }}>
      <span />
      <span style={caption}>Default</span>
      <span style={caption}>Selected</span>
      {(['iphone', 'ipad', 'web'] as TabsDevice[]).map((device) => (
        <div key={device} style={{ display: 'contents' }}>
          <span style={{ ...caption, fontWeight: 600, color: 'var(--is-foreground-high-contrast-primary-foreground)' }}>
            {{ iphone: 'iPhone', ipad: 'iPad', web: 'Web' }[device]}
          </span>
          <TabItem {...args} device={device} selected={false} style={{ width: 120 }} />
          <TabItem {...args} device={device} selected style={{ width: 120 }} />
        </div>
      ))}
    </div>
  ),
};
