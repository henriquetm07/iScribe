import { useEffect, useRef, useState, type ReactNode } from 'react';
import { animatedIcons, type AnimatedIconName } from './animatedIcons';
import './AnimatedIcon.css';

export interface AnimatedIconProps {
  /** Which animation to play. See Foundations / Animated Icons. */
  name: AnimatedIconName;
  /** Width and height in px (or any CSS length). Defaults to 1em, like Icon. */
  size?: number | string;
  /** Start playing as soon as it mounts (default true). Set false to show the first frame. */
  autoplay?: boolean;
  /** Repeat forever instead of stopping on the last frame. Leave out to use the icon's own setting (the spinner loops) */
  loop?: boolean;
  /** Play it again every this many seconds (counted from the start of each play), resting on the last frame in between */
  repeatEvery?: number;
  /** Playback speed multiplier (1 = as designed). Leave out to use the icon's own speed (e.g. play-pause runs at 2×) */
  speed?: number;
  /**
   * For icons with states (see animatedIcons, e.g. play-pause): which state to show. Changing it animates
   * from the current look to the new one; the first render jumps straight there. Autoplay is ignored.
   */
  state?: string;
  /** Called when the animation reaches one of its named markers, e.g. "check" */
  onMarker?: (marker: string) => void;
  /** Called when the animation finishes (not called when looping) */
  onComplete?: () => void;
  /** Shown until the player has loaded (for example the static icon it starts from) */
  fallback?: ReactNode;
  /** Accessible name. Leave empty for decorative animations. */
  title?: string;
  className?: string;
}

/**
 * Plays an iScribe animated icon (Lottie JSON). Colored with currentColor, like Icon.
 * The Lottie player is loaded on first use only, so pages without animated icons don't download it.
 * With reduced motion it shows the last frame and reports every marker right away.
 */
export const AnimatedIcon = ({
  name,
  size = '1em',
  autoplay = true,
  loop: loopProp,
  repeatEvery,
  speed,
  state,
  onMarker,
  onComplete,
  fallback,
  title,
  className,
}: AnimatedIconProps) => {
  const box = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);
  const callbacks = useRef({ onMarker, onComplete });
  callbacks.current = { onMarker, onComplete };
  // The loaded player and the state it was last moved to, for icons with states
  const player = useRef<{ playSegments: (s: [number, number], force: boolean) => void; goToAndStop: (f: number, isFrame: boolean) => void } | null>(null);
  const shown = useRef<string | undefined>(undefined);
  const stateRef = useRef(state);
  stateRef.current = state;

  const loop = loopProp ?? !!(animatedIcons[name] as { loop?: boolean }).loop;

  useEffect(() => {
    const icon = animatedIcons[name];
    const markers = Object.entries(((icon as { markers?: Record<string, number> }).markers ?? {})).sort((a, b) => a[1] - b[1]);
    const fired = new Set<string>();
    let cancelled = false;
    let destroy = () => {};
    const reach = (frame: number) => {
      for (const [marker, at] of markers) {
        if (frame >= at && !fired.has(marker)) {
          fired.add(marker);
          callbacks.current.onMarker?.(marker);
        }
      }
    };
    const finish = () => {
      reach(Infinity);
      callbacks.current.onComplete?.();
    };

    import('lottie-web')
      .then(({ default: lottie }) => {
        if (cancelled || !box.current) return;
        const anim = lottie.loadAnimation({
          container: box.current,
          renderer: 'svg',
          loop,
          autoplay: false,
          animationData: icon.data,
        });
        destroy = () => {
          player.current = null;
          anim.destroy();
        };
        anim.setSpeed(speed ?? ('speed' in icon ? (icon.speed as number) : 1));
        // Icons with an accent colour: every frame, colours between the file's base and accent are redrawn as a mix
        // of currentColor and --is-animated-icon-accent, so the accent follows the theme like the rest
        const accent = 'accent' in icon ? (icon.accent as { base: string; color: string }) : undefined;
        if (accent) {
          const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
          const [from, to] = [hex(accent.base), hex(accent.color)];
          const span = to.map((v, i) => v - from[i]);
          const length = span.reduce((sum, v) => sum + v * v, 0);
          const tint = () => {
            box.current?.querySelectorAll<SVGElement>('[stroke], [fill]').forEach((el) => {
              for (const attr of ['stroke', 'fill'] as const) {
                const rgb = el.getAttribute(attr)?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                if (!rgb) continue;
                const t = Math.min(1, Math.max(0, rgb.slice(1, 4).reduce((sum, v, i) => sum + (Number(v) - from[i]) * span[i], 0) / length));
                el.style[attr] = t < 0.01 ? '' : `color-mix(in srgb, var(--is-animated-icon-accent) ${Math.round(t * 100)}%, currentColor)`;
              }
            });
          };
          // drawnFrame comes after lottie has written the frame's colours (enterFrame comes before)
          anim.addEventListener('DOMLoaded', tint);
          anim.addEventListener('drawnFrame', tint);
          tint();
        }
        setReady(true);
        // Icons with states: start on the end frame of the current state and wait for changes
        const states = 'states' in icon ? (icon.states as Record<string, readonly [number, number]>) : undefined;
        if (states && stateRef.current && states[stateRef.current]) {
          player.current = anim;
          shown.current = stateRef.current;
          anim.goToAndStop(states[stateRef.current][1], true);
          return;
        }
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
          const still = (icon as { still?: number }).still;
          anim.goToAndStop(still ?? anim.totalFrames - 1, true);
          if (autoplay) finish();
          return;
        }
        anim.addEventListener('enterFrame', () => reach(anim.currentFrame));
        anim.addEventListener('loopComplete', () => fired.clear());
        anim.addEventListener('complete', finish);
        if (autoplay) anim.play();
        // Replay on a timer (e.g. Note in Progress, every 5s)
        if (repeatEvery && !loop) {
          const timer = window.setInterval(() => {
            fired.clear();
            anim.goToAndPlay(0, true);
          }, repeatEvery * 1000);
          const stop = destroy;
          destroy = () => {
            window.clearInterval(timer);
            stop();
          };
        }
      })
      // If the player can't load, still report the markers so nothing waits forever
      .catch(() => {
        if (!cancelled && autoplay) finish();
      });

    return () => {
      cancelled = true;
      destroy();
    };
  }, [name, autoplay, loop, repeatEvery, speed]);

  // Animate to a new state (play-pause: triangle ↔ bars)
  useEffect(() => {
    const icon = animatedIcons[name];
    const states = 'states' in icon ? (icon.states as Record<string, readonly [number, number]>) : undefined;
    const anim = player.current;
    if (!anim || !states || !state || !states[state] || shown.current === state) return;
    shown.current = state;
    const [from, to] = states[state];
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) anim.goToAndStop(to, true);
    else anim.playSegments([from, to], true);
  }, [name, state]);

  return (
    <span
      className={`is-animated-icon${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size }}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {!ready && fallback}
      <span ref={box} className="is-animated-icon__anim" />
    </span>
  );
};
