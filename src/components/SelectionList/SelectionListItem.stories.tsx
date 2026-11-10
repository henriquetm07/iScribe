import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { iconNames } from '../../icons/icons';
import { SelectionListItem, type SelectionListDevice, type SelectionListItemProps } from './SelectionListItem';
import { selectionListItemSpecComment } from './SelectionList.docs';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;

const meta = {
  title: 'Components/Selection List/Selection List Item',
  component: SelectionListItem,
  args: {
    children: 'Selection List Item',
    device: 'iphone',
    selected: false,
    destructive: false,
    selectedIcon: 'check',
    onClick: fn(),
  },
  argTypes: {
    device: { control: 'inline-radio', options: ['iphone', 'ipad', 'web'] },
    children: { name: 'label', control: 'text' },
    iconLeft: { control: 'select', options: [undefined, ...iconNames] },
    iconRight: { control: 'select', options: [undefined, ...iconNames] },
    selectedIcon: { control: 'select', options: ['none', ...iconNames] },
    showCheck: { table: { disable: true } },
  },
  decorators: [
    // Items fill their list, so preview them at the Figma list width (300px); sheets opt out with fullWidth
    (Story, ctx) =>
      ctx.parameters.fullWidth ? (
        <Story />
      ) : (
        <div style={{ width: 300 }}>
          <Story />
        </div>
      ),
  ],
  parameters: {
    docs: {
      source: {
        transform: (code: string, ctx: { id: string; args: SelectionListItemProps }) => {
          const jsx = code.replace(/^(\s*\/\*[\s\S]*?\*\/\s*)+/, '').replace(/\n\s*onClick=\{[^}]*\}\}?/g, '');
          return `${selectionListItemSpecComment(ctx.args)}\n${jsx}`;
        },
      },
    },
  },
} satisfies Meta<typeof SelectionListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Pointer hover (shown here with data-state so you can see it without hovering). */
export const Hover: Story = { args: { 'data-state': 'hover' } as Partial<SelectionListItemProps> };

export const Selected: Story = { args: { selected: true } };

export const Destructive: Story = { args: { destructive: true, children: 'Remove device' } };

export const WithIcons: Story = { name: 'With icons', args: { iconLeft: 'mic', iconRight: 'chevron-right' } };

/** Every device in every state — mirrors the Figma "Selection List Item" sheet. */
export const AllStates: Story = {
  name: 'All devices & states',
  parameters: { layout: 'padded', fullWidth: true, controls: { include: ['children'] } },
  render: (args) => {
    const states = [
      ['Default', {}],
      ['Hover', { 'data-state': 'hover' }],
      ['Selected', { selected: true }],
      ['Destructive', { destructive: true }],
    ] as const;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(4, 220px)', gap: '14px 20px', alignItems: 'center' }}>
        <span />
        {states.map(([name]) => (
          <span key={name} style={caption}>
            {name}
          </span>
        ))}
        {(['iphone', 'ipad', 'web'] as SelectionListDevice[]).map((device) => (
          <div key={device} style={{ display: 'contents' }}>
            <span style={{ ...caption, fontWeight: 600, color: 'var(--is-foreground-high-contrast-primary-foreground)' }}>
              {{ iphone: 'iPhone', ipad: 'iPad', web: 'Web' }[device]}
            </span>
            {states.map(([name, state]) => (
              <SelectionListItem key={name} {...args} {...(state as Partial<SelectionListItemProps>)} device={device} />
            ))}
          </div>
        ))}
      </div>
    );
  },
};
