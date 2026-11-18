/**
 * Human-readable reference for the Tooltip, shown in the Storybook "Show code" panel. Mirrors Tooltip.css.
 */
import { asComment } from '../Button/Button.docs';
import type { TooltipTip, TooltipTone } from './Tooltip';

export const tooltipSpecLines = ({ tone = 'periwinkle', tip }: { tone?: TooltipTone; tip?: TooltipTip }) =>
  tone === 'periwinkle'
    ? [
        `Tooltip - Web · Periwinkle · tip ${tip ?? 'right'}`,
        '',
        '  Box         180px wide, padding 12, corners 20px (Round XXL), positive (periwinkle) background',
        '  Header      Red Hat Text SemiBold 13px · × 12px on the right',
        '  Text        Red Hat Text Medium 13px, high contrast',
        '  Tip         18 × 9 triangle, centred on its side',
        '  Shadow      drop shadow 0 0 10px basic shadow',
      ]
    : [
        'Tooltip - Web · White',
        '',
        '  Box         padding 8, corners 10px (Round M), elevated background, one line',
        '  Text        Red Hat Text Medium 13px, high contrast',
        '  Shadow      drop shadow 0 0 10px basic shadow',
        '  On hover    WithTooltip shows it 12px from the element after 150ms, and hides it on leave or Escape',
      ];

export const tooltipSpecComment = (p: { tone?: TooltipTone; tip?: TooltipTip }) => asComment(tooltipSpecLines(p));
