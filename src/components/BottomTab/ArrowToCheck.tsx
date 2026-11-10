import { AnimatedIcon } from '../../icons/AnimatedIcon';
import { Icon } from '../../icons/Icon';

export interface ArrowToCheckProps {
  /** Called once, when the check mark starts drawing (or right away with reduced motion) */
  onCheck?: () => void;
}

/**
 * The Send Slider knob's success animation: the "arrow-to-check" animated icon from
 * Foundations / Animated Icons, filling the knob's icon slot. Until the player loads it shows
 * the static arrow-right icon, so the knob is never empty.
 */
export const ArrowToCheck = ({ onCheck }: ArrowToCheckProps) => (
  <AnimatedIcon
    name="arrow-to-check"
    size="100%"
    fallback={<Icon name="arrow-right" />}
    onMarker={(marker) => {
      if (marker === 'check') onCheck?.();
    }}
  />
);
