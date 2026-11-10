/**
 * Human-readable style reference for the Button, shown in the Storybook "Show code" panel.
 * It mirrors Button.css: every value below is the Figma variable that file uses,
 * resolved through src/styles/variables.ts so the snippet shows real numbers and colors.
 * Keep it in sync with Button.css when the styles change.
 */
import { variableCollections } from '../../styles/variables';
import type { ButtonProps, ButtonSize, ButtonVariant } from './Button';

type Colors = { bg?: string; fg: string; border?: string; borderWidth?: 'stroke' | '1px' };

interface VariantSpec {
  label: string;
  rest: Colors;
  hover: Partial<Colors>;
  focus: Partial<Colors>;
  disabled: Partial<Colors> & { bg?: string | null };
}

const V = (name: string) => `--is-${name}`;

/** Which Figma variables each variant uses in each state (matches Button.css). */
export const variantSpecs: Record<ButtonVariant, VariantSpec> = {
  primary: {
    label: 'Primary',
    rest: { bg: V('button-primary-default-bg'), fg: V('foreground-high-contrast-secondary-foreground') },
    hover: { bg: V('button-primary-active-bg') },
    focus: { bg: V('button-primary-active-bg'), border: V('button-accent') },
    disabled: { bg: V('button-disabled-bg'), fg: V('foreground-medium-contrast-secondary-foreground') },
  },
  secondary: {
    label: 'Secondary',
    rest: { bg: V('button-secondary-default-bg'), fg: V('foreground-high-contrast-primary-foreground'), border: V('button-secondarystroke'), borderWidth: '1px' },
    hover: { bg: V('button-secondary-active-bg') },
    focus: { bg: V('button-secondary-active-bg'), border: V('button-accent') },
    disabled: { bg: V('button-disabled-bg'), fg: V('foreground-medium-contrast-secondary-foreground') },
  },
  outline: {
    label: 'Outline',
    rest: { fg: V('foreground-high-contrast-primary-foreground'), border: V('foreground-high-contrast-primary-foreground'), borderWidth: 'stroke' },
    hover: { bg: V('button-ghost-active-bg') },
    focus: { bg: V('button-outline-active-bg'), border: V('button-accent') },
    disabled: { bg: V('button-disabled-bg'), fg: V('foreground-medium-contrast-secondary-foreground'), border: V('foreground-medium-contrast-secondary-foreground') },
  },
  ghost: {
    label: 'Ghost',
    rest: { fg: V('foreground-high-contrast-primary-foreground') },
    hover: { bg: V('button-ghost-active-bg') },
    focus: { bg: V('button-ghost-active-bg'), border: V('button-accent') },
    disabled: { bg: null, fg: V('foreground-low-contrast-primary-foreground') },
  },
  destructive: {
    label: 'Destructive Primary',
    rest: { bg: V('button-destructive'), fg: V('foreground-high-contrast-secondary-foreground-2') },
    hover: { bg: V('button-destructive-acive') },
    focus: { bg: V('button-destructive-acive'), border: V('button-accent') },
    disabled: { bg: V('button-disabled-bg'), fg: V('foreground-medium-contrast-secondary-foreground') },
  },
  'destructive-outline': {
    label: 'Destructive Outline',
    rest: { fg: V('button-destructive'), border: V('button-destructive'), borderWidth: 'stroke' },
    hover: { bg: V('button-ghost-active-bg'), fg: V('button-destructive-acive'), border: V('button-destructive-acive') },
    focus: { bg: V('button-ghost-active-bg'), fg: V('button-destructive-acive'), border: V('button-accent') },
    disabled: { bg: V('button-disabled-bg'), fg: V('foreground-medium-contrast-secondary-foreground'), border: V('foreground-medium-contrast-secondary-foreground') },
  },
};

export const sizeLabel: Record<ButtonSize, string> = { mini: 'Mini', small: 'Small', regular: 'Regular', big: 'Big', xl: 'XL', xxl: 'XXL' };

// ---- variable lookups -------------------------------------------------------

const semantic = new Map(
  (variableCollections.find((c) => c.name === 'Semantic Colors')?.vars ?? []).map((v) => [v.cssVar, v]),
);
const dims = variableCollections.find((c) => c.name === 'Buttons Dimensions');

const shortName = (label: string) => label.split('/').pop() ?? label;
const hex = (value?: string) => (value ?? '').toUpperCase().replace('RGBA', 'rgba');

/** "var(--is-x) → #1D1C1E Grey 4 · dark #FFFFFF Pure White" */
export const color = (cssVar?: string | null) => {
  if (!cssVar) return 'none (transparent)';
  const v = semantic.get(cssVar);
  if (!v) return `var(${cssVar})`;
  const l = v.values.Light;
  const d = v.values.Dark;
  const light = `${hex(l.resolved)} ${shortName(l.label)}`;
  const dark = d.resolved === l.resolved ? '' : ` · dark ${hex(d.resolved)} ${shortName(d.label)}`;
  return `var(${cssVar}) → ${light}${dark}`;
};

/** Returns { cssVar, px } for a Buttons Dimensions variable in a given size. */
export const dim = (name: string, size: ButtonSize) => {
  const entry = dims?.vars.find((v) => v.name === name);
  const value = entry?.values[sizeLabel[size]];
  return { cssVar: value?.cssVar ?? '', px: parseFloat(value?.resolved ?? '0') };
};

export const px = (n: number) => `${Math.round(n * 100) / 100}px`;
export const d = (name: string, size: ButtonSize) => {
  const x = dim(name, size);
  return `var(${x.cssVar}) → ${px(x.px)}`;
};

// ---- spec builders ----------------------------------------------------------

/** The full spec for one button configuration, as comment lines. */
export const buttonSpecLines = (props: ButtonProps & { showIconLeft?: boolean; showIconRight?: boolean }) => {
  const variant = props.variant ?? 'primary';
  const size = props.size ?? 'regular';
  const rounded = !!props.rounded;
  const spec = variantSpecs[variant];
  const height = dim('Button Height', size).px;
  const radius = dim('Roundness', size);
  const stroke = dim('Stroke', size);
  const hoverRadius = radius.px + height / 8;
  const icons = [props.showIconLeft ?? !!props.iconLeft ? 'left' : null, props.showIconRight ?? !!props.iconRight ? 'right' : null].filter(Boolean);

  const borderLine = (c: Partial<Colors>, fallbackWidth = spec.rest.borderWidth) => {
    if (!c.border) return 'Border     none';
    const w = fallbackWidth === '1px' ? '1px' : `${px(stroke.px)} (var(${stroke.cssVar}))`;
    return `Border     ${w} solid ${color(c.border)}`;
  };

  return [
    `${spec.label} button · ${sizeLabel[size]} size · ${rounded ? 'fully rounded' : 'square corners'}${props.disabled ? ' · DISABLED' : ''}`,
    '',
    'SIZE',
    `  Height     ${d('Button Height', size)}`,
    `  Padding    ${d('Padding', size)} left and right`,
    `  Gap        ${d('Gap', size)} between icon and label`,
    `  Icons      ${icons.length ? icons.join(' + ') : 'none'}${icons.length ? `, ${d('Icon Size', size)}${icons.length > 1 ? ' each' : ''}` : ''}`,
    '',
    'TEXT',
    `  Font       Figtree SemiBold (600)`,
    `  Size       ${d('Font Size', size)}`,
    '',
    'CORNERS',
    rounded
      ? `  Radius     var(--is-full-round) → 1000px (pill)`
      : `  Radius     ${d('Roundness', size)}`,
    rounded
      ? `  On hover   no change — fully rounded buttons keep their shape`
      : `  On hover   rounder: ${px(radius.px)} → ${px(hoverRadius)} (radius + height ÷ 8), eases over 220ms`,
    '',
    'DEFAULT',
    `  Background ${color(spec.rest.bg)}`,
    `  Text/icons ${color(spec.rest.fg)}`,
    `  ${borderLine(spec.rest)}`,
    '',
    'HOVER & PRESSED',
    `  Background ${color(spec.hover.bg ?? spec.rest.bg)}`,
    ...(spec.hover.fg ? [`  Text/icons ${color(spec.hover.fg)}`] : []),
    ...(spec.hover.border ? [`  ${borderLine(spec.hover)}`] : []),
    `  Transition colors 120ms`,
    '',
    'KEYBOARD FOCUS',
    `  Background ${color(spec.focus.bg ?? spec.rest.bg)}`,
    ...(spec.focus.fg ? [`  Text/icons ${color(spec.focus.fg)}`] : []),
    `  ${borderLine(spec.focus, 'stroke')}`,
    '',
    'DISABLED (no hover change, not clickable)',
    `  Background ${spec.disabled.bg === null ? 'none (transparent)' : color(spec.disabled.bg ?? spec.rest.bg)}`,
    `  Text/icons ${color(spec.disabled.fg ?? spec.rest.fg)}`,
    `  ${borderLine({ border: spec.disabled.border ?? spec.rest.border })}`,
  ];
};

export const asComment = (lines: string[]) => ['/*', ...lines.map((l) => (l ? ` * ${l}` : ' *')), ' */'].join('\n');

/** Comment block for a single story, placed above its JSX. */
export const buttonSpecComment = (props: Parameters<typeof buttonSpecLines>[0]) => asComment(buttonSpecLines(props));

/** Reference for the whole variant sheet: every variant's colors per state. */
export const allVariantsSpec = () => {
  const blocks = (Object.keys(variantSpecs) as ButtonVariant[]).map((v) => {
    const s = variantSpecs[v];
    return asComment([
      `${s.label}  →  <Button variant="${v}" />`,
      `  Default    bg ${color(s.rest.bg)}`,
      `             text ${color(s.rest.fg)}`,
      ...(s.rest.border ? [`             border ${color(s.rest.border)}`] : []),
      `  Hover      bg ${color(s.hover.bg ?? s.rest.bg)}${s.hover.border ? `; border ${color(s.hover.border)}` : ''}`,
      `  Focus      border ${color(s.focus.border)}`,
      `  Disabled   bg ${s.disabled.bg === null ? 'none' : color(s.disabled.bg ?? s.rest.bg)}`,
      `             text ${color(s.disabled.fg ?? s.rest.fg)}`,
    ]);
  });
  return [
    asComment([
      'Every variant in every state. Sizes and corner behaviour are the same for all variants:',
      'square buttons get rounder on hover (radius + height ÷ 8, 220ms); fully rounded buttons do not change.',
      'Dark-mode values apply when the page has data-theme="dark".',
    ]),
    ...blocks,
  ].join('\n\n');
};

/** Reference for the size scale. */
export const sizesSpec = () =>
  asComment([
    'Size      Height  Padding  Gap   Icon  Font  Radius  Hover radius  Border',
    ...(Object.keys(sizeLabel) as ButtonSize[]).map((s) => {
      const h = dim('Button Height', s).px;
      const r = dim('Roundness', s).px;
      const cols = [
        sizeLabel[s].padEnd(9),
        px(h).padEnd(7),
        px(dim('Padding', s).px).padEnd(8),
        px(dim('Gap', s).px).padEnd(5),
        px(dim('Icon Size', s).px).padEnd(5),
        px(dim('Font Size', s).px).padEnd(5),
        px(r).padEnd(7),
        px(r + h / 8).padEnd(13),
        px(dim('Stroke', s).px),
      ];
      return `${cols.join(' ')}   <Button size="${s}" />`;
    }),
    '',
    'Each value is a Figma variable: var(--is-button-<size>-height), -padding, -gap, -icon-size, -font-size, -roundness, -stroke.',
    'Fully rounded buttons (rounded) use var(--is-full-round) → 1000px and keep that radius on hover.',
  ]);
