import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/icons';
import './Record.css';

/*
 * Building blocks of the Record Feature (Figma "--Record Feature", 706:6705): waves, time, playback bar,
 * round buttons and the recorder state shared by the Record Widget, Mini Record Widget and Focus Mode.
 */

export type RecordDevice = 'iphone' | 'ipad';
/** idle = Figma Default · recording = Recording · paused = Playback / Paused · playing = Playback / Playing */
export type RecordState = 'idle' | 'recording' | 'paused' | 'playing';

/** 0:30 → "00:30" (minutes:seconds, rounded down) */
export const formatTime = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

/* ---------- Recorder state ---------- */

export interface RecorderOptions {
  /** State to start in */
  initialState?: RecordState;
  /** Length of the recording so far, in seconds */
  initialDuration?: number;
  /** Playback position, in seconds */
  initialPosition?: number;
  /** Called whenever the state changes */
  onStateChange?: (state: RecordState) => void;
}

/**
 * The recorder flow from Figma: Start → Recording → Stop → Playback (play / pause / seek) → Resume adds to
 * the recording, Delete clears it. The clock is simulated here; in the app, connect it to the real recorder.
 */
export const useRecorder = ({ initialState = 'idle', initialDuration = 0, initialPosition = 0, onStateChange }: RecorderOptions = {}) => {
  const [state, setState] = useState<RecordState>(initialState);
  const [duration, setDuration] = useState(initialState === 'idle' ? 0 : initialDuration);
  const [position, setPosition] = useState(Math.min(initialPosition, initialDuration));
  const notify = useRef(onStateChange);
  notify.current = onStateChange;

  const go = useCallback((next: RecordState) => {
    setState(next);
    notify.current?.(next);
  }, []);

  // One clock: recording grows the duration, playing moves the position
  useEffect(() => {
    if (state !== 'recording' && state !== 'playing') return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const step = (now - last) / 1000;
      last = now;
      if (state === 'recording') setDuration((d) => d + step);
      else
        setPosition((p) => {
          const next = p + step;
          return next >= duration ? duration : next;
        });
    }, 100);
    return () => window.clearInterval(id);
  }, [state, duration]);

  // Playback stops at the end
  useEffect(() => {
    if (state === 'playing' && duration > 0 && position >= duration) go('paused');
  }, [state, position, duration, go]);

  return {
    state,
    duration,
    position,
    start: () => {
      setDuration(0);
      setPosition(0);
      go('recording');
    },
    stop: () => {
      setPosition(0);
      go('paused');
    },
    resume: () => go('recording'),
    play: () => {
      if (position >= duration) setPosition(0);
      go('playing');
    },
    pause: () => go('paused'),
    seek: (s: number) => setPosition(Math.max(0, Math.min(duration, s))),
    discard: () => {
      setDuration(0);
      setPosition(0);
      go('idle');
    },
  };
};

/* ---------- Round button ---------- */

export type RecordButtonVariant = 'primary' | 'secondary' | 'destructive';

export interface RecordRoundButtonProps {
  icon: IconName;
  /** What it does, read by screen readers and shown on hover */
  label: string;
  variant?: RecordButtonVariant;
  /** Circle size in px (40, 50, 60, 80 or 100 in Figma) */
  size: number;
  /** Icon size in px (16, 18, 22 or 28 in Figma) */
  iconSize: number;
  /** Color of the icon when it differs from the variant (Figma Delete uses the Alert red) */
  iconColor?: string;
  onClick?: () => void;
}

/** Round icon button used for record, stop, play, pause and delete */
export const RecordRoundButton = ({ icon, label, variant = 'secondary', size, iconSize, iconColor, onClick }: RecordRoundButtonProps) => (
  <button
    type="button"
    className={`is-rec-btn is-rec-btn--${variant} is-rec-btn--round`}
    style={{ width: size, height: size, color: iconColor }}
    aria-label={label}
    title={label}
    onClick={onClick}
  >
    <Icon name={icon} size={iconSize} />
  </button>
);

export interface RecordTextButtonProps {
  children: ReactNode;
  icon?: IconName;
  variant?: RecordButtonVariant;
  /** Height in px; the corners follow the radius below */
  height: number;
  fontSize: number;
  iconSize?: number;
  /** Corner radius in px (1000 = pill) */
  radius: number;
  paddingX: number;
  gap: number;
  /** Fill the available width */
  block?: boolean;
  minWidth?: number;
  onClick?: () => void;
}

/** Text button (Start Recording, Resume, Delete) */
export const RecordTextButton = ({ children, icon, variant = 'secondary', height, fontSize, iconSize, radius, paddingX, gap, block, minWidth, onClick }: RecordTextButtonProps) => (
  <button
    type="button"
    className={`is-rec-btn is-rec-btn--${variant}${block ? ' is-rec-btn--block' : ''}`}
    style={{ height, fontSize, borderRadius: radius, padding: `0 ${paddingX}px`, gap, minWidth }}
    onClick={onClick}
  >
    {icon && <Icon name={icon} size={iconSize ?? fontSize + 7} />}
    <span>{children}</span>
  </button>
);

/* ---------- Waves ---------- */

/** Bar heights (px, out of 39) — a fixed, natural-looking pattern repeated along the width */
const WAVE = [22, 31, 16, 36, 24, 12, 28, 39, 20, 33, 14, 26, 37, 18, 30, 11, 25, 35, 21, 15, 32, 27, 13, 38, 23, 17, 29, 34, 19, 26];

export interface WavesProps {
  /** Default = the long waveform; mini = the five-bar icon used in the Mini Record Widget */
  size?: 'default' | 'mini';
  device?: RecordDevice;
  /** Number of bars (default size). Leave out to fill the width. */
  bars?: number;
  /** Bars move while recording */
  live?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Recording waveform (Figma "Waves"): 2px red bars, 3px apart */
export const Waves = ({ size = 'default', device = 'iphone', bars, live = true, className = '', style }: WavesProps) => {
  if (size === 'mini') {
    const heights = device === 'ipad' ? [17, 28, 17, 35, 17] : [8, 13, 8, 16, 8];
    return (
      <span className={`is-rec-waves is-rec-waves--mini is-rec-waves--${device}${live ? ' is-rec-waves--live' : ''} ${className}`} style={style} aria-hidden="true">
        {heights.map((h, i) => (
          <i key={i} style={{ height: h, animationDelay: `${-i * 0.17}s` }} />
        ))}
      </span>
    );
  }
  const count = bars ?? 110;
  return (
    <span className={`is-rec-waves${live ? ' is-rec-waves--live' : ''} ${className}`} style={style} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <i key={i} style={{ height: WAVE[i % WAVE.length], animationDelay: `${-((i * 0.37) % 1.2)}s` }} />
      ))}
    </span>
  );
};

/* ---------- Time ---------- */

export type RecordTimeSize = 'small' | 'medium' | 'large' | 'focus';

const timeFont: Record<RecordDevice, Record<RecordTimeSize, number>> = {
  iphone: { small: 12, medium: 13, large: 15, focus: 50 },
  ipad: { small: 15, medium: 15, large: 18, focus: 80 },
};

export interface RecordTimeProps {
  seconds: number;
  device?: RecordDevice;
  /** small = next to the waves · medium = playback labels · large = mini widget · focus = Focus Mode clock */
  size?: RecordTimeSize;
  /** Red while recording (Status / Alert) */
  recording?: boolean;
  tone?: 'high' | 'medium' | 'low';
  style?: CSSProperties;
}

/** Time readout (Figma "Time progression"), in the Relative Mono 10 Pitch font */
export const RecordTime = ({ seconds, device = 'iphone', size = 'small', recording = false, tone = 'high', style }: RecordTimeProps) => (
  <span
    className={`is-rec-time is-rec-time--${tone}${recording ? ' is-rec-time--recording' : ''}${size === 'focus' ? ' is-rec-time--focus' : ''}`}
    style={{ fontSize: timeFont[device][size], ...style }}
  >
    {formatTime(seconds)}
  </span>
);

/* ---------- Playback ---------- */

export interface PlaybackProps {
  position: number;
  duration: number;
  device?: RecordDevice;
  onSeek?: (seconds: number) => void;
  /** Width of the bar; it fills the space when left out */
  width?: number;
}

/** Playback bar (Figma "Playback"): track, blue progress, white knob, and the times below. Drag or use the arrow keys to seek. */
export const Playback = ({ position, duration, device = 'iphone', onSeek, width }: PlaybackProps) => {
  const track = useRef<HTMLDivElement>(null);
  const share = duration > 0 ? Math.min(1, position / duration) : 0;
  const seekTo = (clientX: number) => {
    const r = track.current?.getBoundingClientRect();
    if (!r || !onSeek) return;
    onSeek(Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * duration);
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    seekTo(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) seekTo(e.clientX);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
    if (step) {
      e.preventDefault();
      onSeek(position + step);
    } else if (e.key === 'Home') onSeek(0);
    else if (e.key === 'End') onSeek(duration);
  };
  return (
    <div className={`is-rec-playback is-rec-playback--${device}`} style={{ width }}>
      <div
        ref={track}
        className="is-rec-playback__track"
        role="slider"
        tabIndex={0}
        aria-label="Playback position"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${formatTime(position)} of ${formatTime(duration)}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
        style={{ '--is-rec-share': share } as CSSProperties}
      >
        <span className="is-rec-playback__bar">
          <span className="is-rec-playback__fill" />
        </span>
        <span className="is-rec-playback__knob" />
      </div>
      <div className="is-rec-playback__times">
        <RecordTime seconds={position} device={device} size="medium" tone={position > 0 ? 'medium' : 'low'} />
        <RecordTime seconds={duration} device={device} size="medium" tone="low" />
      </div>
    </div>
  );
};
