/**
 * Human-readable reference for the Record Feature, shown in the Storybook "Show code" panel. Mirrors Record.css.
 */
import { asComment } from '../Button/Button.docs';
import type { MiniRecordWidgetProps } from './MiniRecordWidget';
import type { RecordFocusModeProps } from './RecordFocusMode';
import type { RecordDevice, RecordState } from './RecordParts';
import type { RecordWidgetProps } from './RecordWidget';

const deviceName: Record<RecordDevice, string> = { iphone: 'iPhone', ipad: 'iPad' };
const stateName: Record<RecordState, string> = {
  idle: 'Default',
  recording: 'Recording',
  paused: 'Playback / Paused',
  playing: 'Playback / Playing',
};

const sharedLines = [
  'SHARED PARTS',
  '  Waves       2px red bars (var(--is-labels-alert)), 3px apart, up to 39px tall, round caps',
  '              while recording: centre bars tall, wide range, fast (~0.45s);',
  '              towards the ends shorter, narrow range, slower (~1.1s)',
  '  Time        Relative Mono 10 Pitch; red (var(--is-status-foreground-alert)) while recording',
  '  Playback    track var(--is-surface-soft-contrast-background), radius 10px;',
  '              progress var(--is-status-foreground-positive-pw);',
  '              knob var(--is-background-elevated-background) + 0 0 10px shadow',
  '  Buttons     primary   var(--is-button-primary-default-bg), light icon/text',
  '              secondary var(--is-background-elevated-background) + 1px var(--is-button-secondarystroke)',
  '              stop / delete var(--is-button-destructive), white icon/text',
  '              hover uses the same Active colors as the Button',
  '  Play/Pause  the "play-pause" animated icon: triangle ↔ bars morph (Foundations / Animated Icons)',
];

const flowLines = [
  'FLOW',
  '  Start Recording → Recording (waves + time + Stop)',
  '  Stop → Playback: play / pause, drag the bar (or ← →) to seek',
  '  Resume → records more on top of the same take · Delete → back to Default',
  '  The clock is simulated in the docs; in the app, connect useRecorder to the real recorder',
];

export const recordWidgetSpecLines = (p: Partial<RecordWidgetProps>) => {
  const d = p.device ?? 'iphone';
  const ipad = d === 'ipad';
  return [
    `Record Widget · ${deviceName[d]} · ${stateName[p.state ?? 'idle']}${p.showDelete ? ' · with Delete' : ''}`,
    '',
    'LAYOUT',
    `  Width       ${p.width ?? 396}px, one row, 10px gaps`,
    ipad
      ? '  Default     Start Recording: 220 × 80px, radius 24px, Figtree SemiBold 18px, 28px mic, centred'
      : '  Default     Start Recording: full width × 70px, radius 20px, Figtree SemiBold 15px, 22px mic',
    `  Recording   waves (up to ${ipad ? 100 : 300}px) · time ${ipad ? 15 : 12}px · Stop ${ipad ? 60 : 40}px circle`,
    `  Playback    play/pause ${ipad ? 60 : 40}px circle · bar ${ipad ? '8px track, 22px knob, 15px times' : '6px track, 14px knob, 13px times'}`,
    `              Resume pill ${ipad ? '60px, 15px text' : '40px, 13px text'}` +
      ` · Delete ${ipad ? '60px, radius 20px' : '40px, radius 12px'}`,
    '',
    ...sharedLines,
    '',
    ...flowLines,
  ];
};

export const miniRecordSpecLines = (p: Partial<MiniRecordWidgetProps>) => {
  const d = p.device ?? 'iphone';
  const ipad = d === 'ipad';
  return [
    `Mini Record Widget · ${deviceName[d]} · ${{ idle: 'Default', recording: 'Recording', stopped: 'Playback' }[p.state ?? 'idle']}`,
    '',
    'LAYOUT',
    '  Right-aligned row, 10px gaps: [mini waves] time button',
    `  Time        ${ipad ? 18 : 15}px Relative Mono 10 Pitch`,
    `  Button      ${ipad ? '80px circle, 28px icon' : '40px circle, 16px icon'}`,
    '  Default     dark mic (primary) — starts recording',
    `  Recording   red time + ${ipad ? '5 bars 3px wide, up to 35px' : '5 bars 2px wide, up to 16px'} + red Stop`,
    '  Playback    white mic (secondary) — records more',
    '',
    ...sharedLines,
  ];
};

export const focusModeSpecLines = (p: Partial<RecordFocusModeProps>) => {
  const d = p.device ?? 'iphone';
  const ipad = d === 'ipad';
  return [
    `Record Feature (Focus Mode) · ${deviceName[d]} · ${stateName[p.state ?? 'idle']}`,
    '',
    'LAYOUT',
    `  375 × 405px column, centred, ${ipad ? '30px gaps, 40px' : '20px gaps, 20px'} side padding`,
    `  Clock       ${ipad ? 80 : 50}px Relative Mono 10 Pitch (red while recording)`,
    `  Hint        Figtree Medium ${ipad ? 18 : 12}px, uppercase, 6% letter spacing, medium contrast`,
    '              Ready to Record · Tap to Stop · Tap to Resume',
    `  Button      ${ipad ? 100 : 80}px circle: dark mic → red stop → white mic`,
    `  Bottom      waves while recording; ${ipad ? '60px' : '50px'} play/pause + playback bar after`,
    '',
    ...sharedLines,
    '',
    ...flowLines,
  ];
};

export const recordWidgetSpecComment = (p: Partial<RecordWidgetProps>) => asComment(recordWidgetSpecLines(p));
export const miniRecordSpecComment = (p: Partial<MiniRecordWidgetProps>) => asComment(miniRecordSpecLines(p));
export const focusModeSpecComment = (p: Partial<RecordFocusModeProps>) => asComment(focusModeSpecLines(p));
