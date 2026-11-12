import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { MiniRecordWidget, type MiniRecordState, type MiniRecordWidgetProps } from './MiniRecordWidget';
import { miniRecordSpecComment } from './Record.docs';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;

const meta = {
  title: 'Components/Record/Mini Record Widget Web',
  component: MiniRecordWidget,
  args: { device: 'web', state: 'idle', duration: 30, onStateChange: fn() },
  argTypes: {
    device: { table: { disable: true } },
    state: { control: 'inline-radio', options: ['idle', 'recording', 'stopped'] },
    duration: { control: { type: 'number', min: 0, max: 600, step: 1 } },
    onStateChange: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => <MiniRecordWidget key={JSON.stringify({ ...args, onStateChange: 0 })} {...args} />,
  parameters: {
    docs: {
      description: {
        component:
          'The Mini Record Widget for the web: time and one round button, right-aligned. While recording it shows the web mini waves (18 bars, Figma Waves · Web · Mini).',
      },
      source: {
        transform: (code: string, ctx: { args: MiniRecordWidgetProps }) =>
          `${miniRecordSpecComment(ctx.args)}\n${code.replace(/\n\s*onStateChange=\{[^}]*\}\}?/g, '')}`,
      },
    },
  },
} satisfies Meta<typeof MiniRecordWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Try it: click the mic to record, then stop. */
export const Default: Story = {};

export const Recording: Story = { args: { state: 'recording', duration: 0 } };

export const Playback: Story = { args: { state: 'stopped' } };

/** Every state on the web. */
export const AllStates: Story = {
  name: 'All states',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 260px', gap: '20px 24px', alignItems: 'center', justifyItems: 'end' }}>
      {(['idle', 'recording', 'stopped'] as MiniRecordState[]).map((state) => (
        <div key={state} style={{ display: 'contents' }}>
          <span style={caption}>Web · {{ idle: 'Default', recording: 'Recording', stopped: 'Playback' }[state]}</span>
          <MiniRecordWidget device="web" state={state} duration={state === 'idle' ? 0 : 30} />
        </div>
      ))}
    </div>
  ),
};
