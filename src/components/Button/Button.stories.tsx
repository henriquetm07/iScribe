import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from './Button';
import { allVariantsSpec, buttonSpecComment, sizesSpec } from './Button.docs';

/** Simple 16×16 placeholder icon for the stories; scales with the button size. */
const PlaceholderIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="8" cy="8" r="6" strokeDasharray="2.5 2" />
  </svg>
);

/** Story-only toggles that switch the left and right icons on and off independently. */
type StoryArgs = ButtonProps & {
  showIconLeft: boolean;
  showIconRight: boolean;
};

/** Turns the story args into real Button props, adding or removing each icon. */
const toButtonProps = ({ showIconLeft, showIconRight, ...props }: StoryArgs): ButtonProps => ({
  ...props,
  iconLeft: showIconLeft ? props.iconLeft ?? <PlaceholderIcon /> : undefined,
  iconRight: showIconRight ? props.iconRight ?? <PlaceholderIcon /> : undefined,
});

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

const label = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;

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
    showIconLeft: true,
    showIconRight: true,
  },
  argTypes: {
    showIconLeft: {
      description: 'Show an icon before the label (story control; in code, pass `iconLeft`).',
      control: 'boolean',
      table: { category: 'Icons' },
    },
    showIconRight: {
      description: 'Show an icon after the label (story control; in code, pass `iconRight`).',
      control: 'boolean',
      table: { category: 'Icons' },
    },
    iconLeft: { control: false, table: { category: 'Icons' } },
    iconRight: { control: false, table: { category: 'Icons' } },
    variant: { control: 'select', options: variants },
    size: { control: 'inline-radio', options: sizes },
    rounded: { control: 'boolean' },
  },
  render: (args) => <Button {...toButtonProps(args)} />,
  parameters: {
    docs: {
      source: {
        /*
         * "Show code" explains what each setting means: above the JSX it lists the Figma variables
         * the button uses (colors, font size, corner radius, hover behaviour…) with their resolved values.
         */
        transform: (code: string, ctx: { id: string; args: StoryArgs }) => {
          if (ctx.id.endsWith('--all-variants-and-states')) return allVariantsSpec();
          if (ctx.id.endsWith('--sizes')) return sizesSpec();
          // Storybook can run this more than once on the same snippet, so drop any spec added earlier.
          const jsx = code
            .replace(/^(\s*\/\*[\s\S]*?\*\/\s*)+/, '')
            // Production builds minify names: show the icon slot and drop the Storybook click spy.
            .replace(/(icon(?:Left|Right))=\{<\w+ \/>\}/g, '$1={<YourIcon />}')
            .replace(/\n\s*onClick=\{[^}]*\}\}?/g, '');
          return `${buttonSpecComment(ctx.args)}\n${jsx}`;
        },
      },
    },
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Change every option from the Controls panel, including each icon on its own. */
export const Playground: Story = {};

export const Primary: Story = {};

export const Secondary: Story = { args: { variant: 'secondary' } };

export const Outline: Story = { args: { variant: 'outline' } };

export const Ghost: Story = { args: { variant: 'ghost' } };

export const DestructivePrimary: Story = { name: 'Destructive Primary', args: { variant: 'destructive' } };

export const DestructiveOutline: Story = { name: 'Destructive Outline', args: { variant: 'destructive-outline' } };

export const Rounded: Story = { args: { rounded: true } };

export const Disabled: Story = { args: { disabled: true } };

export const IconLeftOnly: Story = { name: 'Icon left only', args: { showIconLeft: true, showIconRight: false } };

export const IconRightOnly: Story = { name: 'Icon right only', args: { showIconLeft: false, showIconRight: true } };

export const WithoutIcons: Story = { args: { showIconLeft: false, showIconRight: false } };

/** Every variant in every state, square and rounded — mirrors the Figma component sheet. Use the showIconLeft / showIconRight controls to change the whole sheet. */
export const AllVariantsAndStates: Story = {
  name: 'All variants & states',
  parameters: { layout: 'padded', controls: { include: ['showIconLeft', 'showIconRight', 'children', 'size'] } },
  render: (args) => {
    const buttonProps = toButtonProps(args);
    return (
      <div style={{ display: 'grid', gap: 32 }}>
        {variants.map((variant) => (
          <div key={variant} style={{ display: 'grid', gap: 12 }}>
            <div style={{ ...label, fontWeight: 600, color: 'var(--is-foreground-high-contrast-primary-foreground)' }}>{variantLabel[variant]}</div>
            {[false, true].map((rounded) => (
              <div key={String(rounded)} style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                {states.map((state) => (
                  <div key={state} style={{ display: 'grid', gap: 6, justifyItems: 'start' }}>
                    {!rounded && <span style={label}>{state[0].toUpperCase() + state.slice(1)}</span>}
                    <Button
                      {...buttonProps}
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
    );
  },
};

/** Mini 20 · Small 30 · Regular 40 · Big 50 · XL 60 · XXL 80 — square and rounded. */
export const Sizes: Story = {
  parameters: { layout: 'padded', controls: { include: ['showIconLeft', 'showIconRight', 'variant', 'children'] } },
  render: (args) => {
    const buttonProps = toButtonProps(args);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gap: '16px 32px', alignItems: 'center', justifyContent: 'start' }}>
        {sizes.map((size) => (
          <div key={size} style={{ display: 'contents' }}>
            <span style={{ ...label, textAlign: 'right' }}>{size === 'xl' || size === 'xxl' ? size.toUpperCase() : size[0].toUpperCase() + size.slice(1)}</span>
            <div><Button {...buttonProps} size={size} /></div>
            <div><Button {...buttonProps} size={size} rounded /></div>
          </div>
        ))}
      </div>
    );
  },
};
