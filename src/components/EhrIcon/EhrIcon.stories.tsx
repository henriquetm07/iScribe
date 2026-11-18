import type { Meta, StoryObj } from '@storybook/react-vite';
import { EhrIcon, EhrLogo, ehrs, type EhrIconProps } from './EhrIcon';
import { ehrIconSpecComment } from './EhrIcon.docs';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;
const label = { fontFamily: 'var(--is-font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--is-foreground-high-contrast-primary-foreground)' } as const;

const meta = {
  title: 'Components/EHR Icon',
  component: EhrIcon,
  args: { ehr: 'athena', integrated: true },
  argTypes: {
    ehr: { control: 'select', options: ehrs.map((e) => e.value) },
    integrated: { control: 'boolean' },
    size: { table: { disable: true } },
    title: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  parameters: {
    docs: {
      source: {
        transform: (code: string, ctx: { args: EhrIconProps }) => `${ehrIconSpecComment(ctx.args.ehr, ctx.args.integrated)}\n${code.replace(/^(\s*\/\*[\s\S]*?\*\/\s*)+/, '')}`,
      },
    },
  },
} satisfies Meta<typeof EhrIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pick an EHR and whether the appointment is integrated in Controls. */
export const Default: Story = {};

/** Every EHR logo (Figma "EHR Logos"), and the two EHR Icon states. */
export const Logos: Story = {
  name: 'EHR logos',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 64, alignItems: 'flex-start' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '20px 24px', alignItems: 'center', justifyItems: 'end' }}>
        <span style={caption}>EHR logos</span>
        <span />
        {ehrs.map(({ value, label: name }) => (
          <div key={value} style={{ display: 'contents' }}>
            <span style={label}>{name}</span>
            <EhrLogo ehr={value} title="" />
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '20px 24px', alignItems: 'center', justifyItems: 'end' }}>
        <span style={caption}>EHR Icon</span>
        <span />
        <span style={label}>Not integrated</span>
        <EhrIcon title="" />
        <span style={label}>Integrated</span>
        <EhrIcon integrated title="" />
      </div>
    </div>
  ),
};

const Row = () => (
  <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
    <EhrIcon />
    {ehrs.map(({ value }) => (
      <EhrIcon key={value} ehr={value} integrated />
    ))}
  </div>
);

/** As in the Figma sheet: not integrated, then each EHR integrated, in light and dark mode. */
export const LightAndDark: Story = {
  name: 'Light and dark',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {(['light', 'dark'] as const).map((theme) => (
        <div key={theme} data-theme={theme} style={{ display: 'grid', gap: 8 }}>
          <span style={caption}>{theme === 'light' ? 'Light mode' : 'Dark mode'}</span>
          <div style={{ padding: '24px 32px', borderRadius: 20, background: theme === 'light' ? 'var(--is-color-pure-white)' : 'var(--is-background-base-background)' }}>
            <Row />
          </div>
        </div>
      ))}
    </div>
  ),
};
