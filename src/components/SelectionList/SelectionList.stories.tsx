import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SelectionList, type SelectionListOption, type SelectionListProps } from './SelectionList';
import { selectionListSpecComment } from './SelectionList.docs';

/** The example from the Figma "Light Mode" / "Dark Mode" frames, plus two rows so it scrolls. */
const microphones: SelectionListOption[] = [
  { value: 'built-in', label: 'Default - Built-in Microphone' },
  { value: 'macbook', label: 'MacBook Pro Microphone' },
  { value: 'yeti', label: 'Blue Yeti USB Microphone' },
  { value: 'airpods', label: 'AirPods Pro' },
  { value: 'usb-headset', label: 'External USB Headset' },
  { value: 'iphone', label: 'iPhone Microphone' },
  { value: 'webcam', label: 'Webcam Microphone' },
];

const meta = {
  title: 'Simple Components/Selection List/Selection List',
  component: SelectionList,
  args: {
    options: microphones,
    defaultValue: 'macbook',
    device: 'iphone',
    visibleRows: 5,
    width: 300,
    'aria-label': 'Microphone',
    onChange: fn(),
  },
  argTypes: {
    device: { control: 'inline-radio', options: ['iphone', 'ipad', 'web'] },
    visibleRows: { control: { type: 'number', min: 1, max: 12 } },
    value: { control: false },
  },
  parameters: {
    docs: {
      source: {
        transform: (code: string, ctx: { args: SelectionListProps }) => {
          const jsx = code.replace(/^(\s*\/\*[\s\S]*?\*\/\s*)+/, '').replace(/\n\s*onChange=\{[^}]*\}\}?/g, '');
          return `${selectionListSpecComment(ctx.args)}\n${jsx}`;
        },
      },
    },
  },
} satisfies Meta<typeof SelectionList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The Figma example: pick a microphone. Five rows show, the rest scroll. Try the arrow keys. */
export const IPhone: Story = { name: 'iPhone' };

export const IPad: Story = { name: 'iPad', args: { device: 'ipad' } };

export const Web: Story = { args: { device: 'web' } };

/** Every row visible, no scroller (Figma "Selection List" component sheet). */
export const AllRows: Story = { name: 'All rows (no scroll)', args: { visibleRows: undefined } };

/** A destructive action at the end of the list. */
export const WithDestructive: Story = {
  name: 'With a destructive row',
  args: {
    visibleRows: undefined,
    defaultValue: 'airpods',
    options: [
      { value: 'macbook', label: 'MacBook Pro Microphone', icon: 'mic' },
      { value: 'airpods', label: 'AirPods Pro', icon: 'mic' },
      { value: 'settings', label: 'Sound settings…', icon: 'settings' },
      { value: 'remove', label: 'Remove device', icon: 'trash', destructive: true },
    ],
  },
};
