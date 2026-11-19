import type { Meta, StoryObj } from '@storybook/react-vite';
import { GeneratedNoteItem } from './GeneratedNote';
import { generatedNoteItemSpecComment } from './GeneratedNote.docs';
import { sampleGeneratedNote } from './sampleGeneratedNote';

type Args = { section: string };

const Item = ({ section }: Args) => {
  const s = sampleGeneratedNote.find((x) => x.id === section) ?? sampleGeneratedNote[0];
  return <GeneratedNoteItem title={s.title}>{s.text}</GeneratedNoteItem>;
};

const meta = {
  title: 'Components/RTN Notes/RTN Item (Generated Note)',
  component: Item,
  args: { section: 'ros' },
  argTypes: {
    section: {
      control: 'select',
      options: sampleGeneratedNote.map((s) => s.id),
      labels: Object.fromEntries(sampleGeneratedNote.map((s) => [s.id, s.title])),
      description: 'Section of the sample note',
    },
  },
  decorators: [(Story) => <div style={{ width: 700, maxWidth: '100%', padding: 20, background: 'var(--is-surface-super-soft-contrast-background)', borderRadius: 24 }}>{Story()}</div>],
  parameters: {
    docs: {
      description: { component: 'A section of the generated note (web only): title, Copy, and the text. Copy puts the title and text on the clipboard.' },
      source: {
        transform: (_code: string, ctx: { args: Args }) => {
          const s = sampleGeneratedNote.find((x) => x.id === ctx.args.section) ?? sampleGeneratedNote[0];
          return `${generatedNoteItemSpecComment()}\n<GeneratedNoteItem title="${s.title}">\n  {text}\n</GeneratedNoteItem>`;
        },
      },
    },
  },
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Every section of the sample note, as in the Figma "Items" column */
export const AllSections: Story = {
  name: 'All sections',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {sampleGeneratedNote.map((s) => (
        <GeneratedNoteItem key={s.id} title={s.title}>
          {s.text}
        </GeneratedNoteItem>
      ))}
    </div>
  ),
};
