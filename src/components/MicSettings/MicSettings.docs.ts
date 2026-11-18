/**
 * Human-readable reference for Mic Settings, shown in the Storybook "Show code" panel. Mirrors MicSettings.css.
 */
import { asComment } from '../Button/Button.docs';

export const micSettingsSpecLines = ({ error = false }: { error?: boolean }) => [
  `Mic Settings · Web${error ? ' · error' : ''}`,
  '',
  `  Button      Icon Button Regular 40 · ${error ? 'Destructive (Alert)' : 'Secondary'} · mic icon`,
  '  Card        302px wide, padding 20, gap 10, corners 20, elevated background, soft contrast border',
  '  Title       "Microphone Settings" Figtree Medium 20px · × 16px box (9.5px glyph, low contrast), top right',
  '  Labels      Figtree Medium 16px',
  `  Microphone  Dropdown (Web) 40px tall, full width; chevron medium contrast;
              its Selection List (rows 37px) opens above it, no check mark${
    error ? '\n              Error: red border when closed; the selected microphone is red with the alert icon' : ''
  }`,
  '  Input level 24 bars, 6 × 40px, corners 4 · lit: Positive (periwinkle) · unlit: Soft Contrast Background',
];

export const micSettingsSpecComment = (p: { error?: boolean }) => asComment(micSettingsSpecLines(p));
