import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SendSlider, type BottomTabDevice, type SendSliderProps } from './SendSlider';
import { sendSliderSpecComment } from './BottomTab.docs';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;

const meta = {
  title: 'Complex Components/Bottom Tab/Send Slider',
  component: SendSlider,
  args: { device: 'iphone', label: 'Send to EHR', sentLabel: 'Sent to EHR', disabled: false, onSend: fn() },
  argTypes: {
    device: { control: 'inline-radio', options: ['iphone', 'ipad'] },
    sent: { control: 'boolean' },
    progress: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
  },
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        transform: (code: string, ctx: { args: SendSliderProps }) => {
          const jsx = code.replace(/^(\s*\/\*[\s\S]*?\*\/\s*)+/, '').replace(/\n\s*on[A-Z]\w*=\{[^}]*\}\}?/g, '');
          return `${sendSliderSpecComment(ctx.args)}\n${jsx}`;
        },
      },
    },
  },
  render: (args) => (
    <div style={{ width: args.device === 'ipad' ? 320 : 370, display: 'flex' }}>
      <SendSlider {...args} />
    </div>
  ),
} satisfies Meta<typeof SendSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Drag the knob all the way to the right to send. Keyboard: Tab to the knob, then Enter. */
export const IPhone: Story = { name: 'iPhone' };

export const IPad: Story = { name: 'iPad', args: { device: 'ipad' } };

export const Disabled: Story = { args: { disabled: true } };

/** Default, Sliding and Sent for both devices — mirrors the Figma "Send to EHR Slider" sheet. */
export const States: Story = {
  parameters: { layout: 'padded', controls: { include: ['label', 'sentLabel'] } },
  render: (args) => (
    <div style={{ display: 'grid', gap: 28 }}>
      {(['iphone', 'ipad'] as BottomTabDevice[]).map((device) => (
        <div key={device} style={{ display: 'grid', gap: 12 }}>
          <div style={{ ...caption, fontWeight: 600, color: 'var(--is-foreground-high-contrast-primary-foreground)' }}>
            {device === 'ipad' ? 'iPad' : 'iPhone'}
          </div>
          {([
            ['Default', { progress: 0 }],
            ['Sliding', { progress: 0.5 }],
            ['Sent', { sent: true }],
          ] as const).map(([name, state]) => (
            <div key={name} style={{ display: 'grid', gap: 6 }}>
              <span style={caption}>{name}</span>
              <div style={{ width: device === 'ipad' ? 320 : 370, display: 'flex' }}>
                <SendSlider {...args} device={device} {...state} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
