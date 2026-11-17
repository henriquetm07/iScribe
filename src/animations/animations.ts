/**
 * iScribe animations — larger Lottie (JSON) pieces in their own colours, such as backgrounds, unlike the
 * single-colour Animated Icons. Each can have a dark-mode version, used automatically when the page is in dark mode.
 * Add one by dropping its .json file(s) into src/animations/ and registering it here.
 */
import loadingAppointmentLight from './loading-appointment-light.json';
import loadingAppointmentDark from './loading-appointment-dark.json';

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
} satisfies Record<string, AnimationData>;

export type AnimationName = keyof typeof animations;
export const animationNames = Object.keys(animations) as AnimationName[];
