import type { Meta, StoryObj } from '@storybook/react-vite';
import { GeneratedNoteFrame, type GeneratedNoteTab } from './GeneratedNote';
import { generatedNoteFrameSpecComment } from './GeneratedNote.docs';
import { sampleGeneratedNote, sampleTranscript } from './sampleGeneratedNote';

type Args = { tab: GeneratedNoteTab; copyable: boolean };

const Frame = ({ tab, copyable }: Args) => (
  <GeneratedNoteFrame key={tab} defaultTab={tab} copyable={copyable} sections={sampleGeneratedNote} transcript={sampleTranscript} />
);

const meta = {
  title: 'Components/RTN Notes/RTN Main Frame (Generated Note)',
  component: Frame,
  args: { tab: 'note', copyable: true },
  argTypes: {
    tab: { control: 'inline-radio', options: ['transcript', 'note'], labels: { transcript: 'Transcript', note: 'Note' } },
    copyable: {
      control: 'boolean',
      description: 'Copy buttons: on for patients not integrated with an EHR (the note is copied); off for integrated patients (it is sent to the EHR)',
    },
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
          `${generatedNoteFrameSpecComment(ctx.args.tab)}\n<GeneratedNoteFrame\n  defaultTab="${ctx.args.tab}"${ctx.args.copyable ? '' : '\n  copyable={false}'}\n  sections={sections}\n  transcript={transcript}\n/>`,
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

/** Integrated patient (EHR logo): no copy buttons, the note goes to the EHR with Send to EHR */
export const Integrated: Story = { name: 'Integrated patient', args: { copyable: false } };

/** Searching the transcript */
export const Search: Story = {
  args: { tab: 'transcript' },
  render: () => <GeneratedNoteFrame defaultTab="transcript" defaultSearch="follow-up" sections={sampleGeneratedNote} transcript={sampleTranscript} />,
};
