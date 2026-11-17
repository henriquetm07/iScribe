/**
 * Human-readable reference for Appointment Status, shown in the Storybook "Show code" panel. Mirrors
 * AppointmentStatus.css.
 */
import { asComment } from '../Button/Button.docs';
import { appointmentStatusLabel, type AppointmentStatusValue } from './AppointmentStatus';

const look: Record<AppointmentStatusValue, string> = {
  'new-note': 'patient in a 1px dotted rounded square (radius 2.5px), high contrast',
  'not-checked-in': 'patient in a 1px dotted circle, medium contrast',
  'checked-in': 'patient in a 1px circle, high contrast',
  'checked-out': 'patient in a dotted circle with a dotted diagonal, medium contrast',
  'note-in-progress': 'iScribe waves in a 1px circle, high contrast',
  'sent-to-ehr': '"send" plane (thin line, round corners) in var(--is-status-foreground-positive) on a var(--is-status-background-positive) disc',
  'copied-to-ehr': '"copy" in var(--is-status-foreground-positive) on a var(--is-status-background-positive) disc',
  failed: '"alert" in var(--is-status-foreground-alert) on a var(--is-status-background-alert) disc',
};

export const appointmentStatusSpecLines = (status: AppointmentStatusValue = 'new-note', withLabel = true) => [
  `Appointment Status · ${appointmentStatusLabel(status)}`,
  '',
  'ICON (AppointmentStatusIcon, Figma "Appointment Status Icons")',
  '  Size        20 × 20px',
  `  Look        ${look[status]}`,
  '  Contrast    high = var(--is-foreground-high-contrast-primary-foreground)',
  '              medium = var(--is-foreground-medium-contrast-primary-foreground)',
  ...(status === 'sent-to-ehr'
    ? ['  Arrival     when the status changes to Sent to EHR, the paper plane flies off and back in once', '              (Animated Icons "sent-to-ehr", 1s); animate={false} turns it off']
    : []),
  ...(withLabel
    ? [
        '',
        'LABEL (AppointmentStatus, Figma "Appointment Status")',
        '  Layout      icon, then the label 8px to its right, centred',
        '  Label       Figtree Medium 11px / 18px, var(--is-foreground-high-contrast-primary-foreground)',
      ]
    : []),
];

export const appointmentStatusSpecComment = (status?: AppointmentStatusValue, withLabel?: boolean) =>
  asComment(appointmentStatusSpecLines(status, withLabel));
