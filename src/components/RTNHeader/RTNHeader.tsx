import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { AnimatedIcon } from '../../icons/AnimatedIcon';
import { Icon } from '../../icons/Icon';
import { IconButton } from '../IconButton/IconButton';
import { formatTime, RecordRoundButton, RecordTextButton, useRecorder, Waves, type RecordState } from '../Record/RecordParts';
import './RTNHeader.css';

/*
 * RTN Header (Web) — Figma "RTN Header" page (3320:26730). Three parts, each usable on its own:
 *   RTNHeaderDetails   visit labels, date · time · check-in, and a "more" button
 *   RTNHeaderPatient   the patient's photo, name and demographics (Figma "Complete Profile"), filled in or empty
 *   RTNHeaderRecord    the record feature: Start Recording → Recording → Playback
 * and RTNHeader, which puts them together as in Figma "RTN Header (Web)".
 */

/* ---------- Details ---------- */

export interface RTNHeaderDetailsProps {
  /** Grey labels at the start of the row (Figma: Visit, Room 12) */
  labels?: string[];
  /** Appointment date */
  date?: string;
  /** Appointment time (shown in semibold) */
  time?: string;
  /** Check-in note at the end */
  checkedIn?: string;
  /** The "more" (meatballs) button */
  onMoreClick?: () => void;
  className?: string;
}

/** Figma "RTN Header Web Details": labels, date • time • check-in, and a "more" icon button on the right */
export const RTNHeaderDetails = ({
  labels = ['Visit', 'Room 12'],
  date = 'Oct 23, 2026',
  time = '11:00 AM',
  checkedIn = 'Checked in 11 min ago',
  onMoreClick,
  className = '',
}: RTNHeaderDetailsProps) => (
  <div className={`is-rtn-details ${className}`}>
    <div className="is-rtn-details__info">
      {labels.length > 0 && (
        <div className="is-rtn-details__labels">
          {labels.map((label) => (
            <span key={label} className="is-rtn-chip">
              {label}
            </span>
          ))}
        </div>
      )}
      {date && <span className="is-rtn-details__muted">{date}</span>}
      {date && time && <span className="is-rtn-dot" aria-hidden="true" />}
      {time && <span className="is-rtn-details__time">{time}</span>}
      {(date || time) && checkedIn && <span className="is-rtn-dot" aria-hidden="true" />}
      {checkedIn && <span className="is-rtn-details__muted">{checkedIn}</span>}
    </div>
    <IconButton icon={<Icon name="meatballs" />} label="More options" variant="ghost" size="regular" onClick={onMoreClick} />
  </div>
);

/* ---------- Patient ---------- */

export interface RTNPatient {
  firstName: string;
  lastName: string;
  /** e.g. "Female" */
  sex: string;
  /** Date of birth, e.g. "03/15/1982" */
  dob: string;
  age: number | string;
  /** Photo URL; leave out when there is no photo */
  photo?: string;
}

/** Web: 90 × 120 photo · Chrome Extension: 60 × 80 photo, tighter spacing */
export type RTNPatientDevice = 'web' | 'chrome-extension';

export interface RTNHeaderPatientProps {
  /** The patient. Leave out for the Figma "Empty" state (blank, dotted fields) */
  patient?: RTNPatient | null;
  device?: RTNPatientDevice;
  /** Show the photo when the patient has one */
  showPhoto?: boolean;
  className?: string;
}

/** Figma "Complete Profile": photo, name and demographics — or dotted blanks when nothing is filled in yet */
export const RTNHeaderPatient = ({ patient, device = 'web', showPhoto = true, className = '' }: RTNHeaderPatientProps) => {
  const blank = (text: string, big = false) => (
    <span className={`is-rtn-blank${big ? ' is-rtn-blank--name' : ''}`} aria-label={`${text}: not filled in`}>
      <span aria-hidden="true">{text}</span>
      <span className="is-rtn-blank__line" aria-hidden="true" />
    </span>
  );
  return (
    <div className={`is-rtn-patient is-rtn-patient--${device}${patient ? '' : ' is-rtn-patient--empty'} ${className}`}>
      {patient && showPhoto && patient.photo && (
        <span className="is-rtn-patient__photo">
          <img src={patient.photo} alt="" />
        </span>
      )}
      {patient ? (
        <div className="is-rtn-patient__info">
          <p className="is-rtn-patient__name">
            {patient.firstName} {patient.lastName}
          </p>
          <p className="is-rtn-patient__demo">
            <span>{patient.sex}</span>
            <span>{patient.dob}</span>
            <span>{patient.age}</span>
          </p>
        </div>
      ) : (
        <div className="is-rtn-patient__info">
          <p className="is-rtn-patient__blanks">
            {blank('First name', true)}
            {blank('Last name', true)}
          </p>
          <p className="is-rtn-patient__blanks">
            {blank('Sex')}
            {blank('MM/DD/YYYY')}
            {blank('Age')}
          </p>
        </div>
      )}
    </div>
  );
};

/* ---------- Record feature ---------- */

export interface RTNHeaderRecordProps {
  /** State to start in; it then runs by itself (idle = Default · recording · paused / playing = Playback) */
  state?: RecordState;
  /** Recording length in seconds, for the playback states */
  duration?: number;
  /** Playback position in seconds */
  position?: number;
  /** The line above the playback bar, e.g. "Sarah Johnson • Visit • Oct 23, 2026" */
  title?: string;
  onStateChange?: (state: RecordState) => void;
  className?: string;
}

/** Bars in the web mini waves (Figma Waves · Device=Web, Size=Mini: 87 × 40px) */
const WEB_BARS = 18;

/**
 * Figma "RTN Header Web Record Feature": Start Recording (Default) → waves, red time and Stop (Recording) →
 * play/pause, the recording's title, a seekable bar and Resume (Playback).
 */
export const RTNHeaderRecord = ({ state: initialState = 'idle', duration = 160, position = 32, title = '', onStateChange, className = '' }: RTNHeaderRecordProps) => {
  const rec = useRecorder({ initialState, initialDuration: duration, initialPosition: position, onStateChange });
  // The first Start grows the waves from dots (as in the Record Widget); Resume brings them back in full
  const [started, setStarted] = useState(false);
  // Width of Start Recording when it was pressed: the stop button morphs from it and the pill grows from behind it
  const [morphFrom, setMorphFrom] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const recording = rec.state === 'recording';
  const playback = rec.state === 'paused' || rec.state === 'playing';

  return (
    <div ref={root} className={`is-rec is-rtn-rec ${className}`}>
      {rec.state === 'idle' && (
        <RecordTextButton
          className="is-rtn-rec__enter"
          variant="primary"
          icon="mic"
          height={60}
          fontSize={15}
          iconSize={22}
          radius={1000}
          paddingX={20}
          gap={12}
          onClick={() => {
            const start = root.current?.querySelector<HTMLElement>('.is-rec-btn');
            setMorphFrom(start ? start.offsetWidth : null);
            setStarted(true);
            rec.start();
          }}
        >
          Start Recording
        </RecordTextButton>
      )}

      {recording && (
        <div
          className={`is-rtn-rec__pill ${morphFrom ? 'is-rtn-rec__pill--grow' : 'is-rtn-rec__enter'}`}
          style={morphFrom ? ({ '--is-rtn-from-w': `${morphFrom}px` } as CSSProperties) : undefined}
        >
          <Waves bars={WEB_BARS} intro={started} className="is-rec-waves--web-mini" />
          <span className="is-rtn-rec__time" aria-live="off">
            {formatTime(rec.duration)}
          </span>
          <span className="is-rtn-rec__stop">
            <RecordRoundButton
              icon="stop-flat"
              label="Stop recording"
              variant="destructive"
              size={60}
              iconSize={22}
              onClick={() => {
                setMorphFrom(null);
                rec.stop();
              }}
            />
            {/* Start Recording, shrinking into the stop button (decorative) */}
            {morphFrom && (
              <span className="is-rtn-rec__ghost" aria-hidden="true">
                <Icon name="mic" size={22} />
                <span>Start Recording</span>
              </span>
            )}
          </span>
        </div>
      )}

      {playback && (
        <div className="is-rtn-rec__pill is-rtn-rec__pill--wide is-rtn-rec__enter">
          <button
            type="button"
            className="is-rtn-rec__play"
            aria-label={rec.state === 'playing' ? 'Pause' : 'Play'}
            title={rec.state === 'playing' ? 'Pause' : 'Play'}
            onClick={rec.state === 'playing' ? rec.pause : rec.play}
          >
            <AnimatedIcon
              name="play-pause"
              state={rec.state === 'playing' ? 'pause' : 'play'}
              size={40}
              fallback={<Icon name={rec.state === 'playing' ? 'pause-flat' : 'play-flat'} size={40} />}
            />
          </button>
          <RTNTimeline title={title} position={rec.position} duration={rec.duration} onSeek={rec.seek} />
          <RecordTextButton
            icon="mic"
            height={60}
            fontSize={15}
            iconSize={22}
            radius={1000}
            paddingX={20}
            gap={12}
            onClick={() => {
              setStarted(false);
              rec.resume();
            }}
          >
            Resume
          </RecordTextButton>
        </div>
      )}
    </div>
  );
};

/** Playback timeline: title, a 5px bar (drag, click or ← → to seek) and the times below */
const RTNTimeline = ({ title, position, duration, onSeek }: { title: string; position: number; duration: number; onSeek: (s: number) => void }) => {
  const track = useRef<HTMLDivElement>(null);
  const share = duration > 0 ? Math.min(1, position / duration) : 0;
  const seekTo = (clientX: number) => {
    const r = track.current?.getBoundingClientRect();
    if (r && r.width > 0) onSeek(Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * duration);
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Not every pointer can be captured (e.g. a simulated one); seeking still works
    }
    seekTo(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.buttons) seekTo(e.clientX);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5 }[e.key];
    if (step) {
      e.preventDefault();
      onSeek(position + step);
    } else if (e.key === 'Home') onSeek(0);
    else if (e.key === 'End') onSeek(duration);
  };
  return (
    <div className="is-rtn-timeline">
      {title && <p className="is-rtn-timeline__title">{title}</p>}
      <div
        ref={track}
        className="is-rtn-timeline__track"
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
      >
        <span className="is-rtn-timeline__fill" style={{ width: `${share * 100}%` }} />
      </div>
      <div className="is-rtn-timeline__times">
        <span>{formatTime(position)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

/* ---------- RTN Header ---------- */

export interface RTNHeaderProps extends Omit<RTNHeaderDetailsProps, 'className'> {
  /** The patient; leave out for the empty (not filled in) profile */
  patient?: RTNPatient | null;
  /** Show the patient's photo */
  showPhoto?: boolean;
  /** Record feature state to start in (idle = Start Recording) */
  recordState?: RecordState;
  /** Recording length in seconds, for the playback states */
  duration?: number;
  /** Playback position in seconds */
  position?: number;
  onRecordStateChange?: (state: RecordState) => void;
  className?: string;
  style?: CSSProperties;
}

/** Figma "RTN Header (Web)": details on top; the patient on the left and the record feature on the right */
export const RTNHeader = ({
  labels = ['Visit', 'Room 12'],
  date = 'Oct 23, 2026',
  time = '11:00 AM',
  checkedIn = 'Checked in 11 min ago',
  onMoreClick,
  patient,
  showPhoto = true,
  recordState = 'idle',
  duration,
  position,
  onRecordStateChange,
  className = '',
  style,
}: RTNHeaderProps) => {
  // The playback title, as in Figma: "Sarah Johnson • Visit • Oct 23, 2026"
  const title = [patient ? `${patient.firstName} ${patient.lastName}` : '', labels[0] ?? '', date ?? ''].filter(Boolean).join(' • ');
  return (
    <header className={`is-rtn ${className}`} style={style}>
      <RTNHeaderDetails labels={labels} date={date} time={time} checkedIn={checkedIn} onMoreClick={onMoreClick} />
      <div className="is-rtn__row">
        <RTNHeaderPatient patient={patient} showPhoto={showPhoto} />
        <RTNHeaderRecord state={recordState} duration={duration} position={position} title={title} onStateChange={onRecordStateChange} />
      </div>
    </header>
  );
};
