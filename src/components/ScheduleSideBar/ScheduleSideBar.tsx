import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Icon } from '../../icons/Icon';
import { appointmentStatuses } from '../AppointmentStatus/AppointmentStatus';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { ScheduleList, type ScheduleListEntry } from '../ScheduleList/ScheduleList';
import { Tabs } from '../Tabs/Tabs';
import {
  AppliedFilters,
  appliedFilterChips,
  emptyScheduleFilters,
  ScheduleCalendarPanel,
  ScheduleFilterPanel,
  ScheduleSortPanel,
  type ScheduleEhrFilter,
  type ScheduleFilters,
  type ScheduleSort,
} from './SchedulePanels';
import './ScheduleSideBar.css';

/*
 * Schedule Side Bar — Figma "Schedule Side Tab" (1133:4037).
 *   Web               Expanded (420px) or Collapsed (180px), toggled with the sidebar button
 *   Chrome extension  360px: the provider's name on top, a "New Note" button at the bottom
 * Header: New Note, Schedule / Pending tabs (Tabs, web), the day with ‹ › and the Calendar panel, Filter and
 * Sort panels. Below: the applied-filter chips and the Schedule List, filtered and sorted.
 */

/** An appointment on the side bar: a Schedule List entry, plus what the filters look at */
export interface ScheduleSideBarAppointment extends ScheduleListEntry {
  /** e.g. "Office Visit", "Surgery" (Appointment Type filter) */
  appointmentType?: string;
  /** Provider and department (their filter lists) */
  provider?: string;
  department?: string;
}

export type ScheduleSideBarPlatform = 'web' | 'chrome';

export interface ScheduleSideBarProps {
  /** Web (collapsible) or Chrome extension */
  platform?: ScheduleSideBarPlatform;
  /** Web: start collapsed (180px, compact appointments) */
  defaultCollapsed?: boolean;
  /** Web: collapsed or expanded, when you control it; use with onCollapsedChange */
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** The day's appointments (Schedule tab) */
  appointments: ScheduleSideBarAppointment[];
  /** Notes waiting to be finished (Pending tab, with its count) */
  pending?: ScheduleSideBarAppointment[];
  /** The selected appointment, and when another is clicked */
  selectedId?: string;
  onSelect?: (id: string) => void;
  /** The day shown (default today), and when it changes (‹ ›, Calendar) */
  date?: Date;
  onDateChange?: (date: Date) => void;
  /** Today (default: now) — for "Today, March 4" and the calendar */
  today?: Date;
  /** Chrome extension: the provider's name on top; onProviderMenu adds the ⋯ button */
  providerName?: string;
  onProviderMenu?: () => void;
  /** New Note button */
  onNewNote?: () => void;
  /** Filter panel options */
  appointmentTypes?: string[];
  ehrs?: ScheduleEhrFilter[];
  departments?: string[];
  providers?: string[];
  /** Start with these filters / this order */
  defaultFilters?: ScheduleFilters;
  defaultSort?: ScheduleSort;
  /** Height (the list scrolls inside). Default: fills its container. */
  height?: number | string;
  /** The list is loading (e.g. right after the day changes): skeleton items in place of the appointments */
  loading?: boolean;
  className?: string;
}

/* ---------- Helpers ---------- */

const minutes = (time: string) => {
  const m = time.trim().match(/^(\d{1,2}):(\d{2})\s*([AP]M)?$/i);
  if (!m) return 0;
  let h = Number(m[1]) % 12;
  if (m[3]?.toUpperCase() === 'PM') h += 12;
  if (!m[3]) h = Number(m[1]);
  return h * 60 + Number(m[2]);
};
const statusOrder = (s: string) => appointmentStatuses.findIndex((x) => x.value === s);
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** "Today, March 4", "Yesterday, March 3", "Thursday, March 5" */
export const scheduleDayLabel = (date: Date, today = new Date()) => {
  const day = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  if (sameDay(date, today)) return `Today, ${day}`;
  if (sameDay(date, addDays(today, -1))) return `Yesterday, ${day}`;
  if (sameDay(date, addDays(today, 1))) return `Tomorrow, ${day}`;
  return `${date.toLocaleDateString('en-US', { weekday: 'long' })}, ${day}`;
};
/** "Mar 4, 26" (collapsed) */
export const scheduleShortDate = (date: Date) =>
  `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${String(date.getFullYear()).slice(-2)}`;

export const filterAndSortAppointments = (list: ScheduleSideBarAppointment[], filters: ScheduleFilters, sort: ScheduleSort) => {
  const f = filters;
  const shown = list.filter(
    (a) =>
      (!f.appointmentTypes.length || (a.appointmentType && f.appointmentTypes.includes(a.appointmentType))) &&
      (!f.ehrs.length || f.ehrs.includes(a.integrated && a.ehr ? a.ehr : 'none')) &&
      (!f.statuses.length || f.statuses.includes(a.status)) &&
      (!f.departments.length || (a.department && f.departments.includes(a.department))) &&
      (!f.providers.length || (a.provider && f.providers.includes(a.provider))),
  );
  const dir = sort.direction === 'asc' ? 1 : -1;
  const key = (a: ScheduleSideBarAppointment) => (sort.by === 'time' ? minutes(a.time) : sort.by === 'status' ? statusOrder(a.status) : 0);
  return [...shown].sort((a, b) =>
    sort.by === 'name' ? dir * a.name.localeCompare(b.name) : dir * (key(a) - key(b)) || minutes(a.time) - minutes(b.time),
  );
};

/** Closes a floating panel on a click outside it or Escape */
const useDismiss = (open: boolean, close: () => void, ref: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      // The buttons that open panels toggle them themselves
      if ((e.target as Element).closest?.('[data-ssb-toggle]')) return;
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close, ref]);
};

/* ---------- Provider name (Chrome extension) ---------- */

export interface ProviderNameProps {
  name: string;
  /** Adds the ⋯ button */
  onMenu?: () => void;
  className?: string;
}

/** Figma "Provider Name": avatar icon and the provider's name (Figtree Medium 14px), ⋯ on the right */
export const ProviderName = ({ name, onMenu, className = '' }: ProviderNameProps) => (
  <div className={`is-provider-name ${className}`}>
    <span className="is-provider-name__who">
      <Icon name="avatar" size={18} />
      <span>{name}</span>
    </span>
    {onMenu && <IconButton variant="ghost" size="small" label="Provider options" icon={<Icon name="meatballs" />} onClick={onMenu} />}
  </div>
);

/* ---------- Side bar ---------- */

type PanelName = 'filter' | 'sort' | 'calendar';

/** Figma "Schedule Side Bar": the day's schedule beside the note — web (collapsible) or Chrome extension */
export const ScheduleSideBar = ({
  platform = 'web',
  defaultCollapsed = false,
  collapsed: collapsedProp,
  onCollapsedChange,
  appointments,
  pending = [],
  selectedId: selectedProp,
  onSelect,
  date: dateProp,
  onDateChange,
  today = new Date(),
  providerName = 'Dr. Chris Bulkey-Jones',
  onProviderMenu,
  onNewNote,
  appointmentTypes,
  ehrs,
  departments,
  providers,
  defaultFilters = emptyScheduleFilters,
  defaultSort = { by: 'time', direction: 'asc' },
  height,
  loading = false,
  className = '',
}: ScheduleSideBarProps) => {
  const chrome = platform === 'chrome';
  const [collapsedState, setCollapsedState] = useState(defaultCollapsed);
  const collapsed = !chrome && (collapsedProp ?? collapsedState);
  const setCollapsed = (next: boolean) => {
    setCollapsedState(next);
    onCollapsedChange?.(next);
  };
  const [dateState, setDateState] = useState(today);
  const date = dateProp ?? dateState;
  const setDate = (next: Date) => {
    setDateState(next);
    onDateChange?.(next);
  };
  const [selectedState, setSelectedState] = useState(selectedProp);
  useEffect(() => setSelectedState(selectedProp), [selectedProp]);
  const select = (id: string) => {
    setSelectedState(id);
    onSelect?.(id);
  };
  const [tab, setTab] = useState('schedule');
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState(defaultSort);
  const [panel, setPanel] = useState<PanelName | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Loading: as many skeleton items as fill the list's height (each 100px + 10px apart), kept up to date if it resizes
  const listRef = useRef<HTMLDivElement>(null);
  const [skeletons, setSkeletons] = useState(6);
  useEffect(() => {
    const list = listRef.current;
    if (!loading || !list) return;
    const fit = () => setSkeletons(Math.max(1, Math.ceil((list.clientHeight - 10) / 110)));
    fit();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : undefined;
    observer?.observe(list);
    return () => observer?.disconnect();
  }, [loading]);
  const close = useMemo(() => () => setPanel(null), []);
  useDismiss(panel !== null, close, panelRef);
  const toggle = (name: PanelName) => setPanel((p) => (p === name ? null : name));

  const chips = appliedFilterChips(filters, setFilters);
  const shown = filterAndSortAppointments(tab === 'pending' ? pending : appointments, filters, sort);

  const newNote = (
    <Button variant="secondary" size="small" iconLeft={<Icon name="add" />} onClick={onNewNote}>
      New Note
    </Button>
  );
  const sidebarToggle = (
    <IconButton variant="ghost" size="small" label={collapsed ? 'Expand schedule' : 'Collapse schedule'} icon={<Icon name="sidebar" />} onClick={() => setCollapsed(!collapsed)} />
  );
  const tools = (
    <div className="is-ssb__tools">
      <IconButton variant="secondary" size="small" data-ssb-toggle label="Filter" icon={<Icon name="filter" />} aria-expanded={panel === 'filter'} onClick={() => toggle('filter')} />
      <IconButton variant="secondary" size="small" data-ssb-toggle label="Sort" icon={<Icon name="reorder" />} aria-expanded={panel === 'sort'} onClick={() => toggle('sort')} />
    </div>
  );
  const dayButton = (label: string) => (
    <Button data-ssb-toggle variant="ghost" size="small" aria-expanded={panel === 'calendar'} onClick={() => toggle('calendar')} className="is-ssb__day">
      {label}
    </Button>
  );

  let panelNode: ReactNode = null;
  if (panel === 'filter')
    panelNode = (
      <ScheduleFilterPanel filters={filters} onChange={setFilters} appointmentTypes={appointmentTypes} ehrs={ehrs} departments={departments} providers={providers} listPlacement={chrome ? 'replace' : 'side'} onClose={close} />
    );
  if (panel === 'sort') panelNode = <ScheduleSortPanel sort={sort} onChange={setSort} onClose={close} />;
  if (panel === 'calendar')
    panelNode = (
      <ScheduleCalendarPanel
        value={date}
        today={today}
        onChange={(d) => {
          setDate(d);
          close();
        }}
        onClose={close}
      />
    );

  let header: ReactNode;
  if (collapsed) {
    header = (
      <div className="is-ssb__header">
        <div className="is-ssb__row">
          {newNote}
          {sidebarToggle}
        </div>
        <div className="is-ssb__title-row">
          <IconButton variant="ghost" size="small" label="Expand schedule" icon={<Icon name="sandwich" />} onClick={() => setCollapsed(false)} />
          <span className="is-ssb__title">Schedule</span>
        </div>
        <hr className="is-ssb__separator" />
        <div className="is-ssb__row">
          {dayButton(scheduleShortDate(date))}
          {tools}
        </div>
      </div>
    );
  } else {
    header = (
      <div className="is-ssb__header">
        {chrome ? (
          <ProviderName name={providerName} onMenu={onProviderMenu} />
        ) : (
          <div className="is-ssb__row">
            {newNote}
            {sidebarToggle}
          </div>
        )}
        <Tabs
          device="web"
          tint="white"
          value={tab}
          onChange={setTab}
          aria-label="Schedule or pending notes"
          options={[
            { value: 'schedule', label: 'Schedule' },
            { value: 'pending', label: 'Pending', count: pending.length || undefined },
          ]}
        />
        <div className="is-ssb__row">
          <div className="is-ssb__days">
            <IconButton variant="ghost" size="small" label="Previous day" icon={<Icon name="chevron-left" />} onClick={() => setDate(addDays(date, -1))} />
            <IconButton variant="ghost" size="small" label="Next day" icon={<Icon name="chevron-right" />} onClick={() => setDate(addDays(date, 1))} />
            {dayButton(scheduleDayLabel(date, today))}
          </div>
          {tools}
        </div>
      </div>
    );
  }

  return (
    <aside
      className={`is-ssb is-ssb--${chrome ? 'chrome' : 'web'}${collapsed ? ' is-ssb--collapsed' : ''} ${className}`}
      style={height !== undefined ? { height } : undefined}
      aria-label="Schedule"
    >
      {header}
      {panelNode && (
        <div ref={panelRef} className="is-ssb__panel">
          {panelNode}
        </div>
      )}
      <div ref={listRef} className="is-ssb__list">
        <AppliedFilters chips={chips} />
        {loading ? (
          <ScheduleList appointments={[]} loading={skeletons} expanded={!collapsed} className="is-ssb__schedule is-ssb__schedule--loading" />
        ) : shown.length ? (
          <ScheduleList appointments={shown} expanded={!collapsed} selectedId={selectedState} onSelect={select} className="is-ssb__schedule" />
        ) : (
          <p className="is-ssb__empty">{tab === 'pending' ? 'No pending notes' : chips.length ? 'No appointments match these filters' : 'No appointments'}</p>
        )}
      </div>
      {chrome && (
        <div className="is-ssb__bottom">
          <Button variant="secondary" size="regular" onClick={onNewNote} className="is-ssb__new-note">
            New Note
          </Button>
        </div>
      )}
    </aside>
  );
};
