import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';
import { SelectionList, type SelectionListOption, type SelectionListProps } from './SelectionList';
import { selectionListSpecComment } from './SelectionList.docs';
import { OptionsEditor } from './SelectionList.editor';

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
    // Hidden from the Controls / props tables (rows are edited in the editor beside the list)
    options: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onChange: { table: { disable: true } },
    'aria-label': { table: { disable: true } },
  },
  parameters: {
    docs: {
      source: {
        transform: (code: string, ctx: { args: SelectionListProps }) => {
          // Only the list itself (the stories render the rows editor next to it)
          const m = code.match(/^([ \t]*)<SelectionList\b[\s\S]*?\/>/m);
          const indent = m ? m[1].length : 0;
          const list = m ? m[0].slice(indent).replace(new RegExp(`^ {${indent}}`, 'gm'), '') : code;
          const jsx = list.replace(/\n\s*onChange=\{[^}]*\}\}?/g, '');
          return `${selectionListSpecComment(ctx.args)}\n${jsx}`;
        },
      },
    },
  },
  /* The list, with a rows editor beside it: type in a row, add, remove and reorder. Changes also update Controls. */
  render: function Render(args, context) {
    const [, updateArgs] = useArgs();
    // On the Docs page only the main example gets the editor, to keep the page tidy
    const showEditor = context.viewMode === 'story' || context.name === 'iPhone';
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>
        <SelectionList {...args} />
        {showEditor && <OptionsEditor options={args.options} onChange={(options) => updateArgs({ options })} />}
      </div>
    );
  },
} satisfies Meta<typeof SelectionList>;

export default meta;
type Story = StoryObj<typeof meta>;

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
