import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode, type RefObject } from 'react';
import { Animation } from '../../animations/Animation';
import { Icon } from '../../icons/Icon';
import { AppointmentStatus, AppointmentStatusIcon, type AppointmentStatusValue } from '../AppointmentStatus/AppointmentStatus';
import { EhrIcon, type EhrName } from '../EhrIcon/EhrIcon';
import './ScheduleList.css';

/*
 * Schedule List — Figma "Schedule List" (1133:6822), web and Chrome extension.
 *   VisitType          EHR Icon + the visit type ("Visit")
 *   ScheduleListItem   one appointment: Syncing / Active / Selected, Compact (130px) or Expanded (360px)
 *   ScheduleList       the column of appointments, Collapsed (compact items) or Expanded
 * Built from the existing pieces: EHR Icon, Appointment Status (Note in Progress animates) and the
 * loading-appointment animation, which plays behind "Syncing note…".
 */

/* ---------- Visit type ---------- */

export interface VisitTypeProps {
  /** Label (Figma: "Visit") */
  label?: string;
  /** The appointment's EHR, shown as its logo when integrated */
  ehr?: EhrName;
  /** Integrated with the EHR: its logo. Not integrated: the link icon. */
  integrated?: boolean;
  className?: string;
}

/** Figma "Visit type": the EHR Icon and the visit type, 4px apart, Figtree Medium 11px */
export const VisitType = ({ label = 'Visit', ehr, integrated = false, className = '' }: VisitTypeProps) => (
  <span className={`is-visit-type ${className}`}>
    <EhrIcon ehr={ehr} integrated={integrated && !!ehr} />
    <span className="is-visit-type__label">{label}</span>
  </span>
);

/* ---------- Theme of the page around an element (for Selected, which is drawn in the other mode) ---------- */

const themeAround = (el: Element | null): 'light' | 'dark' =>
  el?.parentElement?.closest('[data-theme]')?.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

const useThemeAround = (ref: RefObject<HTMLElement | null>) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const update = () => setTheme(themeAround(ref.current));
    update();
    // Follows the Light / Dark toggle (and any data-theme block around it)
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [ref]);
  return theme;
};

/* ---------- Item ---------- */

export type ScheduleListItemState = 'syncing' | 'active' | 'selected';
export type ScheduleListItemSize = 'compact' | 'expanded';

/** One appointment on the schedule */
export interface ScheduleAppointment {
  /** Patient name */
  name: string;
  /** Appointment time, e.g. "8:00 AM" */
  time: string;
  /** Appointment status (Appointment Status component) */
  status: AppointmentStatusValue;
  /** Shown when expanded: sex, date of birth and age */
  sex?: string;
  dateOfBirth?: string;
  age?: number | string;
  /** Patient photo URL, shown when expanded; leave out when there is none */
  photo?: string;
  /** Visit type label (default "Visit") */
  visitType?: string;
  /** The appointment's EHR and whether it is integrated (EHR Icon) */
  ehr?: EhrName;
  integrated?: boolean;
}

export interface ScheduleListItemProps extends Partial<ScheduleAppointment> {
  /** Syncing: the note is being synced (animated background). Active: a regular appointment. Selected: the one open. */
  state?: ScheduleListItemState;
  /** Compact: 130px, everything stacked. Expanded: 360px, time and visit type on the left, patient on the right. */
  size?: ScheduleListItemSize;
  /** Show the ⋮ button in the top right corner; called when it is clicked */
  onMoreInfo?: () => void;
  /** Called when the appointment is clicked (or Enter / Space) */
  onClick?: () => void;
  className?: string;
}

/** Figma "Schedule List Item Web and Chrome": one appointment, 100px tall, 16px corners */
export const ScheduleListItem = ({
  state = 'active',
  size = 'compact',
  name = '',
  time = '',
  status = 'not-checked-in',
  sex,
  dateOfBirth,
  age,
  photo,
  visitType = 'Visit',
  ehr,
  integrated = false,
  onMoreInfo,
  onClick,
  className = '',
}: ScheduleListItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const around = useThemeAround(ref);
  const classes = `is-sli is-sli--${state} is-sli--${size} ${className}`;

  if (state === 'syncing') {
    return (
      <div ref={ref} className={classes} role="status" aria-label="Syncing note">
        {/* The loading-appointment animation (Foundations / Animations) in place of Figma's two still circles */}
        <span className="is-sli__pulse" aria-hidden="true">
          <Animation name="loading-appointment" width={size === 'expanded' ? 360 : 240} height={size === 'expanded' ? 360 : 240} />
        </span>
        <SyncingNoteIcon />
        <span className="is-sli__syncing-label">Syncing note…</span>
      </div>
    );
  }

  const info = [sex, dateOfBirth, age].filter((v) => v !== undefined && v !== '');
  const visit = <VisitType label={visitType} ehr={ehr} integrated={integrated} />;
  const clock = <span className="is-sli__time">{time}</span>;
  const onKeyDown = (e: KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  let content: ReactNode;
  if (size === 'compact') {
    content = (
      <div className="is-sli__summary">
        <AppointmentStatusIcon status={status} />
        <span className="is-sli__name is-sli__name--compact">{name}</span>
        {clock}
        {visit}
      </div>
    );
  } else {
    content = (
      <>
        <div className="is-sli__side">
          {photo && (
            <span className="is-sli__photo">
              <img src={photo} alt="" />
            </span>
          )}
          {clock}
          {visit}
        </div>
        <div className="is-sli__visit">
          <span className="is-sli__name">{name}</span>
          {info.length > 0 && (
            <span className="is-sli__info">
              {info.map((v, i) => (
                <span key={i}>{v}</span>
              ))}
            </span>
          )}
          <AppointmentStatus status={status} className="is-sli__status" />
        </div>
      </>
    );
  }

  return (
    <div
      ref={ref}
      className={classes}
      // Selected is drawn in the other mode: dark on a light page, light on a dark page
      data-theme={state === 'selected' ? (around === 'dark' ? 'light' : 'dark') : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-pressed={onClick ? state === 'selected' : undefined}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {content}
      {onMoreInfo && (
        <button
          type="button"
          className="is-sli__more"
          aria-label={`More about ${name}`}
          onClick={(e) => {
            e.stopPropagation();
            onMoreInfo();
          }}
        >
          <Icon name="kebab" size={20} />
        </button>
      )}
    </div>
  );
};

/** Figma "Icon Syncing Note": a phone with the iScribe waves, 20 × 30 */
const SyncingNoteIcon = () => (
  <svg className="is-sli__phone" width="20" height="30" viewBox="0 0 20 30" aria-hidden="true">
    <path
      className="is-sli__phone-body"
      d="M16 0C18.2091 0 20 1.79086 20 4V26C20 28.2091 18.2091 30 16 30H4C1.79086 30 1.12747e-07 28.2091 0 26V4C0 1.79086 1.79086 3.22128e-08 4 0H16ZM7.31836 27C7.04222 27 6.81836 27.2239 6.81836 27.5C6.81836 27.7761 7.04222 28 7.31836 28H12.3184C12.5945 28 12.8184 27.7761 12.8184 27.5C12.8184 27.2239 12.5945 27 12.3184 27H7.31836Z"
    />
    <g className="is-sli__phone-waves" fillRule="evenodd" clipRule="evenodd">
      <path d="M12.1975 18.3074C10.9804 17.0089 9.02247 17.0089 7.80535 18.3074C7.57408 18.5541 7.18797 18.5653 6.94294 18.3324C6.69791 18.0996 6.68675 17.7108 6.91802 17.4641C8.61668 15.6519 11.3861 15.6519 13.0848 17.4641C13.3161 17.7108 13.3049 18.0996 13.0599 18.3324C12.8148 18.5653 12.4287 18.5541 12.1975 18.3074Z" />
      <path d="M15.2463 15.0503C12.3446 11.9547 7.65544 11.9546 4.75374 15.0503C4.52248 15.297 4.13636 15.3083 3.89133 15.0754C3.6463 14.8425 3.63514 14.4538 3.8664 14.207C7.24965 10.5977 12.7504 10.5977 16.1336 14.207C16.3649 14.4538 16.3537 14.8425 16.1087 15.0754C15.8636 15.3083 15.4775 15.297 15.2463 15.0503Z" />
      <path d="M13.7242 16.68C11.6642 14.4824 8.33976 14.4824 6.2798 16.68C6.04854 16.9268 5.66242 16.938 5.41739 16.7051C5.17236 16.4723 5.1612 16.0835 5.39246 15.8368C7.93397 13.1254 12.07 13.1254 14.6115 15.8368C14.8428 16.0835 14.8316 16.4723 14.5866 16.7051C14.3416 16.938 13.9554 16.9268 13.7242 16.68Z" />
    </g>
  </svg>
);

/* ---------- List ---------- */

export interface ScheduleListEntry extends ScheduleAppointment {
  /** Unique id, used for selection */
  id: string;
  /** Show "Syncing note…" in place of this appointment */
  syncing?: boolean;
}

export interface ScheduleListProps {
  /** The appointments, in order */
  appointments: ScheduleListEntry[];
  /** Collapsed: compact items (150px wide). Expanded: expanded items (380px wide). */
  expanded?: boolean;
  /** Id of the selected appointment */
  selectedId?: string;
  /** Called with an appointment's id when it is clicked */
  onSelect?: (id: string) => void;
  /** Show each appointment's ⋮ button; called with its id */
  onMoreInfo?: (id: string) => void;
  /** Height of the list (it scrolls inside). Default: as tall as its appointments. */
  height?: number | string;
  className?: string;
}

/** Figma "Schedule List": the day's appointments on a soft panel, 10px apart, 20px top corners */
export const ScheduleList = ({
  appointments,
  expanded = false,
  selectedId,
  onSelect,
  onMoreInfo,
  height,
  className = '',
}: ScheduleListProps) => (
  <div
    className={`is-schedule-list${expanded ? ' is-schedule-list--expanded' : ''} ${className}`}
    style={height !== undefined ? { height } : undefined}
    role="list"
  >
    {appointments.map(({ id, syncing, ...appointment }) => (
      <div key={id} role="listitem" className="is-schedule-list__row">
        <ScheduleListItem
          {...appointment}
          size={expanded ? 'expanded' : 'compact'}
          state={syncing ? 'syncing' : id === selectedId ? 'selected' : 'active'}
          onClick={onSelect ? () => onSelect(id) : undefined}
          onMoreInfo={onMoreInfo ? () => onMoreInfo(id) : undefined}
        />
      </div>
    ))}
  </div>
);
