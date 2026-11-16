import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { formatRTNDate, RTNHeader, RTNHeaderDetails, RTNHeaderPatient, RTNHeaderRecord, type RTNHeaderProps, type RTNPatient } from './RTNHeader';
import { rtnHeaderSpecComment } from './RTNHeader.docs';

/** The patient from the Figma example (sample photo served from .storybook/public/samples) */
const sarah: RTNPatient = {
  firstName: 'Sarah',
  lastName: 'Johnson',
  sex: 'Female',
  dob: '03/15/1982',
  age: 42,
  photo: './samples/patient-sample.jpg',
};

const caption = { margin: '0 0 8px', fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;

/** Story-only: switch the patient between the Figma "Filled in" and "Empty" profiles, and show or hide the check-in note */
type StoryArgs = RTNHeaderProps & { filledIn?: boolean; showCheckedIn?: boolean };

const meta = {
  title: 'Components/RTN Header (Web)',
  component: RTNHeader,
  args: {
    filledIn: true,
    showPhoto: true,
    recordState: 'idle',
    labels: ['Visit', 'Room 12'],
    checkedIn: 'Checked in 11 min ago',
    showCheckedIn: true,
    duration: 160,
    position: 32,
    onMoreClick: fn(),
    onRecordStateChange: fn(),
  },
  argTypes: {
    filledIn: { name: 'filled in', control: 'boolean' },
    showCheckedIn: { name: 'checked in', control: 'boolean' },
    // Set by the stories (Recording, Playback) rather than from Controls
    recordState: { table: { disable: true } },
    duration: { table: { disable: true } },
    position: { table: { disable: true } },
    labels: { table: { disable: true } },
    checkedIn: { table: { disable: true } },
    // Today's date and the current time by default (pass date / time to the component to set them)
    date: { table: { disable: true } },
    time: { table: { disable: true } },
    patient: { table: { disable: true } },
    onMoreClick: { table: { disable: true } },
    onRecordStateChange: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        transform: (code: string, ctx: { args: StoryArgs }) =>
          `${rtnHeaderSpecComment({ ...ctx.args, patient: ctx.args.filledIn === false ? null : sarah })}\n${code
            .replace(/\n\s*on[A-Z]\w*=\{[^}]*\}\}?/g, '')
            .replace(/\n\s*filledIn(=\{[^}]*\})?/g, '')
            .replace(/\n\s*showCheckedIn(=\{[^}]*\})?/g, '')}`,
      },
    },
  },
  render: ({ filledIn = true, showCheckedIn = true, ...args }) => (
    <RTNHeader
      // Restart the record feature when its controls change
      key={`${args.recordState}-${args.duration}-${args.position}`}
      {...args}
      patient={filledIn ? sarah : null}
      checkedIn={showCheckedIn ? args.checkedIn : ''}
    />
  ),
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Try it: Start Recording, then Stop, play, drag the bar and Resume. Click the name or any detail to edit it. */
export const Default: Story = {};

export const Recording: Story = { args: { recordState: 'recording', duration: 0 } };

export const Playback: Story = { args: { recordState: 'paused' } };

/** The patient's profile isn't filled in yet: dotted blanks in place of the name and details. Click any of them to fill it in. */
export const EmptyProfile: Story = { name: 'Empty profile', args: { filledIn: false } };

/** Figma "RTN Header Web Details" on its own. */
export const Details: Story = {
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => <RTNHeaderDetails onMoreClick={fn()} />,
};

/** Figma "RTN Header Web Patient Information": Web and Chrome Extension, filled in and empty. */
export const PatientInformation: Story = {
  name: 'Patient information',
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {(
        [
          ['Web · Filled in', <RTNHeaderPatient key="a" patient={sarah} />],
          ['Web · Empty', <RTNHeaderPatient key="b" />],
          ['Chrome Extension · Filled in', <RTNHeaderPatient key="c" patient={sarah} device="chrome-extension" />],
          ['Chrome Extension · Empty', <RTNHeaderPatient key="d" device="chrome-extension" />],
        ] as const
      ).map(([label, node]) => (
        <div key={label}>
          <p style={caption}>{label}</p>
          {node}
        </div>
      ))}
    </div>
  ),
};

/** Figma "RTN Header Web Record Feature": Default, Recording and Playback (each one runs by itself). */
export const RecordFeature: Story = {
  name: 'Record feature',
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => (
    <div style={{ display: 'grid', gap: 20, maxWidth: 1028 }}>
      {(
        [
          ['Default', 'idle', 0],
          ['Recording', 'recording', 30],
          ['Playback', 'paused', 160],
        ] as const
      ).map(([label, state, duration]) => (
        <div key={label}>
          <p style={caption}>{label}</p>
          <div style={{ display: 'flex' }}>
            <RTNHeaderRecord state={state} duration={duration} position={32} title={`Sarah Johnson • Visit • ${formatRTNDate(new Date())}`} />
          </div>
        </div>
      ))}
    </div>
  ),
};
