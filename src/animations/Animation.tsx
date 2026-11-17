import { useEffect, useRef } from 'react';
import { animations, type AnimationData, type AnimationName } from './animations';
import './Animation.css';

export type AnimationTheme = 'auto' | 'light' | 'dark';

export interface AnimationProps {
  /** Which animation. See Foundations / Animations. */
  name: AnimationName;
  /** Which version: auto follows the page's light / dark mode (default); light or dark forces one */
  theme?: AnimationTheme;
  /** Width and height in px (or any CSS length). Default: the size it was drawn at. */
  width?: number | string;
  height?: number | string;
  /** contain shows all of it (default); cover fills the box and crops the rest, for backgrounds */
  fit?: 'contain' | 'cover';
  /** Repeat forever (default true) */
  loop?: boolean;
  /** Accessible name. Leave empty for decorative animations. */
  title?: string;
  className?: string;
}

/** One Lottie player. The player is loaded on first use only. With reduced motion it shows a still frame. */
const Player = ({ data, loop, fit, className }: { data: object; loop: boolean; fit: 'contain' | 'cover'; className: string }) => {
  const box = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let cancelled = false;
    let destroy = () => {};
    import('lottie-web')
      .then(({ default: lottie }) => {
        if (cancelled || !box.current) return;
        const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        const anim = lottie.loadAnimation({
          container: box.current,
          renderer: 'svg',
          loop,
          autoplay: !still,
          animationData: data,
          rendererSettings: { preserveAspectRatio: fit === 'cover' ? 'xMidYMid slice' : 'xMidYMid meet' },
        });
        if (still) anim.goToAndStop(Math.round(anim.totalFrames / 4), true);
        destroy = () => anim.destroy();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      destroy();
    };
  }, [data, loop, fit]);
  return <span ref={box} className={`is-animation__player ${className}`} />;
};

/**
 * Plays an iScribe animation (Lottie JSON) in its own colours. With theme="auto" it shows the light version, or
 * the dark one when the page (or a block around it) is in dark mode.
 */
export const Animation = ({ name, theme = 'auto', width, height, fit = 'contain', loop = true, title, className = '' }: AnimationProps) => {
  const animation: AnimationData = animations[name];
  const dark = animation.dark;
  const showLight = theme !== 'dark' || !dark;
  const showDark = !!dark && theme !== 'light';
  return (
    <span
      className={`is-animation${dark && theme === 'auto' ? ' is-animation--auto' : ''} ${className}`}
      style={{ width: width ?? animation.width, height: height ?? animation.height }}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {showLight && <Player data={animation.light} loop={loop} fit={fit} className="is-animation__light" />}
      {showDark && dark && <Player data={dark} loop={loop} fit={fit} className="is-animation__dark" />}
    </span>
  );
};
