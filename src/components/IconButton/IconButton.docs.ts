/**
 * Human-readable style reference for the Icon Button, shown in the Storybook "Show code" panel.
 * The Icon Button reuses the Button's styles, so it reads the same variant table and Figma
 * variables as Button.docs.ts and only describes what is different (square, icon only, label).
 */
import type { ButtonSize, ButtonVariant } from '../Button/Button';
import { asComment, color, d, dim, px, sizeLabel, variantSpecs } from '../Button/Button.docs';
import type { IconButtonProps } from './IconButton';

type Spec = (typeof variantSpecs)[ButtonVariant];
type Part = { bg?: string | null; fg?: string; border?: string };

/** Lines describing the colors of one state. */
const stateLines = (spec: Spec, part: Part, size: ButtonSize, forceStroke = false) => {
  const stroke = dim('Stroke', size);
  const width = !forceStroke && spec.rest.borderWidth === '1px' ? '1px' : `${px(stroke.px)} (var(${stroke.cssVar}))`;
  return [
    `  Background ${part.bg === null ? 'none (transparent)' : color(part.bg)}`,
    `  Icon       ${color(part.fg)}`,
    `  Border     ${part.border ? `${width} solid ${color(part.border)}` : 'none'}`,
  ];
};

/** The full spec for one icon button, as comment lines. */
export const iconButtonSpecLines = (props: Partial<IconButtonProps>) => {
  const variant = props.variant ?? 'primary';
  const size = props.size ?? 'regular';
  const rounded = !!props.rounded;
  const spec = variantSpecs[variant];
  const height = dim('Button Height', size).px;
  const radius = dim('Roundness', size);
  const { rest, hover, focus, disabled } = spec;

  return [
    `${spec.label} icon button · ${sizeLabel[size]} size · ${rounded ? 'circle' : 'square corners'}${props.disabled ? ' · DISABLED' : ''}`,
    '',
    'SIZE (always square)',
    `  Width      ${d('Button Height', size)}`,
    `  Height     ${d('Button Height', size)}`,
    `  Icon       ${d('Icon Size', size)}, centred, no padding`,
    '',
    'LABEL',
    `  "${props.label ?? ''}" — not visible; read by screen readers (aria-label) and shown as a tooltip`,
    '',
    'CORNERS',
    rounded
      ? `  Radius     var(--is-full-round) → 1000px (circle)`
      : `  Radius     ${d('Roundness', size)}`,
    rounded
      ? `  On hover   no change — circles keep their shape`
      : `  On hover   rounder: ${px(radius.px)} → ${px(radius.px + height / 8)} (radius + height ÷ 8), eases over 220ms`,
    '',
    'DEFAULT',
    ...stateLines(spec, { bg: rest.bg ?? null, fg: rest.fg, border: rest.border }, size),
    '',
    'HOVER & PRESSED (colors fade over 120ms)',
    ...stateLines(spec, { bg: hover.bg ?? rest.bg ?? null, fg: hover.fg ?? rest.fg, border: hover.border ?? rest.border }, size),
    '',
    'KEYBOARD FOCUS',
    ...stateLines(spec, { bg: focus.bg ?? rest.bg ?? null, fg: focus.fg ?? rest.fg, border: focus.border }, size, true),
    '',
    'DISABLED (no hover change, not clickable)',
    ...stateLines(
      spec,
      { bg: disabled.bg === null ? null : disabled.bg ?? rest.bg ?? null, fg: disabled.fg ?? rest.fg, border: disabled.border ?? rest.border },
      size,
    ),
  ];
};

export const iconButtonSpecComment = (props: Partial<IconButtonProps>) => asComment(iconButtonSpecLines(props));

/** Reference for the whole variant sheet. */
export const iconAllVariantsSpec = () =>
  [
    asComment([
      'Every icon button variant in every state. Same colors as the Button; icon buttons are square',
      '(or a circle when rounded). Square ones get rounder on hover (radius + height ÷ 8, 220ms).',
      'Dark-mode values apply when the page has data-theme="dark".',
    ]),
    ...(Object.keys(variantSpecs) as ButtonVariant[]).map((v) => {
      const s = variantSpecs[v];
      return asComment([
        `${s.label}  →  <IconButton variant="${v}" icon={…} label="…" />`,
        `  Default    bg ${color(s.rest.bg)}`,
        `             icon ${color(s.rest.fg)}`,
        ...(s.rest.border ? [`             border ${color(s.rest.border)}`] : []),
        `  Hover      bg ${color(s.hover.bg ?? s.rest.bg)}${s.hover.border ? `; border ${color(s.hover.border)}` : ''}`,
        `  Focus      border ${color(s.focus.border)}`,
        `  Disabled   bg ${s.disabled.bg === null ? 'none' : color(s.disabled.bg ?? s.rest.bg)}`,
        `             icon ${color(s.disabled.fg ?? s.rest.fg)}`,
      ]);
    }),
  ].join('\n\n');

/** Reference for the size scale. */
export const iconSizesSpec = () =>
  asComment([
    'Size      Square  Icon  Radius  Hover radius  Border',
    ...(Object.keys(sizeLabel) as ButtonSize[]).map((s) => {
      const h = dim('Button Height', s).px;
      const r = dim('Roundness', s).px;
      const cols = [
        sizeLabel[s].padEnd(9),
        px(h).padEnd(7),
        px(dim('Icon Size', s).px).padEnd(5),
        px(r).padEnd(7),
        px(r + h / 8).padEnd(13),
        px(dim('Stroke', s).px).padEnd(6),
      ];
      return `${cols.join(' ')} <IconButton size="${s}" />`;
    }),
    '',
    'Each value is a Figma variable: var(--is-button-<size>-height) for width and height,',
    '-icon-size, -roundness and -stroke. Circles (rounded) use var(--is-full-round) and keep it on hover.',
  ]);
