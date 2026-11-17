import type { Meta, StoryObj } from '@storybook/react-vite';
import { Animation } from './Animation';
import { animations } from './animations';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;

const meta = {
  title: 'Animations/Loading Appointment',
  component: Animation,
  args: { name: 'loading-appointment', theme: 'auto', fit: 'contain' },
  argTypes: {
    name: { table: { disable: true } },
    theme: { control: 'inline-radio', options: ['auto', 'light', 'dark'] },
    fit: { control: 'inline-radio', options: ['contain', 'cover'] },
    width: { table: { disable: true } },
    height: { table: { disable: true } },
    loop: { table: { disable: true } },
    title: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: { component: `${animations['loading-appointment'].description}\n\n\`<Animation name="loading-appointment" />\` follows light / dark mode on its own.` },
    },
  },
} satisfies Meta<typeof Animation>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Follows the light / dark toggle. Pick a version in Controls to force one. */
export const Default: Story = {};

/** Both versions, each on its own mode's background. */
export const LightAndDark: Story = {
  name: 'Light and dark',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {(['light', 'dark'] as const).map((theme) => (
        <div key={theme} data-theme={theme} style={{ display: 'grid', gap: 8 }}>
          <span style={caption}>{theme === 'light' ? 'Light mode' : 'Dark mode'}</span>
          <div style={{ borderRadius: 20, overflow: 'hidden', background: 'var(--is-background-base-background)', lineHeight: 0 }}>
            <Animation name="loading-appointment" theme={theme} />
          </div>
        </div>
      ))}
    </div>
  ),
};
