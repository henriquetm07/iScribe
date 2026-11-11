import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Playback, RecordRoundButton, RecordTextButton, RecordTime, Waves, type PlaybackProps, type RecordDevice } from './RecordParts';
import { RecordStartButton } from './RecordWidget';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;
const grid = { display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '18px 20px', alignItems: 'center', justifyItems: 'start' } as const;

/** The playback bar keeps its own position here so you can drag it */
const LivePlayback = (args: PlaybackProps) => {
  const [pos, setPos] = useState(args.position);
  return <Playback {...args} position={pos} onSeek={setPos} />;
};

const meta = {
  title: 'Components/Record/Parts',
  component: Playback,
  args: { device: 'iphone', position: 15, duration: 30, width: 339 },
  argTypes: {
    device: { control: 'inline-radio', options: ['iphone', 'ipad'] },
    position: { control: { type: 'number', min: 0, max: 600, step: 1 } },
    duration: { control: { type: 'number', min: 1, max: 600, step: 1 } },
    width: { control: { type: 'number', min: 120, max: 600, step: 1 } },
    onSeek: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The pieces the Record Widget, Mini Record Widget and Focus Mode are built from (Figma "--Record Feature"): Playback, Waves, Time progression and the record buttons.',
      },
    },
  },
} satisfies Meta<typeof Playback>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Playback": drag the knob or use ← → to seek. */
export const PlaybackBar: Story = {
  name: 'Playback',
  render: (args) => <LivePlayback key={JSON.stringify(args)} {...args} />,
};

/** Figma "Waves": iPhone / iPad default (long) and mini. The bars pulse while recording. */
export const WavesSheet: Story = {
  name: 'Waves',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={grid}>
      <span style={caption}>Default</span>
      <Waves style={{ width: 513 }} />
      {(['iphone', 'ipad'] as RecordDevice[]).map((d) => (
        <div key={d} style={{ display: 'contents' }}>
          <span style={caption}>Mini · {d === 'ipad' ? 'iPad' : 'iPhone'}</span>
          <Waves size="mini" device={d} />
        </div>
      ))}
      <span style={caption}>Web · Mini</span>
      <Waves bars={18} />
    </div>
  ),
};

/** Figma "Time progression": widget sizes and the large Focus Mode clock */
export const TimeSheet: Story = {
  name: 'Time progression',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={grid}>
      <span style={caption}>iPhone</span>
      <RecordTime seconds={30} recording />
      <span style={caption}>iPad</span>
      <RecordTime seconds={30} device="ipad" recording />
      <span style={caption}>Focus · iPhone</span>
      <RecordTime seconds={0} size="focus" />
      <span style={caption}>Focus · iPad</span>
      <RecordTime seconds={0} device="ipad" size="focus" />
    </div>
  ),
};

/** Figma "Record Button", "Stop/Resume" and "Play/Pause/Delete" */
export const Buttons: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ ...grid, gridTemplateColumns: 'auto 396px' }}>
      <span style={caption}>Record · iPhone</span>
      <RecordStartButton />
      <span style={caption}>Record · iPad</span>
      <div style={{ justifySelf: 'center' }}>
        <RecordStartButton device="ipad" />
      </div>
      <span style={caption}>Record · Chrome Extension</span>
      <RecordStartButton device="chrome" />
      <span style={caption}>Stop / Resume</span>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <RecordRoundButton icon="stop-flat" label="Stop" variant="destructive" size={40} iconSize={16} />
        <RecordTextButton height={40} fontSize={13} radius={1000} paddingX={12} gap={6}>Resume</RecordTextButton>
        <RecordRoundButton icon="stop-flat" label="Stop" variant="destructive" size={60} iconSize={22} />
        <RecordTextButton height={60} fontSize={15} radius={1000} paddingX={20} gap={12}>Resume</RecordTextButton>
      </div>
      <span style={caption}>Play / Pause / Delete</span>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <RecordRoundButton icon="play-flat" label="Play" size={40} iconSize={16} />
        <RecordRoundButton icon="pause-flat" label="Pause" size={40} iconSize={16} />
        <RecordRoundButton icon="play-flat" label="Play" size={60} iconSize={22} />
        <RecordRoundButton icon="pause-flat" label="Pause" size={60} iconSize={22} />
        <RecordRoundButton icon="trash" label="Delete" size={60} iconSize={22} iconColor="var(--is-status-foreground-alert)" />
      </div>
      <span style={caption}>Focus Mode</span>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <RecordRoundButton icon="mic" label="Record" variant="primary" size={80} iconSize={28} />
        <RecordRoundButton icon="stop-flat" label="Stop" variant="destructive" size={80} iconSize={28} />
        <RecordRoundButton icon="mic" label="Resume" size={80} iconSize={28} />
        <RecordRoundButton icon="mic" label="Record" variant="primary" size={100} iconSize={28} />
      </div>
    </div>
  ),
};
