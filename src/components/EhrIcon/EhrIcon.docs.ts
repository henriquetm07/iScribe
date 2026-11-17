/**
 * Human-readable reference for EHR Icon, shown in the Storybook "Show code" panel. Mirrors EhrIcon.css.
 */
import { asComment } from '../Button/Button.docs';
import { ehrLabel, type EhrName } from './EhrIcon';

export const ehrIconSpecLines = (ehr: EhrName = 'athena', integrated = false) => [
  `EHR Icon · ${integrated ? `Integrated (${ehrLabel(ehr)})` : 'Not integrated'}`,
  '',
  '  Size        20 × 20px, corners 4px (Round XS)',
  ...(integrated
    ? [
        `  Shows       the ${ehrLabel(ehr)} logo (Figma "EHR Logos"), in its own colours`,
        ...(ehr === 'veradigm' ? ['  Tile        var(--is-background-logo-background): white 4% in light mode, off-white in dark mode'] : []),
      ]
    : ['  Shows       the link icon, var(--is-foreground-low-contrast-primary-foreground)']),
];

export const ehrIconSpecComment = (ehr?: EhrName, integrated?: boolean) => asComment(ehrIconSpecLines(ehr, integrated));
