import { useState, type CSSProperties } from 'react';
import { RecordRoundButton, RecordTime, useRecorder, Waves, type RecordDevice, type RecordState } from './RecordParts';

export type MiniRecordState = 'idle' | 'recording' | 'stopped';
/** iPhone and iPad, or Web (desktop browser) */
export type MiniRecordDevice = RecordDevice | 'web';

export interface MiniRecordWidgetProps {
  /** iPhone (40px button) or iPad (80px button) */
  device?: MiniRecordDevice;
  /** idle = Figma Default · recording = Recording · stopped = Playback */
  state?: MiniRecordState;
  /** Recording length in seconds when it starts stopped */
  duration?: number;
  onStateChange?: (state: RecordState) => void;
  className?: string;
  style?: CSSProperties;
}

const size = { iphone: { round: 40, icon: 16 }, ipad: { round: 80, icon: 28 }, web: { round: 40, icon: 16 } } as const;

/** Bars in the web mini waves (Figma Waves · Device=Web, Size=Mini: 87 × 40px) */
const WEB_BARS = 18;

/**
 * Mini Record Widget (Figma "Mini Record Widget"): time and one round button, right-aligned.
 * iPhone and iPad follow Figma; Web uses the web mini waves (18 bars) while recording.
 * Dark mic to start, red stop while recording (with small waves), white mic to record again.
 */
export const MiniRecordWidget = ({ device = 'iphone', state = 'idle', duration = 30, onStateChange, className = '', style }: MiniRecordWidgetProps) => {
  const rec = useRecorder({ initialState: state === 'stopped' ? 'paused' : state, initialDuration: duration, onStateChange });
  const s = size[device];
  // After the first tap on the mic, the waves begin as dots and grow from the centre out (as in the Record Widget)
  const [started, setStarted] = useState(false);
  const startRecording = () => {
    setStarted(true);
    rec.start();
  };
  const recordAgain = () => {
    setStarted(false);
    rec.resume();
  };
  const recording = rec.state === 'recording';
  return (
    <div className={`is-rec is-rec-mini is-rec-mini--${device} ${className}`} style={style}>
      {recording &&
        (device === 'web' ? (
          <Waves bars={WEB_BARS} intro={started} className="is-rec-waves--web-mini" />
        ) : (
          <Waves size="mini" device={device} intro={started} />
        ))}
      <RecordTime seconds={rec.duration} device={device === 'web' ? 'iphone' : device} size="large" recording={recording} />
      {recording ? (
        <RecordRoundButton icon="stop-flat" label="Stop recording" variant="destructive" size={s.round} iconSize={s.icon} onClick={rec.stop} />
      ) : (
        <RecordRoundButton
          icon="mic"
          label={rec.state === 'idle' ? 'Start recording' : 'Record again'}
          variant={rec.state === 'idle' ? 'primary' : 'secondary'}
          size={s.round}
          iconSize={s.icon}
          onClick={rec.state === 'idle' ? startRecording : recordAgain}
        />
      )}
    </div>
  );
};
