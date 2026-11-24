/**
 * iScribe animations — larger Lottie (JSON) pieces in their own colours, such as backgrounds, unlike the
 * single-colour Animated Icons. Each can have a dark-mode version, used automatically when the page is in dark mode.
 * Add one by dropping its .json file(s) into src/animations/ and registering it here.
 */
import loadingAppointmentLight from './loading-appointment-light.json';
import loadingAppointmentDark from './loading-appointment-dark.json';
import generatedNoteSkeletonLight from './generated-note-skeleton-light.json';
import generatedNoteSkeletonDark from './generated-note-skeleton-dark.json';
import scheduleListSkeletonLight from './schedule-list-skeleton-light.json';
import scheduleListSkeletonDark from './schedule-list-skeleton-dark.json';
import scheduleListSkeletonCompactLight from './schedule-list-skeleton-compact-light.json';
import scheduleListSkeletonCompactDark from './schedule-list-skeleton-compact-dark.json';

export interface AnimationData {
  /** The Lottie JSON for light mode */
  light: object;
  /** The Lottie JSON for dark mode (leave out to use the light one in both) */
  dark?: object;
  /** What it shows and where it's used */
  description: string;
  /** Size it was drawn at, in px (its default size) */
  width: number;
  height: number;
}

export const animations = {
  'loading-appointment': {
    light: loadingAppointmentLight,
    dark: loadingAppointmentDark,
    description:
      'Periwinkle circles pulse out from the centre, a new one every 2 seconds, fading as they grow past the edges. The background while an appointment loads. 360 × 360, loops every 4 seconds.',
    width: 360,
    height: 360,
  },
  'generated-note-skeleton': {
    light: generatedNoteSkeletonLight,
    dark: generatedNoteSkeletonDark,
    description:
      'Four note cards with title and text placeholders, a soft highlight sweeping across each bar. The Generated Note (Note tab) while the note is generated after Generate Note. 600 × 672, loops every 1.4 seconds.',
    width: 600,
    height: 672,
  },
  'schedule-list-skeleton': {
    light: scheduleListSkeletonLight,
    dark: scheduleListSkeletonDark,
    description:
      'Four expanded schedule cards: the photo square and two lines on the side, three lines for the patient (every line 9px, fully rounded, 10px apart), a soft highlight sweeping across each. The Schedule Side Bar while the day loads. 380 × 450, loops every 1.4 seconds.',
    width: 380,
    height: 450,
  },
  'schedule-list-skeleton-compact': {
    light: scheduleListSkeletonCompactLight,
    dark: scheduleListSkeletonCompactDark,
    description:
      'Four compact schedule cards with three centred lines each (9px, fully rounded, 10px apart), a soft highlight sweeping across each. The collapsed Schedule Side Bar while the day loads. 150 × 450, loops every 1.4 seconds.',
    width: 150,
    height: 450,
  },
} satisfies Record<string, AnimationData>;

export type AnimationName = keyof typeof animations;
export const animationNames = Object.keys(animations) as AnimationName[];
