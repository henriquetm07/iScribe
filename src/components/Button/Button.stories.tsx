import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Icon } from '../../icons/Icon';
import { iconNames, type IconName } from '../../icons/icons';
import { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from './Button';
import { allVariantsSpec, buttonSpecComment, sizesSpec } from './Button.docs';

/** Story-only controls: switch each icon on or off, and pick it from Foundations / Icons. */
type StoryArgs = ButtonProps & {
  showIconLeft: boolean;
  showIconRight: boolean;
  iconLeftName: IconName;
  iconRightName: IconName;
};

/** Turns the story args into real Button props, adding or removing each icon. */
const toButtonProps = ({ showIconLeft, showIconRight, iconLeftName, iconRightName, ...props }: StoryArgs): ButtonProps => ({
  ...props,
  iconLeft: showIconLeft ? <Icon name={iconLeftName} /> : undefined,
  iconRight: showIconRight ? <Icon name={iconRightName} /> : undefined,
});

/** In "Show code", replace the rendered icon markup with the matching <Icon name="…" /> call. */
const showIconMarkup = (code: string, prop: 'iconLeft' | 'iconRight', name: IconName) => {
  const start = code.indexOf(`${prop}={`);
  if (start < 0) return code;
  let depth = 0;
  let end = start + prop.length + 1;
  for (; end < code.length; end++) {
    if (code[end] === '{') depth++;
    else if (code[end] === '}' && --depth === 0) break;
  }
  return `${code.slice(0, start)}${prop}={<Icon name="${name}" />}${code.slice(end + 1)}`;
};

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
  title: 'Simple Components/Button',
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
    iconLeftName: 'placeholder',
    iconRightName: 'placeholder',
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
    iconLeftName: {
      name: 'icon left',
      description: 'Any icon from Foundations / Icons. In code: `iconLeft={<Icon name="…" />}`.',
      control: 'select',
      options: iconNames,
      if: { arg: 'showIconLeft' },
      table: { category: 'Icons' },
    },
    iconRightName: {
      name: 'icon right',
      description: 'Any icon from Foundations / Icons. In code: `iconRight={<Icon name="…" />}`.',
      control: 'select',
      options: iconNames,
      if: { arg: 'showIconRight' },
      table: { category: 'Icons' },
    },
    iconLeft: { control: false, table: { disable: true } },
    iconRight: { control: false, table: { disable: true } },
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
          let jsx = code.replace(/^(\s*\/\*[\s\S]*?\*\/\s*)+/, '');
          // Production builds minify names: show each icon as <Icon name="…" /> and drop the Storybook click spy.
          jsx = showIconMarkup(jsx, 'iconLeft', ctx.args.iconLeftName ?? 'placeholder');
          jsx = showIconMarkup(jsx, 'iconRight', ctx.args.iconRightName ?? 'placeholder');
          jsx = jsx.replace(/\n\s*onClick=\{[^}]*\}\}?/g, '');
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
  parameters: { layout: 'padded', controls: { include: ['showIconLeft', 'iconLeftName', 'showIconRight', 'iconRightName', 'children', 'size'] } },
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
  parameters: { layout: 'padded', controls: { include: ['showIconLeft', 'iconLeftName', 'showIconRight', 'iconRightName', 'variant', 'children'] } },
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
