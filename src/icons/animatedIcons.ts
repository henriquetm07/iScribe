/**
 * iScribe animated icons — Lottie (JSON) animations drawn on the same 12 × 12 grid as the static icons.
 * Add a new one by dropping its .json into src/icons/animated/ and registering it here.
 */
import arrowToCheck from './animated/arrow-to-check.json';
import playPause from './animated/play-pause.json';

export interface AnimatedIconData {
  /** The Lottie JSON */
  data: object;
  /** What it shows and where it's used */
  description: string;
  /** Named moments in the animation (frame numbers), reported by AnimatedIcon's onMarker */
  markers?: Record<string, number>;
  /** Static icon (from Foundations / Icons) it starts from, shown while the player loads */
  startsFrom?: string;
  /**
   * For icons that switch between two looks (like play / pause): the frames to play to reach each state.
   * Pass AnimatedIcon a `state` and it animates to it; on first show it jumps straight to the end frame.
   */
  states?: Record<string, readonly [from: number, to: number]>;
}

export const animatedIcons = {
  'arrow-to-check': {
    data: arrowToCheck,
    description: 'An arrow turns into a spinner, then draws a check mark. Plays in the Send Slider knob once sending completes.',
    markers: { spinner: 5, check: 105, done: 124 },
    startsFrom: 'arrow-right',
  },
  'play-pause': {
    data: playPause,
    description:
      'Pause bars morph into a play triangle and back. Used for the play / pause button in the Record Feature: state="play" shows the triangle, state="pause" the bars.',
    markers: { play: 41, pause: 92 },
    startsFrom: 'pause-flat',
    states: { play: [10, 41], pause: [50, 92] },
  },
} satisfies Record<string, AnimatedIconData>;

export type AnimatedIconName = keyof typeof animatedIcons;
export const animatedIconNames = Object.keys(animatedIcons) as AnimatedIconName[];

/** Frame rate, length and size read from a Lottie file. */
export const lottieInfo = (data: object) => {
  const d = data as { fr: number; ip: number; op: number; w: number; h: number };
  const frames = d.op - d.ip;
  return { fps: d.fr, frames, seconds: frames / d.fr, width: d.w, height: d.h };
};
