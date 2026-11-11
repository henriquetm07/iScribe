/**
 * Human-readable reference for the Toggle, shown in the Storybook "Show code" panel. Mirrors Toggle.css.
 */
import { asComment } from '../Button/Button.docs';
import type { ToggleProps, ToggleSize } from './Toggle';

const sizeName: Record<ToggleSize, string> = { default: 'Default', big: 'Big', xl: 'XL' };
const dims: Record<ToggleSize, { w: number; h: number; knob: number }> = {
  default: { w: 24, h: 14, knob: 12 },
  big: { w: 30, h: 16, knob: 14 },
  xl: { w: 44, h: 22, knob: 20 },
};

export const toggleSpecLines = (p: Partial<ToggleProps>) => {
  const size = p.size ?? 'default';
  const { w, h, knob } = dims[size];
  const on = !!(p.checked ?? p.defaultChecked);
  return [
    `Toggle · ${sizeName[size]} · ${on ? 'On' : 'Off'}${p.disabled ? ' · DISABLED' : ''}`,
    '',
    'SIZE',
    `  Track      ${w} × ${h}px, 20px corners, 1px var(--is-toggle-stroke) stroke`,
    `  Knob       ${knob}px circle, 1px inside the stroke`,
    '',
    'OFF',
    '  Track      var(--is-toggle-background-off)',
    '  Knob       var(--is-toggle-foreground-off), on the left',
    'ON',
    '  Track      var(--is-toggle-background-on)',
    `  Knob       var(--is-toggle-foreground-on), on the right (moves ${w - 2 - knob}px)`,
    '',
    'BEHAVIOUR',
    '  Click or Space / Enter flips it and calls onChange(checked)',
    '  The knob slides in 200ms (instant with reduced motion)',
    '  role="switch" with aria-checked; give it a label for screen readers',
  ];
};

export const toggleSpecComment = (p: Partial<ToggleProps>) => asComment(toggleSpecLines(p));
