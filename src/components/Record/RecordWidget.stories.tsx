import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { RecordDevice, RecordState } from './RecordParts';
import { RecordWidget, type RecordWidgetProps } from './RecordWidget';
import { recordWidgetSpecComment } from './Record.docs';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;

const meta = {
  title: 'Components/Record/Record Widget',
  component: RecordWidget,
  args: {
    device: 'iphone',
    state: 'idle',
    duration: 30,
    position: 0,
    showDelete: false,
    width: 396,
    onStateChange: fn(),
  },
  argTypes: {
    device: { control: 'inline-radio', options: ['iphone', 'ipad'] },
    state: { control: 'select', options: ['idle', 'recording', 'paused', 'playing'] },
    duration: { control: { type: 'number', min: 1, max: 600, step: 1 } },
    position: { control: { type: 'number', min: 0, max: 600, step: 1 } },
    width: { control: { type: 'number', min: 300, max: 700, step: 10 } },
    onStateChange: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  // Restart the widget when a control changes, so it starts from the chosen state
  render: (args) => <RecordWidget key={JSON.stringify({ ...args, onStateChange: 0 })} {...args} />,
  parameters: {
    docs: {
      source: {
        transform: (code: string, ctx: { args: RecordWidgetProps }) =>
          `${recordWidgetSpecComment(ctx.args)}\n${code.replace(/\n\s*onStateChange=\{[^}]*\}\}?/g, '')}`,
      },
    },
  },
} satisfies Meta<typeof RecordWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Try it: Start Recording, Stop, then play, drag the bar, Resume. */
export const Default: Story = {};

export const Recording: Story = { args: { state: 'recording', duration: 0 } };

export const PlaybackPaused: Story = { name: 'Playback / Paused', args: { state: 'paused' } };

export const PlaybackPlaying: Story = { name: 'Playback / Playing', args: { state: 'playing', position: 15 } };

export const WithDelete: Story = { name: 'Delete', args: { state: 'paused', position: 15, showDelete: true } };

export const IPad: Story = { name: 'iPad', args: { device: 'ipad', state: 'paused', position: 15 } };

/** Every state on iPhone and iPad — mirrors the Figma "Record Widget" sheet. */
export const AllStates: Story = {
  name: 'All devices & states',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 396px', gap: '20px 24px', alignItems: 'center' }}>
      {(['iphone', 'ipad'] as RecordDevice[]).map((device) =>
        (
          [
            ['Default', 'idle', false, 0],
            ['Recording', 'recording', false, 0],
            ['Playback / Paused', 'paused', false, 0],
            ['Playback / Playing', 'paused', false, 15],
            ['Delete', 'paused', true, 15],
          ] as [string, RecordState, boolean, number][]
        ).map(([label, state, del, pos]) => (
          <div key={device + label} style={{ display: 'contents' }}>
            <span style={{ ...caption, textAlign: 'right' }}>
              {device === 'ipad' ? 'iPad' : 'iPhone'} · {label}
            </span>
            <RecordWidget device={device} state={state} duration={state === 'recording' ? 30 : 30} position={pos} showDelete={del} />
          </div>
        )),
      )}
    </div>
  ),
};
