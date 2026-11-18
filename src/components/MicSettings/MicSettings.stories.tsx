import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { fn } from 'storybook/test';
import { MicInputLevel, MicSettings, MicSettingsPanel, type MicSettingsProps } from './MicSettings';
import { micSettingsSpecComment } from './MicSettings.docs';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;

/** A level that moves like a voice, for the demos */
const useDemoLevel = (on = true) => {
  const [level, setLevel] = useState(1 / 3);
  useEffect(() => {
    if (!on) return;
    let t = 0;
    const id = window.setInterval(() => {
      t += 1;
      setLevel(Math.max(0.04, 0.3 + 0.22 * Math.sin(t / 2.3) + 0.14 * Math.sin(t * 1.7) + (Math.random() - 0.5) * 0.12));
    }, 90);
    return () => window.clearInterval(id);
  }, [on]);
  return on ? level : 1 / 3;
};

const meta = {
  title: 'Components/Mic Settings',
  component: MicSettings,
  args: {
    defaultOpen: true,
    error: false,
    placement: 'bottom',
    onChange: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    defaultOpen: { name: 'open', control: 'boolean' },
    error: { control: 'boolean' },
    placement: { control: 'inline-radio', options: ['top', 'bottom'] },
    level: { control: { type: 'range', min: 0, max: 1, step: 1 / 24 } },
    open: { table: { disable: true } },
    value: { table: { disable: true } },
    devices: { table: { disable: true } },
    menuOpen: { table: { disable: true } },
    defaultMenuOpen: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    onMenuOpenChange: { table: { disable: true } },
  },
  parameters: {
    docs: {
      source: {
        transform: (code: string, ctx: { args: MicSettingsProps }) =>
          `${micSettingsSpecComment(ctx.args)}\n${code.replace(/^(\s*\/\*[\s\S]*?\*\/\s*)+/, '').replace(/\n\s*on(Change|OpenChange)=\{[^}]*\}\}?/g, '')}`,
      },
    },
  },
} satisfies Meta<typeof MicSettings>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Click the mic: the card opens. Pick a microphone in the dropdown; ×, Escape or a click outside closes it. */
export const Default: Story = {
  render: function Render(args) {
    const live = useDemoLevel(args.level === undefined);
    return (
      <div style={{ padding: args.placement === 'top' ? '360px 16px 16px' : '16px 16px 300px' }}>
        <MicSettings key={`${args.defaultOpen}-${args.error}`} {...args} level={args.level ?? live} />
      </div>
    );
  },
};

/** The selected microphone has a problem: the mic button turns red (Alert), and so do the field and the microphone */
export const WithError: Story = { name: 'Error', args: { error: true } };

/** The card on its own, with the microphone menu open (Selection Active) */
export const SelectionActive: Story = {
  name: 'Selection active',
  parameters: { controls: { disable: true }, docs: { source: { code: '<MicSettingsPanel defaultMenuOpen onClose={() => setOpen(false)} />' } } },
  render: () => (
    <div style={{ padding: '130px 16px 16px' }}>
      <MicSettingsPanel defaultMenuOpen level={1 / 3} onClose={fn()} />
    </div>
  ),
};

/** Every state — mirrors the Figma "Mic Settings" sheet */
export const AllStates: Story = {
  name: 'All states',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: '24px 32px', alignItems: 'end', padding: 16 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <span style={caption}>Default</span>
        <MicSettings />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <span style={caption}>Alert</span>
        <MicSettings error />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <span style={caption}>Open</span>
        <MicSettingsPanel onClose={() => {}} />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <span style={caption}>Open - error</span>
        <MicSettingsPanel error onClose={() => {}} />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <span style={caption}>Selection Active</span>
        <div style={{ paddingTop: 116 }}>
          <MicSettingsPanel defaultMenuOpen onClose={() => {}} />
        </div>
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <span style={caption}>Selection Error</span>
        <div style={{ paddingTop: 116 }}>
          <MicSettingsPanel error defaultMenuOpen onClose={() => {}} />
        </div>
      </div>
      <div style={{ display: 'grid', gap: 8, gridColumn: '1 / -1' }}>
        <span style={caption}>Input level</span>
        <MicInputLevel />
      </div>
    </div>
  ),
};
