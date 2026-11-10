import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../icons/Icon';
import arrowToCheck from './arrow-to-check.json';

/** Frame where the check mark starts drawing in arrow-to-check.json (60fps): 105 ≈ 1.75s. It finishes at 124. */
const CHECK_FRAME = 105;
/** Last frame of the file (140 frames): the finished check mark. */
const LAST_FRAME = 139;

export interface ArrowToCheckProps {
  /** Called once, when the check mark starts drawing (or right away with reduced motion) */
  onCheck?: () => void;
}

/**
 * Plays the "arrow to check" Lottie animation once: the arrow-right icon turns into a spinner, then a check mark.
 * Drawn on the same 12 × 12 grid as the iScribe icons and colored with currentColor.
 * The Lottie player is loaded only when this mounts, so it adds nothing to pages that never send.
 * With reduced motion it jumps straight to the check mark.
 */
export const ArrowToCheck = ({ onCheck }: ArrowToCheckProps) => {
  const box = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);
  const onCheckRef = useRef(onCheck);
  onCheckRef.current = onCheck;

  useEffect(() => {
    let cancelled = false;
    let destroy = () => {};
    let fired = false;
    const check = () => {
      if (fired || cancelled) return;
      fired = true;
      onCheckRef.current?.();
    };
    import('lottie-web')
      .then(({ default: lottie }) => {
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
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
          anim.goToAndStop(LAST_FRAME, true);
          check();
          return;
        }
        anim.addEventListener('enterFrame', () => {
          if (anim.currentFrame >= CHECK_FRAME) check();
        });
        anim.addEventListener('complete', check);
        anim.play();
      })
      // If the player can't load, don't leave the success message hidden
      .catch(check);
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
