import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { MiniRecordWidget, type MiniRecordState, type MiniRecordWidgetProps } from './MiniRecordWidget';
import type { RecordDevice } from './RecordParts';
import { miniRecordSpecComment } from './Record.docs';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;

const meta = {
  title: 'Components/Record/Mini Record Widget iPhone',
  component: MiniRecordWidget,
  args: { device: 'iphone', state: 'idle', duration: 30, onStateChange: fn() },
  argTypes: {
    device: { control: 'inline-radio', options: ['iphone', 'ipad'] },
    state: { control: 'inline-radio', options: ['idle', 'recording', 'stopped'] },
    duration: { control: { type: 'number', min: 0, max: 600, step: 1 } },
    onStateChange: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => <MiniRecordWidget key={JSON.stringify({ ...args, onStateChange: 0 })} {...args} />,
  parameters: {
    docs: {
      source: {
        transform: (code: string, ctx: { args: MiniRecordWidgetProps }) =>
          `${miniRecordSpecComment(ctx.args)}\n${code.replace(/\n\s*onStateChange=\{[^}]*\}\}?/g, '')}`,
      },
    },
  },
} satisfies Meta<typeof MiniRecordWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Try it: tap the mic to record, then stop. */
export const Default: Story = {};

export const Recording: Story = { args: { state: 'recording', duration: 0 } };

export const Playback: Story = { args: { state: 'stopped' } };

export const IPad: Story = { name: 'iPad', args: { device: 'ipad', state: 'recording', duration: 0 } };

/** Every state on iPhone and iPad — mirrors the Figma "Mini Record Widget" sheet. */
export const AllStates: Story = {
  name: 'All devices & states',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 220px', gap: '20px 24px', alignItems: 'center', justifyItems: 'end' }}>
      {(['iphone', 'ipad'] as RecordDevice[]).map((device) =>
        (['idle', 'recording', 'stopped'] as MiniRecordState[]).map((state) => (
          <div key={device + state} style={{ display: 'contents' }}>
            <span style={caption}>
              {device === 'ipad' ? 'iPad' : 'iPhone'} · {{ idle: 'Default', recording: 'Recording', stopped: 'Playback' }[state]}
            </span>
            <MiniRecordWidget device={device} state={state} duration={state === 'idle' ? 0 : 30} />
          </div>
        )),
      )}
    </div>
  ),
};
