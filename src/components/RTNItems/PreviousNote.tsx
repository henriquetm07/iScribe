import { useState, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/icons';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import type { ButtonSize } from '../Button/Button';
import { Tabs } from '../Tabs/Tabs';
import { RtnLabel, rtnTabs, type RtnDevice, type RtnLabelTone } from './RTNItems';
import './PreviousNote.css';

/*
 * RTN Notes · Previous Note — Figma page "RTN Items (Previous Note)" (812:8868).
 * The previous visit's note, section by section; each entry (or the whole note) can be added to today's note.
 */

const cx = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(' ');
const pick = <T,>(device: RtnDevice, iphone: T, ipad: T, web: T) => (device === 'iphone' ? iphone : device === 'ipad' ? ipad : web);

/* ------------------------------------------------------------------ Add From Previous Item */

export interface AddFromPreviousButtonProps {
  device?: RtnDevice;
  /** Value: already added to today's note (green, check) */
  added?: boolean;
  onClick?: () => void;
  label?: string;
}

/**
 * Add From Previous Item (831:10288): a secondary Icon Button with + (iPhone Mini 20 · iPad Regular 40 · Web Small 30).
 * Once added (Figma "Value") it turns Status / Background / Positive with a check.
 */
export const AddFromPreviousButton = ({ device = 'web', added = false, onClick, label }: AddFromPreviousButtonProps) => (
  <IconButton
    variant="secondary"
    size={pick<ButtonSize>(device, 'mini', 'regular', 'small')}
    icon={<Icon name={added ? 'check' : 'add'} />}
    label={label ?? (added ? 'Added to today’s note' : 'Add to today’s note')}
    aria-pressed={added}
    className={cx('is-pn-add', added && 'is-pn-add--added')}
    onClick={onClick}
  />
);

/* ------------------------------------------------------------------ Check counter */

export interface CheckCounterProps {
  device?: RtnDevice;
  /** How many entries were added; above 0 shows the check and the green counter (Figma "Value") */
  count?: number;
  onClick?: () => void;
}

/**
 * Check counter (813:15982): a secondary Icon Button (iPhone Small 30 · iPad Big 50 · Web Regular 40). Default shows +
 * (add the whole note); once entries are added it shows a check and a green counter on its top-right corner.
 */
export const CheckCounter = ({ device = 'web', count = 0, onClick }: CheckCounterProps) => (
  <span className={cx('is-pn-counter', `is-pn-counter--${device}`)}>
    <IconButton
      variant="secondary"
      size={pick<ButtonSize>(device, 'small', 'big', 'regular')}
      icon={<Icon name={count > 0 ? 'check' : 'add'} />}
      label={count > 0 ? `${count} added to today’s note` : 'Add the whole note to today’s note'}
      onClick={onClick}
    />
    {count > 0 && <span className="is-pn-counter__badge" aria-hidden="true">{count}</span>}
  </span>
);

/* ------------------------------------------------------------------ Date and Provider */

export interface DateAndProviderProps {
  device?: RtnDevice;
  date: string;
  visitType?: string;
  /** e.g. "180 days ago" */
  timeSpan?: string;
  provider?: string;
}

/** Date and Provider (Previous Note), 815:8237. */
export const DateAndProvider = ({ device = 'web', date, visitType, timeSpan, provider }: DateAndProviderProps) => (
  <div className={cx('is-pn-date', `is-pn-date--${device}`)}>
    <div className="is-pn-date__full">
      <div className="is-pn-date__row">
        <span className="is-pn-date__date">{date}</span>
        {visitType && <RtnLabel size={device === 'ipad' ? 'big' : 'medium'} tone="plain">{visitType}</RtnLabel>}
      </div>
      {timeSpan && <span className="is-pn-date__meta">{timeSpan}</span>}
    </div>
    {provider && <span className="is-pn-date__meta">Provider: {provider}</span>}
  </div>
);

/* ------------------------------------------------------------------ Items */

export interface PreviousNoteEntry {
  id: string;
  text: ReactNode;
  /** Code shown under the text (ICD, CPT…) */
  code?: string;
  codeTone?: RtnLabelTone;
}

export interface PreviousNoteItemProps {
  device?: RtnDevice;
  entry: PreviousNoteEntry;
  added?: boolean;
  onAdd?: () => void;
}

/** RTN Items (Previous Note), 815:9006: one entry with its code, and the add button on the right. */
export const PreviousNoteItem = ({ device = 'web', entry, added, onAdd }: PreviousNoteItemProps) => (
  <div className={cx('is-pn-item', `is-pn-item--${device}`)}>
    <div className="is-pn-item__data">
      <p className="is-pn-item__text">{entry.text}</p>
      {entry.code && (
        <RtnLabel size={device === 'ipad' ? 'big' : 'medium'} tone={entry.codeTone ?? 'neutral'}>
          {entry.code}
        </RtnLabel>
      )}
    </div>
    <AddFromPreviousButton device={device} added={added} onClick={onAdd} />
  </div>
);

export interface PreviousNoteSection {
  id: string;
  title: string;
  icon: IconName;
  entries: PreviousNoteEntry[];
}

export interface PreviousNoteSectionProps {
  device?: RtnDevice;
  section: PreviousNoteSection;
  /** Ids of the entries already added */
  added?: string[];
  onAdd?: (entryId: string) => void;
}

/** RTN Item Header (Previous Note) + RTN Full Items (Previous Note), 821:9124: a section title and its entries. */
export const PreviousNoteSectionView = ({ device = 'web', section, added = [], onAdd }: PreviousNoteSectionProps) => (
  <section className={cx('is-pn-section', `is-pn-section--${device}`)}>
    <h3 className="is-pn-section__header">
      <Icon name={section.icon} size={pick(device, 16, 24, 18)} />
      <span>{section.title}</span>
    </h3>
    <div className="is-pn-section__items">
      {section.entries.map((e) => (
        <PreviousNoteItem key={e.id} device={device} entry={e} added={added.includes(e.id)} onAdd={() => onAdd?.(e.id)} />
      ))}
    </div>
  </section>
);

/* ------------------------------------------------------------------ Previous Note Summary */

export interface PreviousNoteSummaryProps {
  device?: RtnDevice;
  /** Sections pulled forward into today's note */
  sections: { title: string; icon: IconName }[];
  /** Start expanded (the list of sections); click the summary to toggle */
  defaultExpanded?: boolean;
}

/**
 * Previous Note Summary (833:10677). Compact: up to three overlapping section icons and "N sections pulled forward".
 * Expanded: the previous-note badge (inverted) with the count, then one row per section. Click to toggle.
 */
export const PreviousNoteSummary = ({ device = 'web', sections, defaultExpanded = false }: PreviousNoteSummaryProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const iconSize = device === 'ipad' ? 20 : 16;
  const count = `${sections.length} section${sections.length === 1 ? '' : 's'} pulled forward`;
  return (
    <button
      type="button"
      className={cx('is-pn-summary', `is-pn-summary--${device}`, expanded && 'is-pn-summary--expanded')}
      aria-expanded={expanded}
      onClick={() => setExpanded(!expanded)}
    >
      {expanded ? (
        <>
          <span className="is-pn-summary__row">
            <span className="is-pn-icon is-pn-icon--neutral"><Icon name="previous-note" size={iconSize} /></span>
            <span className="is-pn-summary__text">{count}</span>
          </span>
          {sections.map((s) => (
            <span key={s.title} className="is-pn-summary__row">
              <span className="is-pn-icon is-pn-icon--plain"><Icon name={s.icon} size={iconSize} /></span>
              <span className="is-pn-summary__text">{s.title}</span>
            </span>
          ))}
        </>
      ) : (
        <span className="is-pn-summary__row is-pn-summary__row--compact">
          <span className="is-pn-icons">
            {sections.slice(0, 3).map((s) => (
              <span key={s.title} className="is-pn-icon"><Icon name={s.icon} size={iconSize} /></span>
            ))}
          </span>
          <span className="is-pn-summary__text">{count}</span>
        </span>
      )}
    </button>
  );
};

/* ------------------------------------------------------------------ Empty states */

export type PreviousNoteStatus = 'loading' | 'error';

/** Empty Previous Note / Loading and Error (842:16004). */
export const PreviousNoteStatusMessage = ({ device = 'web', status, onRetry }: { device?: RtnDevice; status: PreviousNoteStatus; onRetry?: () => void }) => (
  <div className={cx('is-pn-status', `is-pn-status--${device}`)} role={status === 'error' ? 'alert' : 'status'}>
    <div className="is-pn-status__text">
      <span className="is-pn-status__title">
        <Icon name={status === 'error' ? 'alert' : 'spinner'} size={status === 'error' ? 24 : 20} className={status === 'loading' ? 'is-pn-spin' : undefined} />
        {status === 'error' ? 'Error loading' : 'Loading'}
      </span>
      <p className="is-pn-status__body">
        {status === 'error'
          ? 'Something went wrong while retrieving the previous note. Please try again later.'
          : 'Please wait while we load the previous note.'}
      </p>
    </div>
    {status === 'error' && (
      <Button variant="primary" size="regular" className="is-pn-status__retry" onClick={onRetry}>Retry</Button>
    )}
  </div>
);

/* ------------------------------------------------------------------ Main frame */

export type PreviousNoteFrameState = 'default' | 'empty' | 'loading' | 'error';

export interface PreviousNoteFrameProps {
  device?: RtnDevice;
  state?: PreviousNoteFrameState;
  date?: string;
  visitType?: string;
  timeSpan?: string;
  provider?: string;
  sections?: PreviousNoteSection[];
  /** Ids of entries already added (controlled); leave out to let the frame keep track */
  added?: string[];
  onAddedChange?: (ids: string[]) => void;
  onTabChange?: (tab: string) => void;
  onRetry?: () => void;
  className?: string;
}

/**
 * RTN Main Frame (Previous Note), 825:10417. Tabs (Previous Note selected), the visit's date, type and provider with
 * the Check counter, a separator, then the sections on a soft background. iPhone is a bottom sheet with a dragger.
 * Empty: "No Previous Notes"; Loading and Error show their messages in the body.
 */
export const PreviousNoteFrame = ({
  device = 'web',
  state = 'default',
  date = '',
  visitType,
  timeSpan,
  provider,
  sections = [],
  added,
  onAddedChange,
  onTabChange,
  onRetry,
  className,
}: PreviousNoteFrameProps) => {
  const [own, setOwn] = useState<string[]>([]);
  const ids = added ?? own;
  const set = (next: string[]) => { if (added === undefined) setOwn(next); onAddedChange?.(next); };
  const all = sections.flatMap((s) => s.entries.map((e) => e.id));
  const toggle = (id: string) => set(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  const showHeader = state === 'default';

  return (
    <div className={cx('is-pn-frame', `is-pn-frame--${device}`, `is-pn-frame--${state}`, className)}>
      <div className="is-pn-frame__top">
        {device === 'iphone' && <div className="is-pn-frame__dragger" aria-hidden="true" />}
        <Tabs device={device} options={rtnTabs} defaultValue="previous-note" onChange={onTabChange} aria-label="Note" />
        {showHeader && (
          <div className="is-pn-frame__header">
            <DateAndProvider device={device} date={date} visitType={visitType} timeSpan={timeSpan} provider={provider} />
            <CheckCounter device={device} count={ids.length} onClick={() => set(ids.length === all.length ? [] : all)} />
          </div>
        )}
      </div>
      <hr className="is-pn-separator" />
      <div className="is-pn-frame__body">
        {state === 'default' &&
          sections.map((s) => <PreviousNoteSectionView key={s.id} device={device} section={s} added={ids} onAdd={toggle} />)}
        {state === 'empty' && (
          <div className="is-pn-empty">
            <p className="is-pn-empty__title">No Previous Notes</p>
            <p className="is-pn-empty__body">This patient is new to the practice, so there’s no prior history.</p>
          </div>
        )}
        {(state === 'loading' || state === 'error') && <PreviousNoteStatusMessage device={device} status={state} onRetry={onRetry} />}
      </div>
    </div>
  );
};
