import type { CSSProperties } from 'react';
import { RecordRoundButton, RecordTime, useRecorder, Waves, type RecordDevice, type RecordState } from './RecordParts';

export type MiniRecordState = 'idle' | 'recording' | 'stopped';

export interface MiniRecordWidgetProps {
  /** iPhone (40px button) or iPad (80px button) */
  device?: RecordDevice;
  /** idle = Figma Default · recording = Recording · stopped = Playback */
  state?: MiniRecordState;
  /** Recording length in seconds when it starts stopped */
  duration?: number;
  onStateChange?: (state: RecordState) => void;
  className?: string;
  style?: CSSProperties;
}

const size = { iphone: { round: 40, icon: 16 }, ipad: { round: 80, icon: 28 } } as const;

/**
 * Mini Record Widget (Figma "Mini Record Widget"): time and one round button, right-aligned.
 * Dark mic to start, red stop while recording (with small waves), white mic to record again.
 */
export const MiniRecordWidget = ({ device = 'iphone', state = 'idle', duration = 30, onStateChange, className = '', style }: MiniRecordWidgetProps) => {
  const rec = useRecorder({ initialState: state === 'stopped' ? 'paused' : state, initialDuration: duration, onStateChange });
  const s = size[device];
  const recording = rec.state === 'recording';
  return (
    <div className={`is-rec is-rec-mini is-rec-mini--${device} ${className}`} style={style}>
      {recording && <Waves size="mini" device={device} />}
      <RecordTime seconds={rec.duration} device={device} size="large" recording={recording} />
      {recording ? (
        <RecordRoundButton icon="stop-flat" label="Stop recording" variant="destructive" size={s.round} iconSize={s.icon} onClick={rec.stop} />
      ) : (
        <RecordRoundButton
          icon="mic"
          label={rec.state === 'idle' ? 'Start recording' : 'Record again'}
          variant={rec.state === 'idle' ? 'primary' : 'secondary'}
          size={s.round}
          iconSize={s.icon}
          onClick={rec.state === 'idle' ? rec.start : rec.resume}
        />
      )}
    </div>
  );
};
