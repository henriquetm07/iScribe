import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../icons/Icon';
import arrowToCheck from './arrow-to-check.json';

/** Last frame of arrow-to-check.json (60fps, 140 frames ≈ 2.3s): the finished check mark. */
const LAST_FRAME = 139;

/**
 * Plays the "arrow to check" Lottie animation once: the arrow-right icon turns into a check mark.
 * Drawn on the same 12 × 12 grid as the iScribe icons and colored with currentColor.
 * The Lottie player is loaded only when this mounts, so it adds nothing to pages that never send.
 * With reduced motion it jumps straight to the check mark.
 */
export const ArrowToCheck = () => {
  const box = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let destroy = () => {};
    import('lottie-web').then(({ default: lottie }) => {
      if (cancelled || !box.current) return;
      const anim = lottie.loadAnimation({
        container: box.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: arrowToCheck,
      });
      destroy = () => anim.destroy();
      setReady(true);
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) anim.goToAndStop(LAST_FRAME, true);
      else anim.play();
    });
    return () => {
      cancelled = true;
      destroy();
    };
  }, []);

  return (
    <span className="is-arrow-to-check">
      {/* The static arrow shows for the instant it takes to load the player, so the knob is never empty */}
      {!ready && <Icon name="arrow-right" />}
      <span ref={box} className="is-arrow-to-check__anim" />
    </span>
  );
};
