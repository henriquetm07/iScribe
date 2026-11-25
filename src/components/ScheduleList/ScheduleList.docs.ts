/**
 * Human-readable reference for Schedule List Item, shown in the Storybook "Show code" panel. Mirrors ScheduleList.css.
 */
import { asComment } from '../Button/Button.docs';
import type { ScheduleListItemProps } from './ScheduleList';

export const scheduleListItemSpecLines = ({ state = 'active', size = 'compact' }: ScheduleListItemProps) => [
  `Schedule List Item · ${state} · ${size}`,
  '',
  `  Box         ${size === 'compact' ? '130' : '360'} × 100px, corners 16px (Round XL)`,
  state === 'syncing'
    ? '  Background  var(--is-background-elevated-background) with a periwinkle tint; the loading-appointment animation behind'
    : state === 'selected'
      ? '  Background  var(--is-background-elevated-background), drawn in the other mode (dark on a light page)'
      : '  Background  var(--is-background-elevated-background)',
  ...(state === 'syncing'
    ? ['  Content     phone icon 20 × 30, then "Syncing note…" Figtree SemiBold 12px, 10px apart, centred']
    : size === 'compact'
      ? [
          '  Content     stacked and centred, 5px apart, 10px side padding:',
          '              status icon 20px · name Figtree SemiBold 12px (cut off with …) · time Relative Mono 13px · visit type',
        ]
      : [
          '  Left        120px, 1px line on the right (soft contrast; medium when selected):',
          '              photo 30px (corners 10px) · time Relative Mono 13px · visit type, 5px apart',
          '  Right       10px / 20px padding: name Figtree SemiBold 14px · sex, date of birth, age Figtree 11px',
          '              medium contrast, 10px apart · 8px · Appointment Status',
        ]),
  '  Visit type  EHR Icon 20px + label Figtree Medium 11px, 4px apart',
  '  More        ⋮ Icon Button (ghost, mini), 5px from the top right corner (when onMoreInfo is set)',
];

export const scheduleListItemSpecComment = (props: ScheduleListItemProps) => asComment(scheduleListItemSpecLines(props));
