import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatedIcon } from '../../icons/AnimatedIcon';
import { Icon } from '../../icons/Icon';
import { IconButton } from '../IconButton/IconButton';
import { MicSettings, type MicSettingsProps } from '../MicSettings/MicSettings';
import { ScheduleCalendarPanel } from '../ScheduleSideBar/SchedulePanels';
import { SelectionList } from '../SelectionList/SelectionList';
import { Tabs } from '../Tabs/Tabs';
import { formatTime, RecordRoundButton, RecordTextButton, useRecorder, Waves, type RecordState } from '../Record/RecordParts';
import './RTNHeader.css';

/*
 * RTN Header (Web) — Figma "RTN Header" page (3320:26730). Three parts, each usable on its own:
 *   RTNHeaderDetails   visit labels, date · time · check-in, and a "more" button
 *   RTNHeaderPatient   the patient's photo, name and demographics (Figma "Complete Profile"), filled in or empty
 *   RTNHeaderRecord    the record feature: Start Recording → Recording → Playback
 * and RTNHeader, which puts them together as in Figma "RTN Header (Web)".
 */

/* ---------- Date and time ---------- */

/** A date as the header shows it: "Nov 16, 2026" */
export const formatRTNDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
/** A time as the header shows it: "3:20 PM" */
export const formatRTNTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(/\s/g, ' ');

/** The current date and time, refreshed on the minute while `live` (i.e. while the header is showing it) */
const useNow = (live: boolean) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!live) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setNow(new Date());
        schedule();
      }, 60_000 - (Date.now() % 60_000));
    };
    setNow(new Date());
    schedule();
    return () => clearTimeout(timer);
  }, [live]);
  return now;
};

/* ---------- Details ---------- */

export interface RTNHeaderDetailsProps {
  /** Grey labels at the start of the row (Figma: Visit, Room 12) */
  labels?: string[];
  /** Appointment date, e.g. "Oct 23, 2026". Leave out to show today's date; pass "" to hide it. Click it to edit it. */
  date?: string;
  /** Appointment time, e.g. "11:00 AM". Leave out to show the current time; pass "" to hide it. Click it to edit it. */
  time?: string;
  /** Called with the date as it is edited */
  onDateChange?: (date: string) => void;
  /** Called with the time as it is edited */
  onTimeChange?: (time: string) => void;
  /** Check-in note at the end */
  checkedIn?: string;
  /** Show Delete Recording (the trash, next to the mic) — once there is a recording */
  deleteRecording?: boolean;
  onDeleteRecording?: () => void;
  /** The Mic Settings on the right: its card's contents and state (it opens below, lined up on the right) */
  micSettings?: Omit<MicSettingsProps, 'placement' | 'align' | 'variant'>;
  className?: string;
}

/**
 * Figma "RTN Header Web Details": labels, date • time • check-in (date and time in SemiBold, medium contrast; click
 * either to edit it in place, like the patient's details); on the right, Delete Recording (Destructive
 * Secondary Icon Button, once there is a recording) and Mic Settings (Ghost Icon Button)
 */
export const RTNHeaderDetails = ({
  labels = ['Visit', 'Room 12'],
  date: dateProp,
  time: timeProp,
  onDateChange,
  onTimeChange,
  checkedIn = 'Checked in 11 min ago',
  deleteRecording = false,
  onDeleteRecording,
  micSettings,
  className = '',
}: RTNHeaderDetailsProps) => {
  // What was typed into the date and time (until the props change)
  const [editedDate, setEditedDate] = useState<string | null>(null);
  const [editedTime, setEditedTime] = useState<string | null>(null);
  useEffect(() => setEditedDate(null), [dateProp]);
  useEffect(() => setEditedTime(null), [timeProp]);
  const now = useNow((dateProp === undefined && editedDate === null) || (timeProp === undefined && editedTime === null));
  const date = editedDate ?? dateProp ?? formatRTNDate(now);
  const time = editedTime ?? timeProp ?? formatRTNTime(now);
  const showDate = dateProp !== '';
  const showTime = timeProp !== '';
  return (
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
        {showDate && (
          <span className="is-rtn-details__when">
            <DateField
              value={date}
              label="Appointment date"
              onChange={(v) => {
                setEditedDate(v);
                onDateChange?.(v);
              }}
            />
          </span>
        )}
        {showDate && showTime && <span className="is-rtn-dot" aria-hidden="true" />}
        {showTime && (
          <span className="is-rtn-details__when">
            <TimeField
              value={time}
              label="Appointment time"
              onChange={(v) => {
                setEditedTime(v);
                onTimeChange?.(v);
              }}
            />
          </span>
        )}
        {(showDate || showTime) && checkedIn && <span className="is-rtn-dot" aria-hidden="true" />}
        {checkedIn && <span className="is-rtn-details__muted">{checkedIn}</span>}
      </div>
      <div className="is-rtn-details__actions">
        {deleteRecording && (
          <IconButton
            className="is-rtn-details__delete"
            icon={<Icon name="trash" />}
            label="Delete recording"
            variant="destructive-outline"
            size="regular"
            onClick={onDeleteRecording}
          />
        )}
        <MicSettings placement="bottom" align="end" variant="ghost" {...micSettings} />
      </div>
    </div>
  );
};

/* ---------- Patient ---------- */

export interface RTNPatient {
  firstName: string;
  lastName: string;
  /** "Female" or "Male" */
  sex: string;
  /** Date of birth, MM/DD/YYYY, e.g. "03/15/1982" */
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
  /** Called with the patient as it is edited (any field can be clicked and edited) */
  onPatientChange?: (patient: RTNPatient) => void;
  className?: string;
}

/** Options for the sex field (shown in a Selection List) */
const SEX_OPTIONS = [
  { value: 'Female', label: 'Female' },
  { value: 'Male', label: 'Male' },
];

/** Date of birth mask; digits fill the letters and the separators are added automatically */
const DOB_MASK = 'MM/DD/YYYY';
const DOB_SEP = '/';

/** Digits typed into the date of birth → "MM/DD/YYYY" (adds the separator right after MM and DD while typing) */
const maskDob = (input: string, typing: boolean) => {
  const d = input.replace(/\D/g, '').slice(0, 8);
  let out = d.slice(0, 2);
  if (d.length > 2 || (typing && d.length === 2)) out += DOB_SEP + d.slice(2, 4);
  if (d.length > 4 || (typing && d.length === 4)) out += DOB_SEP + d.slice(4);
  return out;
};

/** Age in whole years for a complete, real, past MM/DD/YYYY date; otherwise null */
const ageFromDob = (dob: string, today = new Date()) => {
  const m = /^(\d{2})\D(\d{2})\D(\d{4})$/.exec(dob);
  if (!m) return null;
  const [month, day, year] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const born = new Date(year, month - 1, day);
  if (born.getFullYear() !== year || born.getMonth() !== month - 1 || born.getDate() !== day || born > today || year < 1900) return null;
  const hadBirthday = today.getMonth() > month - 1 || (today.getMonth() === month - 1 && today.getDate() >= day);
  return today.getFullYear() - year - (hadBirthday ? 0 : 1);
};

type PatientFields = Pick<RTNPatient, 'firstName' | 'lastName' | 'sex' | 'dob'> & { age: string };
const toFields = (p?: RTNPatient | null): PatientFields => ({
  firstName: p?.firstName ?? '',
  lastName: p?.lastName ?? '',
  sex: p?.sex ?? '',
  dob: p?.dob ?? '',
  age: p?.age === undefined || p?.age === null ? '' : String(p.age),
});

/** Put the caret at the end of an element's text */
const caretToEnd = (el: HTMLElement) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
};

/**
 * A field you click and type into, edited as text in place (contenteditable) rather than in a text box, so it
 * keeps the page's fonts (Season Mix names) while typing. It is exactly as wide as its text — or its
 * placeholder while empty — so neighbours stay the same distance away. Blank fields show the placeholder over
 * the Figma dotted line; the line turns accent while editing.
 */
const TextField = ({
  value,
  placeholder,
  label,
  onChange,
  format = (text) => text,
  numeric,
  mask,
}: {
  value: string;
  placeholder: string;
  label: string;
  onChange: (value: string) => void;
  /** Clean up what was typed (e.g. digits only); `typing` is false for deletions */
  format?: (text: string, typing: boolean) => string;
  numeric?: boolean;
  /** Show the rest of this mask (low contrast) after what has been typed */
  mask?: string;
}) => {
  const edit = useRef<HTMLSpanElement>(null);

  // Keep the text in step when the value changes from outside (a new patient, or the age set from the date)
  useLayoutEffect(() => {
    const el = edit.current;
    if (el && el.textContent !== value) el.textContent = value;
  }, [value]);

  const editable = (
    <span
      ref={edit}
      className="is-rtn-field__edit"
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      role="textbox"
      aria-label={label}
      aria-placeholder={placeholder}
      inputMode={numeric ? 'numeric' : undefined}
      spellCheck={false}
      tabIndex={0}
      onInput={(e) => {
        const el = e.currentTarget;
        const typing = ((e.nativeEvent as InputEvent).inputType ?? '').startsWith('insert');
        const raw = (el.textContent ?? '').replace(/\n/g, '');
        const next = format(raw, typing);
        // Rewrite the text when it was cleaned up (or emptied, so no stray line break is left behind)
        if (next !== el.textContent || next === '') {
          el.textContent = next;
          if (next) caretToEnd(el);
        }
        onChange(next);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      onPaste={(e) => {
        // Plain text only, on one line
        e.preventDefault();
        document.execCommand('insertText', false, e.clipboardData.getData('text/plain').replace(/\s+/g, ' '));
      }}
    />
  );

  return (
    <span
      className={`is-rtn-field${value ? '' : ' is-rtn-field--blank'}`}
      // Clicking the placeholder or the rest of the mask puts the caret at the end of the text
      onMouseDown={(e) => {
        const el = edit.current;
        if (el && e.target !== el) {
          e.preventDefault();
          el.focus();
          caretToEnd(el);
        }
      }}
    >
      {mask ? (
        <span className="is-rtn-field__masked">
          {editable}
          <span className="is-rtn-field__rest" aria-hidden="true">
            {mask.slice(value.length)}
          </span>
        </span>
      ) : (
        <>
          <span className="is-rtn-field__placeholder" aria-hidden="true">
            {placeholder}
          </span>
          {editable}
        </>
      )}
      <span className="is-rtn-field__line" aria-hidden="true" />
    </span>
  );
};

/** The sex field: a button that opens a Selection List (Female / Male) below it */
const SelectField = ({ value, placeholder, label, options, onChange }: { value: string; placeholder: string; label: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) => {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  // Close on a click outside; when it opens, move focus to the selected (or first) option
  useEffect(() => {
    if (!open) return;
    root.current?.querySelector<HTMLElement>('.is-rtn-field__menu [tabindex="0"]')?.focus();
    const onDown = (e: globalThis.PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  return (
    <span ref={root} className={`is-rtn-field is-rtn-field--select${value ? '' : ' is-rtn-field--blank'}${open ? ' is-rtn-field--open' : ''}`}>
      <button
        ref={button}
        type="button"
        aria-label={value ? `${label}: ${value}` : label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {value || placeholder}
      </button>
      <span className="is-rtn-field__line" aria-hidden="true" />
      {open && (
        <span
          id={menuId}
          className="is-rtn-field__menu"
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Tab') {
              if (e.key === 'Escape') e.preventDefault();
              setOpen(false);
              if (e.key === 'Escape') button.current?.focus();
            }
          }}
        >
          {/* Components / Selection List */}
          <SelectionList
            options={options}
            value={value || null}
            onChange={(v) => {
              onChange(v);
              setOpen(false);
              button.current?.focus();
            }}
            device="web"
            width={160}
            aria-label={label}
          />
        </span>
      )}
    </span>
  );
};

/**
 * The appointment date: a button that opens the date picker (Components / Schedule Side Bar › Calendar, without its
 * header) below it. Picking a day sets the date ("Nov 24, 2026") and closes it; a click outside or Escape closes it.
 */
const DateField = ({ value, label, onChange }: { value: string; label: string; onChange: (value: string) => void }) => {
  const [open, setOpen] = useState(false);
  // Where the picker goes: 10px below the date, lined up with it. It is placed in the details row (not inside the
  // date), because the row's info is clipped (overflow hidden, to keep long text on one line) and would cut it off;
  // its offset is measured from the row, so it stays under the date wherever the header is drawn.
  const [at, setAt] = useState<{ host: HTMLElement; left: number; top: number } | null>(null);
  const root = useRef<HTMLSpanElement>(null);
  const menu = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const parsed = new Date(value);
  const day = Number.isNaN(parsed.getTime()) ? new Date() : parsed;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: globalThis.PointerEvent) => {
      const t = e.target as Node;
      if (!root.current?.contains(t) && !menu.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      button.current?.focus();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span ref={root} className={`is-rtn-field is-rtn-field--select${open ? ' is-rtn-field--open' : ''}`}>
      <button
        ref={button}
        type="button"
        aria-label={`${label}: ${value}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          const host = button.current?.closest<HTMLElement>('.is-rtn-details');
          const b = button.current?.getBoundingClientRect();
          if (host && b) {
            const row = host.getBoundingClientRect();
            setAt({ host, left: b.left - row.left, top: b.bottom - row.top + 10 });
          }
          setOpen((o) => !o);
        }}
      >
        {value}
      </button>
      <span className="is-rtn-field__line" aria-hidden="true" />
      {open &&
        at &&
        createPortal(
          <span ref={menu} className="is-rtn-field__menu is-rtn-field__menu--calendar" style={{ left: at.left, top: at.top }}>
            <ScheduleCalendarPanel
              header={false}
              value={day}
              onChange={(d) => {
                onChange(formatRTNDate(d));
                setOpen(false);
                button.current?.focus();
              }}
            />
          </span>,
          at.host,
        )}
    </span>
  );
};

/** The time's mask: four digit slots around a fixed ":" */
const TIME_MASK = ['H', 'H', 'M', 'M'];
const timeOptions = [
  { value: 'AM', label: 'AM' },
  { value: 'PM', label: 'PM' },
];

/** "9:40 AM" → the four digit slots ("0940") and AM / PM; empty slots when it can't be read */
const parseTime = (value: string): { digits: string[]; period: 'AM' | 'PM' } => {
  const m = /^\s*(\d{1,2}):(\d{2})\s*([AaPp])?/.exec(value);
  const period = /p/i.test(m?.[3] ?? '') ? 'PM' : 'AM';
  if (!m) return { digits: ['', '', '', ''], period };
  return { digits: [...m[1].padStart(2, '0'), ...m[2]], period };
};

/** Whether `digit` may go in slot `i`, given the slots so far (hours 01–12, minutes 00–59) */
const fitsTime = (digits: string[], i: number, digit: string) => {
  const d = Number(digit);
  if (i === 0) return d <= 1;
  if (i === 1) return digits[0] === '1' ? d <= 2 : digits[0] === '0' ? d >= 1 : true;
  if (i === 2) return d <= 5;
  return true;
};

/**
 * The appointment time. Shown as "9:40 AM"; click it to edit. While editing, the time is an HH:MM mask that never
 * loses its ":" — typing fills the digits, Backspace / Delete empty one (its letter comes back, e.g. "10:2M" or
 * "HH:40"), ← → and clicks move between them — and AM / PM is a toggle next to it (Components / Tabs, Web).
 * Enter or a click outside keeps the time when every digit is filled in; Escape (or an unfinished time) puts back
 * the one before.
 */
const TimeField = ({ value, label, onChange }: { value: string; label: string; onChange: (value: string) => void }) => {
  const [editing, setEditing] = useState(false);
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [caret, setCaret] = useState(0);
  const root = useRef<HTMLSpanElement>(null);
  const box = useRef<HTMLSpanElement>(null);
  const display = useRef<HTMLButtonElement>(null);
  const state = useRef({ digits, period });
  state.current = { digits, period };

  const start = () => {
    const t = parseTime(value);
    setDigits(t.digits);
    setPeriod(t.period);
    setCaret(0);
    setEditing(true);
  };
  const finish = (keep: boolean) => {
    const { digits: d, period: p } = state.current;
    if (keep && d.every(Boolean)) onChange(`${Number(d[0] + d[1])}:${d[2]}${d[3]} ${p}`);
    setEditing(false);
  };
  const finishRef = useRef(finish);
  finishRef.current = finish;

  // Focus the digits when editing starts; a click outside (the digits and the toggle) keeps the time
  useEffect(() => {
    if (!editing) return;
    box.current?.focus();
    const onDown = (e: globalThis.PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) finishRef.current(true);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [editing]);
  // Back on the time after editing, so the keyboard stays in place
  const wasEditing = useRef(false);
  useEffect(() => {
    if (wasEditing.current && !editing) display.current?.focus();
    wasEditing.current = editing;
  }, [editing]);

  const onKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    const k = e.key;
    if (/^\d$/.test(k)) {
      e.preventDefault();
      if (caret > 3) return;
      const next = [...digits];
      // A first hour digit of 2–9 is an hour on its own: "0" then that digit
      if (caret === 0 && Number(k) > 1) {
        next[0] = '0';
        next[1] = k;
        setDigits(next);
        setCaret(2);
        return;
      }
      if (!fitsTime(next, caret, k)) return;
      next[caret] = k;
      setDigits(next);
      setCaret(caret + 1);
    } else if (k === 'Backspace') {
      e.preventDefault();
      if (caret === 0) return;
      const next = [...digits];
      next[caret - 1] = '';
      setDigits(next);
      setCaret(caret - 1);
    } else if (k === 'Delete') {
      e.preventDefault();
      if (caret > 3) return;
      const next = [...digits];
      next[caret] = '';
      setDigits(next);
    } else if (k === 'ArrowLeft') {
      e.preventDefault();
      setCaret(Math.max(0, caret - 1));
    } else if (k === 'ArrowRight') {
      e.preventDefault();
      setCaret(Math.min(4, caret + 1));
    } else if (k === 'Home') {
      e.preventDefault();
      setCaret(0);
    } else if (k === 'End') {
      e.preventDefault();
      setCaret(4);
    } else if (k === 'a' || k === 'A' || k === 'p' || k === 'P') {
      e.preventDefault();
      setPeriod(/p/i.test(k) ? 'PM' : 'AM');
    } else if (k === 'Enter') {
      e.preventDefault();
      finish(true);
    } else if (k === 'Escape') {
      e.preventDefault();
      finish(false);
    }
  };

  if (!editing)
    return (
      <span className="is-rtn-field is-rtn-field--select">
        <button ref={display} type="button" aria-label={`${label}: ${value}`} onClick={start}>
          {value}
        </button>
        <span className="is-rtn-field__line" aria-hidden="true" />
      </span>
    );

  const slot = (i: number) => (
    <span
      key={i}
      className={`is-rtn-time__slot${digits[i] ? '' : ' is-rtn-time__slot--empty'}${caret === i ? ' is-rtn-time__slot--caret' : ''}`}
      onMouseDown={(e) => {
        e.preventDefault();
        box.current?.focus();
        setCaret(i);
      }}
    >
      {digits[i] || TIME_MASK[i]}
    </span>
  );

  return (
    <span ref={root} className="is-rtn-time">
      <span className="is-rtn-field is-rtn-field--open">
        <span
          ref={box}
          className={`is-rtn-time__digits${caret > 3 ? ' is-rtn-time__digits--caret-end' : ''}`}
          role="textbox"
          tabIndex={0}
          inputMode="numeric"
          aria-label={`${label} (HH:MM)`}
          aria-valuetext={`${digits[0] || 'H'}${digits[1] || 'H'}:${digits[2] || 'M'}${digits[3] || 'M'} ${period}`}
          onKeyDown={onKeyDown}
        >
          {slot(0)}
          {slot(1)}
          <span className="is-rtn-time__colon" aria-hidden="true">
            :
          </span>
          {slot(2)}
          {slot(3)}
        </span>
        <span className="is-rtn-field__line" aria-hidden="true" />
      </span>
      {/* Components / Tabs, Web (the smallest): AM · PM */}
      <Tabs
        device="web"
        width={92}
        options={timeOptions}
        value={period}
        onChange={(v) => {
          setPeriod(v as 'AM' | 'PM');
          box.current?.focus();
        }}
        aria-label="AM or PM"
      />
    </span>
  );
};

/**
 * Figma "Complete Profile": photo, name and demographics — or dotted blanks when nothing is filled in yet.
 * Every field can be clicked and edited: the names and age are typed in, sex is picked from a Selection List,
 * and the date of birth is typed as digits into an MM/DD/YYYY mask (the age then follows it).
 */
export const RTNHeaderPatient = ({ patient, device = 'web', showPhoto = true, onPatientChange, className = '' }: RTNHeaderPatientProps) => {
  const [fields, setFields] = useState(() => toFields(patient));
  // A different patient from outside replaces whatever was typed (compared by value, so passing the edited
  // patient back in, or a new object with the same details, keeps the edits)
  const patientKey = JSON.stringify(patient ?? null);
  useEffect(() => setFields(toFields(patient)), [patientKey]);

  const update = (change: Partial<PatientFields>) => {
    const next = { ...fields, ...change };
    setFields(next);
    onPatientChange?.({ ...next, photo: patient?.photo });
  };

  const onDob = (dob: string) => {
    const age = ageFromDob(dob);
    update(age === null ? { dob } : { dob, age: String(age) });
  };

  return (
    <div className={`is-rtn-patient is-rtn-patient--${device}${patient ? '' : ' is-rtn-patient--empty'} ${className}`}>
      {patient && showPhoto && patient.photo && (
        <span className="is-rtn-patient__photo">
          <img src={patient.photo} alt="" />
        </span>
      )}
      <div className="is-rtn-patient__info">
        <p className="is-rtn-patient__name">
          <TextField value={fields.firstName} placeholder="First name" label="First name" onChange={(firstName) => update({ firstName })} />
          <TextField value={fields.lastName} placeholder="Last name" label="Last name" onChange={(lastName) => update({ lastName })} />
        </p>
        <p className="is-rtn-patient__demo">
          <SelectField value={fields.sex} placeholder="Sex" label="Sex" options={SEX_OPTIONS} onChange={(sex) => update({ sex })} />
          <TextField value={fields.dob} placeholder={DOB_MASK} label="Date of birth" mask={DOB_MASK} numeric format={maskDob} onChange={onDob} />
          <TextField
            value={fields.age}
            placeholder="Age"
            label="Age"
            numeric
            format={(text) => text.replace(/\D/g, '').slice(0, 3)}
            onChange={(age) => update({ age })}
          />
        </p>
      </div>
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
  /** No more recording (e.g. the note was sent to the EHR or marked as complete): Start Recording / Resume are blocked; playback still works */
  locked?: boolean;
  className?: string;
}

/** Bars in the web mini waves (Figma Waves · Device=Web, Size=Mini: 87 × 40px) */
const WEB_BARS = 18;

/**
 * Figma "RTN Header Web Record Feature": Start Recording (Default) → waves, red time and Stop (Recording) →
 * play/pause, the recording's title, a seekable bar and Resume (Playback).
 */
export const RTNHeaderRecord = ({ state: initialState = 'idle', duration = 160, position = 32, title = '', onStateChange, locked = false, className = '' }: RTNHeaderRecordProps) => {
  const rec = useRecorder({ initialState, initialDuration: duration, initialPosition: position, onStateChange });
  // The first Start grows the waves from dots (as in the Record Widget); Resume brings them back in full
  const [started, setStarted] = useState(false);
  // What the last press morphs from, and its width: Start Recording (→ the stop button, the pill growing from
  // behind it) or the recording pill (→ the playback pill, its stop button becoming Resume)
  const [morph, setMorph] = useState<{ from: 'start' | 'recording'; width: number } | null>(null);
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
          disabled={locked}
          onClick={() => {
            const start = root.current?.querySelector<HTMLElement>('.is-rec-btn');
            setMorph(start ? { from: 'start', width: start.offsetWidth } : null);
            setStarted(true);
            rec.start();
          }}
        >
          Start Recording
        </RecordTextButton>
      )}

      {recording && (
        <div
          className={`is-rtn-rec__pill ${morph?.from === 'start' ? 'is-rtn-rec__pill--grow' : 'is-rtn-rec__enter'}`}
          style={morph?.from === 'start' ? ({ '--is-rtn-from-w': `${morph.width}px` } as CSSProperties) : undefined}
        >
          <Waves bars={WEB_BARS} intro={started} className="is-rec-waves--web-mini" />
          <span className="is-rtn-rec__time" aria-live="off">
            {formatTime(rec.duration)}
          </span>
          <span className="is-rtn-rec__morph">
            <RecordRoundButton
              icon="stop-flat"
              label="Stop recording"
              variant="destructive"
              size={60}
              iconSize={22}
              onClick={() => {
                const pill = root.current?.querySelector<HTMLElement>('.is-rtn-rec__pill');
                setMorph(pill ? { from: 'recording', width: pill.offsetWidth } : null);
                rec.stop();
              }}
            />
            {/* Start Recording, shrinking into the stop button (decorative) */}
            {morph?.from === 'start' && (
              <span className="is-rtn-rec__ghost" aria-hidden="true">
                <Icon name="mic" size={22} />
                <span>Start Recording</span>
              </span>
            )}
          </span>
        </div>
      )}

      {playback && (
        <div
          className={`is-rtn-rec__pill is-rtn-rec__pill--wide ${morph?.from === 'recording' ? 'is-rtn-rec__pill--open' : 'is-rtn-rec__enter'}`}
          style={morph?.from === 'recording' ? ({ '--is-rtn-from-w': `${morph.width}px` } as CSSProperties) : undefined}
        >
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
          <span className="is-rtn-rec__morph">
            <RecordTextButton
              icon="mic"
              height={60}
              fontSize={15}
              iconSize={22}
              radius={1000}
              paddingX={20}
              gap={12}
              disabled={locked}
              onClick={() => {
                setMorph(null);
                setStarted(false);
                rec.resume();
              }}
            >
              Resume
            </RecordTextButton>
            {/* The stop button, widening into Resume (decorative) */}
            {morph?.from === 'recording' && (
              <span className="is-rtn-rec__ghost is-rtn-rec__ghost--stop" aria-hidden="true">
                <Icon name="stop-flat" size={22} />
              </span>
            )}
          </span>
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

export interface RTNHeaderProps extends Omit<RTNHeaderDetailsProps, 'className' | 'deleteRecording'> {
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
  /** Recording blocked (note sent to the EHR / marked as complete): Resume and Start Recording can't be pressed */
  recordLocked?: boolean;
  /** Called with the patient as it is edited in the header */
  onPatientChange?: (patient: RTNPatient) => void;
  className?: string;
  style?: CSSProperties;
}

/** Figma "RTN Header (Web)": details on top; the patient on the left and the record feature on the right */
export const RTNHeader = ({
  labels = ['Visit', 'Room 12'],
  date: dateProp,
  time: timeProp,
  checkedIn = 'Checked in 11 min ago',
  onDateChange,
  onTimeChange,
  onDeleteRecording,
  micSettings,
  patient,
  showPhoto = true,
  recordState = 'idle',
  duration,
  position,
  onRecordStateChange,
  recordLocked = false,
  onPatientChange,
  className = '',
  style,
}: RTNHeaderProps) => {
  // Today's date unless given (for the playback title)
  const now = useNow(dateProp === undefined);
  // The date as edited in the header (the playback title follows it)
  const [editedDate, setEditedDate] = useState<string | null>(null);
  useEffect(() => setEditedDate(null), [dateProp]);
  const date = editedDate ?? dateProp ?? formatRTNDate(now);
  // The patient as edited in the header (the playback title follows it)
  const [edited, setEdited] = useState<RTNPatient | null>(null);
  useEffect(() => setEdited(null), [JSON.stringify(patient ?? null)]);
  const shown = edited ?? patient;
  const name = shown ? `${shown.firstName} ${shown.lastName}`.trim() : '';
  // The playback title, as in Figma: "Sarah Johnson • Visit • Oct 23, 2026"
  const title = [name, labels[0] ?? '', date ?? ''].filter(Boolean).join(' • ');
  // Where the record feature is, so Delete Recording shows once a recording is done (Playback). Deleting it
  // brings back Start Recording (a fresh record feature).
  const [state, setState] = useState<RecordState>(recordState);
  const [deleted, setDeleted] = useState(0);
  useEffect(() => setState(recordState), [recordState]);
  const hasRecording = (state === 'paused' || state === 'playing') && !recordLocked;
  return (
    <header className={`is-rtn ${className}`} style={style}>
      <RTNHeaderDetails
        labels={labels}
        date={dateProp}
        time={timeProp}
        onDateChange={(d) => {
          setEditedDate(d);
          onDateChange?.(d);
        }}
        onTimeChange={onTimeChange}
        checkedIn={checkedIn}
        deleteRecording={hasRecording}
        onDeleteRecording={() => {
          setDeleted((n) => n + 1);
          setState('idle');
          onRecordStateChange?.('idle');
          onDeleteRecording?.();
        }}
        micSettings={micSettings}
      />
      <div className="is-rtn__row">
        <RTNHeaderPatient
          patient={patient}
          showPhoto={showPhoto}
          onPatientChange={(p) => {
            setEdited(p);
            onPatientChange?.(p);
          }}
        />
        <RTNHeaderRecord
          key={deleted}
          state={deleted ? 'idle' : recordState}
          duration={deleted ? 0 : duration}
          position={deleted ? 0 : position}
          title={title}
          onStateChange={(s) => {
            setState(s);
            onRecordStateChange?.(s);
          }}
          locked={recordLocked}
        />
      </div>
    </header>
  );
};
