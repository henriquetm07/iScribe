import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RecordFocusMode, type RecordFocusModeProps } from './RecordFocusMode';
import type { RecordState } from './RecordParts';
import { focusModeSpecComment } from './Record.docs';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;

const meta = {
  title: 'Components/Record/Focus Mode',
  component: RecordFocusMode,
  args: { device: 'iphone', state: 'idle', duration: 30, position: 0, showDelete: false, onStateChange: fn() },
  argTypes: {
    device: { control: 'inline-radio', options: ['iphone', 'ipad'] },
    state: { control: 'select', options: ['idle', 'recording', 'paused', 'playing'] },
    duration: { control: { type: 'number', min: 1, max: 600, step: 1 } },
    position: { control: { type: 'number', min: 0, max: 600, step: 1 } },
    onStateChange: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => <RecordFocusMode key={JSON.stringify({ ...args, onStateChange: 0 })} {...args} />,
  parameters: {
    docs: {
      source: {
        transform: (code: string, ctx: { args: RecordFocusModeProps }) =>
          `${focusModeSpecComment(ctx.args)}\n${code.replace(/\n\s*onStateChange=\{[^}]*\}\}?/g, '')}`,
      },
    },
  },
} satisfies Meta<typeof RecordFocusMode>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Try it: tap the mic to record, tap again to stop, then play it back. */
export const Default: Story = {};

export const Recording: Story = { args: { state: 'recording', duration: 0 } };

export const PlaybackPaused: Story = { name: 'Playback / Paused', args: { state: 'paused' } };

export const PlaybackPlaying: Story = { name: 'Playback / Playing', args: { state: 'playing', position: 15 } };

export const WithDelete: Story = { name: 'Play / Pause / Delete', args: { state: 'paused', position: 15, showDelete: true } };

export const IPad: Story = { name: 'iPad', args: { device: 'ipad', state: 'paused', position: 15 } };

/** iPhone states side by side — mirrors the Figma "Record Feature (Focus Mode)" sheet. */
export const AllStates: Story = {
  name: 'All states',
  parameters: { controls: { include: ['device'] } },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
      {(
        [
          ['Default', 'idle', 0],
          ['Recording', 'recording', 0],
          ['Playback / Paused', 'paused', 0],
          ['Playback / Playing', 'paused', 15],
        ] as [string, RecordState, number][]
      ).map(([label, state, pos]) => (
        <div key={label} style={{ display: 'grid', gap: 6, justifyItems: 'center' }}>
          <span style={caption}>{label}</span>
          <RecordFocusMode device={args.device} state={state} duration={30} position={pos} style={{ minHeight: 380 }} />
        </div>
      ))}
    </div>
  ),
};
