import type { CSSProperties } from 'react';
import { Playback, RecordRoundButton, RecordTime, useRecorder, Waves, type RecordDevice, type RecordState } from './RecordParts';

export interface RecordFocusModeProps {
  /** iPhone (80px button, 50px clock) or iPad (100px button, 80px clock) */
  device?: RecordDevice;
  /** State to start in; it then runs by itself */
  state?: RecordState;
  /** Recording length in seconds, for the playback states */
  duration?: number;
  /** Playback position in seconds */
  position?: number;
  /** Show a Delete button next to the record button during playback (Figma "Play/Pause/Delete") */
  showDelete?: boolean;
  onStateChange?: (state: RecordState) => void;
  className?: string;
  style?: CSSProperties;
}

const size = {
  iphone: { main: 80, mainIcon: 28, side: 60, sideIcon: 22, play: 50, playIcon: 18 },
  ipad: { main: 100, mainIcon: 28, side: 60, sideIcon: 22, play: 60, playIcon: 22 },
} as const;

const hint: Record<RecordState, string> = {
  idle: 'Ready to Record',
  recording: 'Tap to Stop',
  paused: 'Tap to Resume',
  playing: 'Tap to Resume',
};

/**
 * Record Feature in Focus Mode (Figma "Record Feature (Focus Mode)"): a large clock, a hint, one big button,
 * and the waves or playback bar at the bottom.
 */
export const RecordFocusMode = ({
  device = 'iphone',
  state: initialState = 'idle',
  duration = 30,
  position = 0,
  showDelete = false,
  onStateChange,
  className = '',
  style,
}: RecordFocusModeProps) => {
  const rec = useRecorder({ initialState, initialDuration: duration, initialPosition: position, onStateChange });
  const s = size[device];
  const recording = rec.state === 'recording';
  const playback = rec.state === 'paused' || rec.state === 'playing';

  return (
    <div className={`is-rec is-rec-focus is-rec-focus--${device} ${className}`} style={style}>
      <RecordTime seconds={rec.duration} device={device} size="focus" recording={recording} />
      <p className="is-rec-focus__hint">{hint[rec.state]}</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {playback && showDelete && (
          <RecordRoundButton icon="trash" label="Delete recording" size={s.side} iconSize={s.sideIcon} iconColor="var(--is-status-foreground-alert)" onClick={rec.discard} />
        )}
        {rec.state === 'idle' && <RecordRoundButton icon="mic" label="Start recording" variant="primary" size={s.main} iconSize={s.mainIcon} onClick={rec.start} />}
        {recording && <RecordRoundButton icon="stop-flat" label="Stop recording" variant="destructive" size={s.main} iconSize={s.mainIcon} onClick={rec.stop} />}
        {playback && <RecordRoundButton icon="mic" label="Resume recording" size={s.main} iconSize={s.mainIcon} onClick={rec.resume} />}
        {playback && showDelete && <span style={{ width: s.side }} aria-hidden="true" />}
      </div>

      <div className="is-rec-focus__bottom">
        {recording && <Waves />}
        {playback && (
          <>
            <RecordRoundButton
              icon={rec.state === 'playing' ? 'pause-flat' : 'play-flat'}
              label={rec.state === 'playing' ? 'Pause' : 'Play'}
              size={s.play}
              iconSize={s.playIcon}
              onClick={rec.state === 'playing' ? rec.pause : rec.play}
            />
            <Playback position={rec.position} duration={rec.duration} device={device} onSeek={rec.seek} />
          </>
        )}
      </div>
    </div>
  );
};
