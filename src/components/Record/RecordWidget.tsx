import { useState, type CSSProperties } from 'react';
import {
  Playback,
  RecordRoundButton,
  RecordTextButton,
  RecordTime,
  useRecorder,
  Waves,
  type RecordDevice,
  type RecordState,
} from './RecordParts';

export type RecordStartDevice = RecordDevice | 'chrome';

export interface RecordStartButtonProps {
  /** iPhone 70px · iPad 80px (220px wide) · Chrome Extension 60px */
  device?: RecordStartDevice;
  label?: string;
  onClick?: () => void;
}

const start = {
  iphone: { height: 70, fontSize: 15, iconSize: 22, radius: 20, paddingX: 20, gap: 12, block: true },
  chrome: { height: 60, fontSize: 15, iconSize: 22, radius: 20, paddingX: 20, gap: 12, block: true },
  ipad: { height: 80, fontSize: 18, iconSize: 28, radius: 24, paddingX: 24, gap: 14, block: false },
} as const;

/** Figma "Record Button": the dark Start Recording button */
export const RecordStartButton = ({ device = 'iphone', label = 'Start Recording', onClick }: RecordStartButtonProps) => {
  const s = start[device];
  return (
    <RecordTextButton
      variant="primary"
      icon="mic"
      height={s.height}
      fontSize={s.fontSize}
      iconSize={s.iconSize}
      radius={s.radius}
      paddingX={s.paddingX}
      gap={s.gap}
      block={s.block}
      minWidth={device === 'ipad' ? 220 : undefined}
      onClick={onClick}
    >
      {label}
    </RecordTextButton>
  );
};

export interface RecordWidgetProps {
  /** iPhone or iPad sizes */
  device?: RecordDevice;
  /** State to start in. The widget then runs by itself: Start → Stop → Play / Pause → Resume or Delete. */
  state?: RecordState;
  /** Recording length in seconds, for the playback states */
  duration?: number;
  /** Playback position in seconds */
  position?: number;
  /** Show the red Delete button next to Resume during playback (Figma State=Delete) */
  showDelete?: boolean;
  /** Width of the widget in px (Figma: 396) */
  width?: number;
  onStateChange?: (state: RecordState) => void;
  className?: string;
  style?: CSSProperties;
}

const size = {
  iphone: { round: 40, icon: 16, resumeH: 40, resumeFont: 13, resumePad: 12, deleteRadius: 12, waves: 300 },
  ipad: { round: 60, icon: 22, resumeH: 60, resumeFont: 15, resumePad: 20, deleteRadius: 20, waves: 100 },
} as const;

/**
 * Record Widget (Figma "Record Widget"): a one-line recorder. Default shows Start Recording; while recording,
 * red waves, the time and a Stop button; after stopping, play / pause, the playback bar and Resume
 * (plus Delete when showDelete is on).
 */
export const RecordWidget = ({
  device = 'iphone',
  state: initialState = 'idle',
  duration = 30,
  position = 0,
  showDelete = false,
  width = 396,
  onStateChange,
  className = '',
  style,
}: RecordWidgetProps) => {
  const rec = useRecorder({ initialState, initialDuration: duration, initialPosition: position, onStateChange });
  const s = size[device];
  // After Start Recording, the waves begin as dots and grow into shape
  const [started, setStarted] = useState(false);
  // After Stop, Play slides in from the left and Resume (and Delete) from the right
  const [stopped, setStopped] = useState(false);
  const stopRecording = () => {
    setStopped(true);
    rec.stop();
  };
  const startRecording = () => {
    setStarted(true);
    rec.start();
  };

  if (rec.state === 'idle')
    return (
      <div className={`is-rec is-rec-widget is-rec-widget--${device} ${className}`} style={{ width, justifyContent: 'center', ...style }}>
        <RecordStartButton device={device} onClick={startRecording} />
      </div>
    );

  if (rec.state === 'recording')
    return (
      <div className={`is-rec is-rec-widget is-rec-widget--${device} ${className}`} style={{ width, ...style }} aria-live="off">
        <Waves intro={started} style={{ maxWidth: s.waves }} />
        <RecordTime seconds={rec.duration} device={device} size="small" recording />
        <RecordRoundButton icon="stop-flat" label="Stop recording" variant="destructive" size={s.round} iconSize={s.icon} onClick={stopRecording} />
      </div>
    );

  const playing = rec.state === 'playing';
  return (
    <div className={`is-rec is-rec-widget is-rec-widget--${device} ${className}`} style={{ width, ...style }}>
      <RecordRoundButton
        icon={playing ? 'pause-flat' : 'play-flat'}
        label={playing ? 'Pause' : 'Play'}
        size={s.round}
        iconSize={s.icon}
        onClick={playing ? rec.pause : rec.play}
        className={stopped ? 'is-rec-enter-left' : ''}
      />
      <Playback position={rec.position} duration={rec.duration} device={device} onSeek={rec.seek} />
      <RecordTextButton
        height={s.resumeH}
        fontSize={s.resumeFont}
        radius={1000}
        paddingX={s.resumePad}
        gap={6}
        className={stopped ? 'is-rec-enter-right' : ''}
        onClick={() => {
          setStarted(false);
          rec.resume();
        }}>
        Resume
      </RecordTextButton>
      {showDelete && (
        <RecordTextButton
          variant="destructive"
          icon="trash"
          iconSize={s.icon}
          height={s.resumeH}
          fontSize={s.resumeFont}
          radius={s.deleteRadius}
          paddingX={s.resumePad}
          gap={device === 'ipad' ? 12 : 6}
          className={stopped ? 'is-rec-enter-right' : ''}
          onClick={rec.discard}
        >
          Delete
        </RecordTextButton>
      )}
    </div>
  );
};
