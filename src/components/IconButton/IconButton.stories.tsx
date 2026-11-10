import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { fn } from 'storybook/test';
import type { ButtonSize, ButtonVariant } from '../Button/Button';
import { variantSpecs } from '../Button/Button.docs';
import { IconButton, type IconButtonProps } from './IconButton';
import { iconAllVariantsSpec, iconButtonSpecComment, iconSizesSpec } from './IconButton.docs';

/** Simple demo icons (16×16, currentColor) — pass your own icon in real code. */
const svg = (children: ReactNode) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
const icons = {
  placeholder: svg(<circle cx="8" cy="8" r="6" strokeDasharray="2.5 2" />),
  plus: svg(<path d="M8 3v10M3 8h10" />),
  pencil: svg(<path d="M10.5 2.5l3 3L6 13H3v-3z" />),
  trash: svg(<path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5" />),
  mic: svg(<path d="M8 2a2 2 0 0 1 2 2v4a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2zM4 7.5a4 4 0 0 0 8 0M8 11.5V14" />),
  more: svg(
    <>
      <circle cx="3.5" cy="8" r="0.6" fill="currentColor" />
      <circle cx="8" cy="8" r="0.6" fill="currentColor" />
      <circle cx="12.5" cy="8" r="0.6" fill="currentColor" />
    </>,
  ),
};
type IconName = keyof typeof icons;

/** In "Show code", swap the demo SVG for a placeholder so the snippet stays short. */
const hideIconMarkup = (code: string) => {
  const start = code.indexOf('icon={');
  if (start < 0) return code;
  let depth = 0;
  let end = start + 5;
  for (; end < code.length; end++) {
    if (code[end] === '{') depth++;
    else if (code[end] === '}' && --depth === 0) break;
  }
  return `${code.slice(0, start)}icon={<YourIcon />}${code.slice(end + 1)}`;
};

/** Story args: pick an icon by name; the story turns it into the real `icon` prop. */
type StoryArgs = Omit<IconButtonProps, 'icon'> & { iconName: IconName };
const toProps = ({ iconName, ...props }: StoryArgs): IconButtonProps => ({ ...props, icon: icons[iconName] });

const variants = Object.keys(variantSpecs) as ButtonVariant[];
const sizes: ButtonSize[] = ['mini', 'small', 'regular', 'big', 'xl', 'xxl'];
const states = ['default', 'active', 'focus', 'disabled'] as const;
const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;

const meta = {
  title: 'Components/Icon Button',
  component: IconButton,
  args: {
    onClick: fn(),
    iconName: 'placeholder',
    label: 'Add note',
    variant: 'primary',
    size: 'regular',
    rounded: false,
    disabled: false,
  },
  argTypes: {
    iconName: {
      name: 'icon',
      description: 'Demo icon for the story. In code, pass any icon element to `icon`.',
      control: 'select',
      options: Object.keys(icons),
    },
    icon: { control: false, table: { disable: true } },
    label: { control: 'text' },
    variant: { control: 'select', options: variants },
    size: { control: 'inline-radio', options: sizes },
    rounded: { control: 'boolean' },
  },
  render: (args) => <IconButton {...toProps(args)} />,
  parameters: {
    docs: {
      source: {
        /* "Show code" starts with a readable spec: the Figma variables this icon button uses, with their values. */
        transform: (code: string, ctx: { id: string; args: StoryArgs }) => {
          if (ctx.id.endsWith('--all-variants-and-states')) return iconAllVariantsSpec();
          if (ctx.id.endsWith('--sizes')) return iconSizesSpec();
          const jsx = hideIconMarkup(code.replace(/^(\s*\/\*[\s\S]*?\*\/\s*)+/, '')).replace(/\n\s*onClick=\{[^}]*\}\}?/g, '');
          return `${iconButtonSpecComment(ctx.args)}\n${jsx}`;
        },
      },
    },
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Change every option from the Controls panel. */
export const Playground: Story = {};

export const Primary: Story = {};

export const Secondary: Story = { args: { variant: 'secondary', iconName: 'pencil', label: 'Edit note' } };

export const Outline: Story = { args: { variant: 'outline', iconName: 'more', label: 'More options' } };

export const Ghost: Story = { args: { variant: 'ghost', iconName: 'mic', label: 'Start recording' } };

export const DestructivePrimary: Story = {
  name: 'Destructive Primary',
  args: { variant: 'destructive', iconName: 'trash', label: 'Delete note' },
};

/** Called "Destructive Secondary" in Figma; same look as the Button's Destructive Outline. */
export const DestructiveOutline: Story = {
  name: 'Destructive Outline',
  args: { variant: 'destructive-outline', iconName: 'trash', label: 'Delete note' },
};

export const Rounded: Story = { name: 'Rounded (circle)', args: { rounded: true, iconName: 'plus' } };

export const Disabled: Story = { args: { disabled: true } };

/** Every variant in every state, square and circle — mirrors the Figma component sheet. */
export const AllVariantsAndStates: Story = {
  name: 'All variants & states',
  parameters: { layout: 'padded', controls: { include: ['iconName', 'size'] } },
  render: (args) => {
    const props = toProps(args);
    return (
      <div style={{ display: 'grid', gap: 28 }}>
        {variants.map((variant) => (
          <div key={variant} style={{ display: 'grid', gap: 10 }}>
            <div style={{ ...caption, fontWeight: 600, color: 'var(--is-foreground-high-contrast-primary-foreground)' }}>
              {variantSpecs[variant].label}
            </div>
            {[false, true].map((rounded) => (
              <div key={String(rounded)} style={{ display: 'flex', gap: 28, alignItems: 'flex-end' }}>
                {states.map((state) => (
                  <div key={state} style={{ display: 'grid', gap: 6, justifyItems: 'center', minWidth: 56 }}>
                    {!rounded && <span style={caption}>{state[0].toUpperCase() + state.slice(1)}</span>}
                    <IconButton
                      {...props}
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

/** Mini 20 · Small 30 · Regular 40 · Big 50 · XL 60 · XXL 80 — square and circle. */
export const Sizes: Story = {
  parameters: { layout: 'padded', controls: { include: ['iconName', 'variant'] } },
  render: (args) => {
    const props = toProps(args);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gap: '16px 32px', alignItems: 'center', justifyContent: 'start' }}>
        {sizes.map((size) => (
          <div key={size} style={{ display: 'contents' }}>
            <span style={{ ...caption, textAlign: 'right' }}>
              {size === 'xl' || size === 'xxl' ? size.toUpperCase() : size[0].toUpperCase() + size.slice(1)}
            </span>
            <div><IconButton {...props} size={size} /></div>
            <div><IconButton {...props} size={size} rounded /></div>
          </div>
        ))}
      </div>
    );
  },
};
