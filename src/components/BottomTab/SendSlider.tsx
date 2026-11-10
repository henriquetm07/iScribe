import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Icon } from '../../icons/Icon';
import { IconButton } from '../IconButton/IconButton';
import './BottomTab.css';

export type BottomTabDevice = 'iphone' | 'ipad';

export interface SendSliderProps {
  /** iPhone: fills the width, 60px tall · iPad: 320 × 80px */
  device?: BottomTabDevice;
  /** Text in the track before sending */
  label?: string;
  /** Text in the track once sent */
  sentLabel?: string;
  /** Called once when the knob is dragged all the way to the end (or Enter/Space on the knob) */
  onSend?: () => void;
  /** Control the sent state from outside. Leave undefined to let the slider manage it. */
  sent?: boolean;
  disabled?: boolean;
  /** Pins the knob at a position from 0 to 1. For documentation only (shows the "Sliding" state). */
  progress?: number;
}

/** How far (0–1) the knob must travel before letting go sends. */
const SEND_THRESHOLD = 0.85;

/**
 * "Send to EHR Slider" from the Figma Bottom Tab page: a slide-to-confirm control.
 * The knob is the iScribe IconButton (rounded, arrow-right icon) recolored to Button Accent.
 */
export const SendSlider = ({
  device = 'iphone',
  label = 'Send to EHR',
  sentLabel = 'Sent to EHR',
  onSend,
  sent: sentProp,
  disabled = false,
  progress,
}: SendSliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ startX: number; max: number } | null>(null);
  const [sentState, setSentState] = useState(false);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [max, setMax] = useState(0);
  const sent = sentProp ?? sentState;

  // Measure how far the knob can travel (track width − knob − padding on both sides).
  useEffect(() => {
    const track = trackRef.current;
    const knob = knobRef.current;
    if (!track || !knob) return;
    const measure = () => {
      const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      setMax(Math.max(0, track.clientWidth - knob.offsetWidth - pad * 2));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, [device]);

  const send = () => {
    if (sent) return;
    if (sentProp === undefined) setSentState(true);
    onSend?.();
  };

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (disabled || sent || progress !== undefined) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX - offset, max };
    setDragging(true);
  };
  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!drag.current) return;
    setOffset(Math.min(drag.current.max, Math.max(0, e.clientX - drag.current.startX)));
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    const reached = drag.current.max > 0 && offset >= drag.current.max * SEND_THRESHOLD;
    drag.current = null;
    setDragging(false);
    if (reached) send();
    setOffset(0);
  };
  // Dragging isn't possible from a keyboard, so Enter/Space on the knob sends instead.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || sent) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      send();
    }
  };

  const x = progress !== undefined ? progress * max : sent ? max : offset;
  // "Send to EHR" fades out as the knob travels (1 at the start → 0 at the end); the sent message is always fully opaque.
  const labelOpacity = sent ? 1 : max > 0 ? 1 - Math.min(1, x / max) : 1;

  return (
    <div
      ref={trackRef}
      className={`is-send-slider is-send-slider--${device}${sent ? ' is-send-slider--sent' : ''}${dragging ? ' is-send-slider--dragging' : ''}`}
    >
      <span
        key={sent ? 'sent' : 'send'}
        className={`is-send-slider__label${sent ? ' is-send-slider__label--sent' : ''}`}
        aria-live="polite"
        style={{ opacity: labelOpacity }}
      >
        {sent ? sentLabel : label}
      </span>
      <IconButton
        ref={knobRef}
        className="is-send-slider__knob"
        icon={<Icon name="arrow-right" />}
        label={sent ? sentLabel : `${label} — drag to the end, or press Enter`}
        variant="primary"
        size={device === 'ipad' ? 'xxl' : 'xl'}
        rounded
        disabled={disabled}
        aria-disabled={sent || undefined}
        style={{ transform: `translateX(${x}px)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};
