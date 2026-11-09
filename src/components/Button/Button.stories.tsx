import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button, type ButtonSize, type ButtonVariant } from './Button';

/** Simple 16×16 placeholder icon for the stories; scales with the button size. */
const PlaceholderIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="8" cy="8" r="6" strokeDasharray="2.5 2" />
  </svg>
);

const variants: ButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'destructive-outline'];
const sizes: ButtonSize[] = ['mini', 'small', 'regular', 'big', 'xl', 'xxl'];
const states = ['default', 'active', 'focus', 'disabled'] as const;

const variantLabel: Record<ButtonVariant, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  outline: 'Outline',
  ghost: 'Ghost',
  destructive: 'Destructive Primary',
  'destructive-outline': 'Destructive Outline',
};

const label = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-fg-low-primary)' } as const;

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    onClick: fn(),
    children: 'Button CTA',
    variant: 'primary',
    size: 'regular',
    rounded: false,
    disabled: false,
    iconLeft: <PlaceholderIcon />,
    iconRight: <PlaceholderIcon />,
  },
  argTypes: {
    variant: { control: 'select', options: variants },
    size: { control: 'inline-radio', options: sizes },
    rounded: { control: 'boolean' },
    iconLeft: { control: false },
    iconRight: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Change every option from the Controls panel. */
export const Playground: Story = {};

export const Primary: Story = {};

export const Secondary: Story = { args: { variant: 'secondary' } };

export const Outline: Story = { args: { variant: 'outline' } };

export const Ghost: Story = { args: { variant: 'ghost' } };

export const DestructivePrimary: Story = { name: 'Destructive Primary', args: { variant: 'destructive' } };

export const DestructiveOutline: Story = { name: 'Destructive Outline', args: { variant: 'destructive-outline' } };

export const Rounded: Story = { args: { rounded: true } };

export const Disabled: Story = { args: { disabled: true } };

export const WithoutIcons: Story = { args: { iconLeft: undefined, iconRight: undefined } };

/** Every variant in every state, square and rounded — mirrors the Figma component sheet. */
export const AllVariantsAndStates: Story = {
  name: 'All variants & states',
  parameters: { layout: 'padded', controls: { disable: true } },
  render: (args) => (
    <div style={{ display: 'grid', gap: 32 }}>
      {variants.map((variant) => (
        <div key={variant} style={{ display: 'grid', gap: 12 }}>
          <div style={{ ...label, fontWeight: 600, color: 'var(--is-fg-high-primary)' }}>{variantLabel[variant]}</div>
          {[false, true].map((rounded) => (
            <div key={String(rounded)} style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              {states.map((state) => (
                <div key={state} style={{ display: 'grid', gap: 6, justifyItems: 'start' }}>
                  {!rounded && <span style={label}>{state[0].toUpperCase() + state.slice(1)}</span>}
                  <Button
                    {...args}
                    variant={variant}
                    rounded={rounded}
                    disabled={state === 'disabled'}
                    data-state={state === 'active' || state === 'focus' ? state : undefined}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Mini 20 · Small 32 · Regular 40 · Big 50 · XL 60 · XXL 80 — with two icons and with one. */
export const Sizes: Story = {
  parameters: { layout: 'padded', controls: { include: ['variant'] } },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gap: '16px 32px', alignItems: 'center', justifyContent: 'start' }}>
      {sizes.map((size) => (
        <div key={size} style={{ display: 'contents' }}>
          <span style={{ ...label, textAlign: 'right' }}>{size === 'xl' || size === 'xxl' ? size.toUpperCase() : size[0].toUpperCase() + size.slice(1)}</span>
          <div><Button {...args} size={size} /></div>
          <div><Button {...args} size={size} rounded iconLeft={undefined} /></div>
        </div>
      ))}
    </div>
  ),
};
