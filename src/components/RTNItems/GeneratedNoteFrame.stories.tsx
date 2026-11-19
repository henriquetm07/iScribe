import type { Meta, StoryObj } from '@storybook/react-vite';
import { GeneratedNoteFrame, type GeneratedNoteTab } from './GeneratedNote';
import { generatedNoteFrameSpecComment } from './GeneratedNote.docs';
import { sampleGeneratedNote, sampleTranscript } from './sampleGeneratedNote';

type Args = { tab: GeneratedNoteTab };

const Frame = ({ tab }: Args) => (
  <GeneratedNoteFrame key={tab} defaultTab={tab} sections={sampleGeneratedNote} transcript={sampleTranscript} />
);

const meta = {
  title: 'Components/RTN Notes/RTN Main Frame (Generated Note)',
  component: Frame,
  args: { tab: 'note' },
  argTypes: {
    tab: { control: 'inline-radio', options: ['transcript', 'note'], labels: { transcript: 'Transcript', note: 'Note' } },
  },
  decorators: [(Story) => <div style={{ width: 600, maxWidth: '100%' }}>{Story()}</div>],
  parameters: {
    docs: {
      description: {
        component:
          'The generated note panel (web only): Transcript · Note tabs, Copy Transcript / Copy All, the transcript with its search, or the note sections.',
      },
      source: {
        transform: (_code: string, ctx: { args: Args }) =>
          `${generatedNoteFrameSpecComment(ctx.args.tab)}\n<GeneratedNoteFrame\n  defaultTab="${ctx.args.tab}"\n  sections={sections}\n  transcript={transcript}\n/>`,
      },
    },
  },
} satisfies Meta<typeof Frame>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Note: the generated sections, each with its own Copy; Copy All copies the whole note */
export const Note: Story = {};

/** Transcript: type in the search to highlight the matches */
export const Transcript: Story = { args: { tab: 'transcript' } };

/** Searching the transcript */
export const Search: Story = {
  args: { tab: 'transcript' },
  render: () => <GeneratedNoteFrame defaultTab="transcript" defaultSearch="follow-up" sections={sampleGeneratedNote} transcript={sampleTranscript} />,
};
