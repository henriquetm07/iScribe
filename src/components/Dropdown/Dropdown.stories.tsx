import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';
import { iconNames } from '../../icons/icons';
import type { SelectionListOption } from '../SelectionList/SelectionList';
import { OptionsEditor } from '../SelectionList/SelectionList.editor';
import { Dropdown, DropdownField, type DropdownDevice, type DropdownProps } from './Dropdown';
import { dropdownSpecComment } from './Dropdown.docs';

/** Same example as the Selection List (Figma "Light Mode" / "Dark Mode" frames) */
const microphones: SelectionListOption[] = [
  { value: 'built-in', label: 'Default - Built-in Microphone' },
  { value: 'macbook', label: 'MacBook Pro Microphone' },
  { value: 'yeti', label: 'Blue Yeti USB Microphone' },
  { value: 'airpods', label: 'AirPods Pro' },
  { value: 'usb-headset', label: 'External USB Headset' },
  { value: 'iphone', label: 'iPhone Microphone' },
  { value: 'webcam', label: 'Webcam Microphone' },
];

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  args: {
    options: microphones,
    defaultValue: 'built-in',
    device: 'iphone',
    width: 305,
    visibleRows: 5,
    selectedIcon: 'check',
    placeholder: 'Select…',
    disabled: false,
    'aria-label': 'Microphone',
    onChange: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    device: { control: 'inline-radio', options: ['iphone', 'ipad', 'web'] },
    visibleRows: { control: { type: 'number', min: 1, max: 12 } },
    selectedIcon: { control: 'select', options: ['none', ...iconNames] },
    open: { control: 'boolean' },
    // Rows are edited in the editor beside the dropdown
    options: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    'aria-label': { table: { disable: true } },
  },
  parameters: {
    docs: {
      source: {
        transform: (code: string, ctx: { args: DropdownProps }) => {
          // Only the dropdown itself (the stories render the rows editor next to it)
          const m = code.match(/^([ \t]*)<Dropdown\b[\s\S]*?\/>/m);
          const indent = m ? m[1].length : 0;
          const jsx = (m ? m[0].slice(indent).replace(new RegExp(`^ {${indent}}`, 'gm'), '') : code).replace(
            /\n\s*on(Change|OpenChange)=\{[^}]*\}\}?/g,
            '',
          );
          return `${dropdownSpecComment(ctx.args)}\n${jsx}`;
        },
      },
    },
  },
  /* The dropdown, with the Selection List rows editor beside it. Room below so the open menu is visible. */
  render: function Render(args, context) {
    const [, updateArgs] = useArgs();
    const showEditor = context.viewMode === 'story' || context.name === 'iPhone';
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 24, minHeight: 300 }}>
        <Dropdown
          {...args}
          onOpenChange={(open) => {
            args.onOpenChange?.(open);
            // When "open" is set in Controls, keep it in sync with clicks
            if (args.open !== undefined) updateArgs({ open });
          }}
        />
        {showEditor && (
          <OptionsEditor
            options={args.options}
            onChange={(options) => updateArgs({ options })}
            selectedIcon={args.selectedIcon}
            onSelectedIconChange={(selectedIcon) => updateArgs({ selectedIcon })}
          />
        )}
      </div>
    );
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IPhone: Story = { name: 'iPhone' };

export const IPad: Story = { name: 'iPad', args: { device: 'ipad' } };

export const Web: Story = { args: { device: 'web' } };

/** Active: the menu is open and shows the Selection List. */
export const Active: Story = { args: { open: true } };

/** Nothing selected yet: the placeholder shows. */
export const Placeholder: Story = { args: { defaultValue: null, placeholder: 'Choose a microphone' } };

/** Every device in both states — mirrors the Figma "Dropdown" component sheet. */
export const AllStates: Story = {
  name: 'All devices & states',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 305px 305px', gap: '14px 20px', alignItems: 'center' }}>
      <span />
      <span style={caption}>Default</span>
      <span style={caption}>Active</span>
      {(['web', 'iphone', 'ipad'] as DropdownDevice[]).map((device) => (
        <div key={device} style={{ display: 'contents' }}>
          <span style={{ ...caption, fontWeight: 600, color: 'var(--is-foreground-high-contrast-primary-foreground)' }}>
            {{ iphone: 'iPhone', ipad: 'iPad', web: 'Web' }[device]}
          </span>
          <DropdownField device={device}>Default - Built-in Microphone</DropdownField>
          <DropdownField device={device} active>
            Default - Built-in Microphone
          </DropdownField>
        </div>
      ))}
    </div>
  ),
};
