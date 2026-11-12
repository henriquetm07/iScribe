/**
 * Human-readable reference for the RTN Header (Web), shown in the Storybook "Show code" panel.
 * Mirrors RTNHeader.css and names the library parts each piece is built from.
 */
import { asComment } from '../Button/Button.docs';
import type { RTNHeaderProps } from './RTNHeader';

const stateName = { idle: 'Default', recording: 'Recording', paused: 'Playback / Paused', playing: 'Playback / Playing' } as const;

export const rtnHeaderSpecLines = (p: Partial<RTNHeaderProps>) => [
  `RTN Header (Web) · ${p.patient === null ? 'Empty profile' : 'Filled in'} · ${stateName[p.recordState ?? 'idle']}`,
  '',
  'HEADER',
  '  Full width; padding 20px 40px; 20px between the details row and the patient row',
  '  Background  var(--is-surface-super-soft-contrast-light)',
  '  Border      1px bottom, var(--is-surface-soft-contrast-background)',
  '',
  'DETAILS (RTNHeaderDetails)',
  '  Labels      22px pills, min 44px, padding 2px 6px, var(--is-labels-low-contrast),',
  '              Relative Mono 10 Pitch 13px / 18px, high contrast',
  '  Then 10px apart: date (13px, low contrast) · time (13px SemiBold, medium) · check-in (13px, low)',
  '              3px dots in low contrast between them',
  '  Right       <IconButton variant="ghost" size="regular" icon="meatballs" />  (40px, 16px icon)',
  '',
  'PATIENT (RTNHeaderPatient, Figma "Complete Profile")',
  '  Web         photo 90 × 120px, radius 18px; 30px gap; 60px right padding',
  '  Chrome Ext. photo 60 × 80px, radius 12px; 15px gap',
  '  Name        Season Mix 20px, high contrast',
  '  Details     Figtree 16px / 18px, medium contrast, 12px apart (sex · date of birth · age)',
  '  Empty       "First name"  "Last name" / "Sex"  "MM/DD/YYYY"  "Age" in low contrast,',
  '              each over a 2px dotted line (round dots 5px apart), 10px apart',
  '',
  'RECORD FEATURE (RTNHeaderRecord) — fills the rest of the row, up to 1000px, right-aligned',
  '  Default     Start Recording: primary, 60px pill, padding 20px, 12px gap, 22px mic, 15px SemiBold',
  '  Recording   120px pill (var(--is-surface-super-soft-contrast-background), 1px',
  '              var(--is-surface-soft-contrast-background) border), padding 0 30px, 20px gaps:',
  '              web mini waves (18 bars, 87 × 40px) · time Relative Mono 18px in',
  '              var(--is-status-foreground-alert) · 60px red Stop (22px icon)',
  '  Playback    the same pill, full width: 40px play/pause ("play-pause" animated icon) ·',
  '              timeline (14px title, 5px bar var(--is-labels-accent) on',
  '              var(--is-surface-super-soft-contrast-light), 10px mono times) · Resume',
  '              (secondary, 60px pill, 22px mic)',
  '',
  'FLOW',
  '  Start Recording → the waves grow from dots → Stop → Playback (play / pause, drag the bar or',
  '  ← → to seek) → Resume records more. The clock is simulated in the docs; in the app, connect',
  '  useRecorder to the real recorder.',
];

export const rtnHeaderSpecComment = (p: Partial<RTNHeaderProps>) => asComment(rtnHeaderSpecLines(p));
