import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Toggle, type ToggleProps, type ToggleSize } from './Toggle';
import { toggleSpecComment } from './Toggle.docs';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  args: {
    defaultChecked: false,
    size: 'default',
    disabled: false,
    label: 'Notifications',
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['default', 'big', 'xl'] },
    defaultChecked: { name: 'on', control: 'boolean' },
    checked: { table: { disable: true } },
    onChange: { table: { disable: true } },
    label: { table: { disable: true } },
  },
  parameters: {
    docs: {
      source: {
        transform: (code: string, ctx: { args: ToggleProps }) =>
          `${toggleSpecComment(ctx.args)}\n${code.replace(/\n\s*onChange=\{[^}]*\}\}?/g, '')}`,
      },
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // Remount when "on" changes in Controls, so the switch follows it
  render: (args) => <Toggle key={String(args.defaultChecked)} {...args} />,
};

export const On: Story = { args: { defaultChecked: true } };

export const Big: Story = { args: { size: 'big', defaultChecked: true } };

export const XL: Story = { args: { size: 'xl', defaultChecked: true } };

/** Every size, off and on — mirrors the Figma "Toggle" sheet. Each one still flips when clicked. */
export const AllStates: Story = {
  name: 'All sizes & states',
  parameters: { controls: { include: ['disabled'] } },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 60px 60px', gap: '16px 12px', alignItems: 'center', justifyItems: 'start' }}>
      <span />
      <span style={caption}>Off</span>
      <span style={caption}>On</span>
      {(['default', 'big', 'xl'] as ToggleSize[]).map((size) => (
        <div key={size} style={{ display: 'contents' }}>
          <span style={{ ...caption, textAlign: 'right', justifySelf: 'end' }}>{{ default: 'Default', big: 'Big', xl: 'XL' }[size]}</span>
          <Toggle size={size} disabled={args.disabled} label={`${size} off`} />
          <Toggle size={size} disabled={args.disabled} label={`${size} on`} defaultChecked />
        </div>
      ))}
    </div>
  ),
};
