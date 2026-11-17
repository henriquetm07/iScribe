import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/icons';
import { AppointmentStatusIcon, appointmentStatusLabel, type AppointmentStatusValue } from '../AppointmentStatus/AppointmentStatus';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { EhrLogo, ehrLabel, type EhrName } from '../EhrIcon/EhrIcon';
import { useThemeAround } from '../ScheduleList/ScheduleList';
import './ScheduleSideBar.css';

/*
 * The Schedule Side Bar's panels — Figma "Schedule Side Tab" (1133:4037): Filter, Filter lists (Providers /
 * Departments), Sort, Calendar, and the applied-filter chips.
 */

/* ---------- Panel shell (Figma "Drawer Header" + body) ---------- */

export interface SchedulePanelProps {
  /** Icon before the title (Figma: filter, reorder, calendar) */
  icon?: IconName;
  title: string;
  subtitle?: string;
  /** Shows a ‹ back button in place of the icon */
  onBack?: () => void;
  /** Shows the × button */
  onClose?: () => void;
  /** Extra content in the grey header, under the title (e.g. a search field) */
  headerExtra?: ReactNode;
  /** Bottom bar, above a 1px line (e.g. "Clear all Filters") */
  footer?: ReactNode;
  children?: ReactNode;
  /** Width in px (Figma: 375, calendar 335) */
  width?: number;
  className?: string;
}

/** A floating panel: 20px corners, soft shadow, grey header with an icon, a Season Mix title and a subtitle */
export const SchedulePanel = ({ icon, title, subtitle, onBack, onClose, headerExtra, footer, children, width = 375, className = '' }: SchedulePanelProps) => (
  <section className={`is-sched-panel ${className}`} style={{ width }} aria-label={title}>
    <header className="is-sched-panel__header">
      <div className="is-sched-panel__title-row">
        {onBack ? (
          // Figma "icon/chevron left": a plain 16px icon (no button background), high contrast
          <button type="button" className="is-sched-panel__icon-action is-sched-panel__back" onClick={onBack} aria-label="Back">
            <Icon name="chevron-left" size={16} />
          </button>
        ) : (
          icon && (
            <span className="is-sched-panel__icon">
              <Icon name={icon} size={16} />
            </span>
          )
        )}
        <div className="is-sched-panel__titles">
          <h2 className="is-sched-panel__title">{title}</h2>
          {subtitle && <p className="is-sched-panel__subtitle">{subtitle}</p>}
        </div>
      </div>
      {headerExtra}
      {onClose && (
        // Figma "icon/close" (16px, its own drawing: larger and bolder than the 12px-grid "close" icon scaled up),
        // low contrast, 20px from the top right; a plain icon with no background on hover
        <button type="button" className="is-sched-panel__icon-action is-sched-panel__close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M3.47192 3.47193C3.78434 3.15951 4.29075 3.15951 4.60317 3.47193L8.00317 6.87037L11.3969 3.47818C11.7093 3.16576 12.2157 3.16576 12.5282 3.47818C12.8404 3.79062 12.8405 4.29708 12.5282 4.60943L9.13442 8.00162L12.5235 11.3907C12.8359 11.7031 12.8359 12.2111 12.5235 12.5235C12.2113 12.8356 11.7047 12.8351 11.3922 12.5235L8.00317 9.13443L4.60942 12.5282C4.29707 12.8405 3.79061 12.8404 3.47817 12.5282C3.16575 12.2158 3.16575 11.7094 3.47817 11.3969L6.87192 8.00318L3.47192 4.60318C3.15951 4.29078 3.15955 3.78435 3.47192 3.47193Z" />
          </svg>
        </button>
      )}
    </header>
    <div className="is-sched-panel__body">{children}</div>
    {footer && <footer className="is-sched-panel__footer">{footer}</footer>}
  </section>
);

/** A group in a panel: a SemiBold 14px label, then its options wrapping 10px apart */
const Group = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="is-sched-panel__group">
    <p className="is-sched-panel__label">{label}</p>
    <div className="is-sched-panel__options">{children}</div>
  </div>
);

/**
 * An option: a regular Button — Primary when on, Secondary when off. With invertIcon, the icon switches to its
 * other-mode version when the option is on (e.g. a status icon on the black Primary button uses its dark-mode colours).
 */
const Option = ({
  on,
  onClick,
  icon,
  invertIcon = false,
  children,
}: {
  on: boolean;
  onClick: () => void;
  icon?: ReactNode;
  invertIcon?: boolean;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const around = useThemeAround(ref);
  const iconNode = icon && (
    <span ref={ref} className="is-sched-option__icon" data-theme={on && invertIcon ? (around === 'dark' ? 'light' : 'dark') : undefined}>
      {icon}
    </span>
  );
  return (
    <Button variant={on ? 'primary' : 'secondary'} size="regular" iconLeft={iconNode} aria-pressed={on} onClick={onClick}>
      {children}
    </Button>
  );
};

const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

/* ---------- Filters ---------- */

/** "none" = not integrated with an EHR */
export type ScheduleEhrFilter = EhrName | 'none';

export interface ScheduleFilters {
  appointmentTypes: string[];
  ehrs: ScheduleEhrFilter[];
  statuses: AppointmentStatusValue[];
  departments: string[];
  providers: string[];
}

export const emptyScheduleFilters: ScheduleFilters = { appointmentTypes: [], ehrs: [], statuses: [], departments: [], providers: [] };

/** Statuses offered in the Filter panel, as in Figma */
export const filterStatuses: AppointmentStatusValue[] = ['not-checked-in', 'checked-in', 'note-in-progress', 'sent-to-ehr', 'copied-to-ehr'];

export const ehrFilterLabel = (ehr: ScheduleEhrFilter) => (ehr === 'none' ? 'Non integrated' : ehrLabel(ehr));

/** Every applied filter as a chip: its label and how to remove it */
export const appliedFilterChips = (filters: ScheduleFilters, onChange: (next: ScheduleFilters) => void) => [
  ...filters.appointmentTypes.map((v) => ({ key: `type-${v}`, label: v, remove: () => onChange({ ...filters, appointmentTypes: toggle(filters.appointmentTypes, v) }) })),
  ...filters.ehrs.map((v) => ({ key: `ehr-${v}`, label: ehrFilterLabel(v), remove: () => onChange({ ...filters, ehrs: toggle(filters.ehrs, v) }) })),
  ...filters.statuses.map((v) => ({ key: `status-${v}`, label: appointmentStatusLabel(v), remove: () => onChange({ ...filters, statuses: toggle(filters.statuses, v) }) })),
  ...filters.departments.map((v) => ({ key: `dept-${v}`, label: v, remove: () => onChange({ ...filters, departments: toggle(filters.departments, v) }) })),
  ...filters.providers.map((v) => ({ key: `prov-${v}`, label: v, remove: () => onChange({ ...filters, providers: toggle(filters.providers, v) }) })),
];

export interface ScheduleFilterPanelProps {
  filters: ScheduleFilters;
  onChange: (next: ScheduleFilters) => void;
  /** Appointment types to offer (Figma: Office Visit, Surgery) */
  appointmentTypes?: string[];
  /** EHRs to offer; "none" is "Non integrated" (Figma: Non integrated, Athena) */
  ehrs?: ScheduleEhrFilter[];
  /** Lists opened from the panel: Departments and Providers */
  departments?: string[];
  providers?: string[];
  onClose?: () => void;
  className?: string;
}

/**
 * Figma "Filter": appointment type, EHR and status options, then Departments and Providers, which open their
 * own lists (ScheduleFilterListPanel). "Clear all Filters" at the bottom.
 */
export const ScheduleFilterPanel = ({
  filters,
  onChange,
  appointmentTypes = ['Office Visit', 'Surgery'],
  ehrs = ['none', 'athena'],
  departments = [],
  providers = [],
  onClose,
  className,
}: ScheduleFilterPanelProps) => {
  const [list, setList] = useState<'departments' | 'providers' | null>(null);
  if (list) {
    return (
      <ScheduleFilterListPanel
        title={list === 'providers' ? 'Providers' : 'Departments'}
        options={list === 'providers' ? providers : departments}
        selected={filters[list]}
        onChange={(next) => onChange({ ...filters, [list]: next })}
        onBack={() => setList(null)}
        className={className}
      />
    );
  }
  const count = (n: number) => (n ? ` (${n})` : '');
  return (
    <SchedulePanel
      icon="filter"
      title="Filter"
      subtitle="Select attributes to filter by"
      onClose={onClose}
      className={className}
      // The bottom bar only appears once a filter is chosen (nothing to clear otherwise)
      footer={
        appliedFilterChips(filters, onChange).length > 0 ? (
          <Button variant="outline" size="regular" onClick={() => onChange(emptyScheduleFilters)}>
            Clear all Filters
          </Button>
        ) : undefined
      }
    >
      <Group label="Appointment Type">
        {appointmentTypes.map((t) => (
          <Option key={t} on={filters.appointmentTypes.includes(t)} onClick={() => onChange({ ...filters, appointmentTypes: toggle(filters.appointmentTypes, t) })}>
            {t}
          </Option>
        ))}
      </Group>
      <Group label="EHR">
        {ehrs.map((e) => (
          <Option key={e} on={filters.ehrs.includes(e)} icon={e === 'none' ? undefined : <EhrLogo ehr={e} size={16} title="" />} onClick={() => onChange({ ...filters, ehrs: toggle(filters.ehrs, e) })}>
            {ehrFilterLabel(e)}
          </Option>
        ))}
      </Group>
      <Group label="Status">
        {filterStatuses.map((s) => (
          <Option key={s} on={filters.statuses.includes(s)} invertIcon icon={<AppointmentStatusIcon status={s} size={16} title="" animate={false} />} onClick={() => onChange({ ...filters, statuses: toggle(filters.statuses, s) })}>
            {appointmentStatusLabel(s)}
          </Option>
        ))}
      </Group>
      <hr className="is-sched-panel__separator" />
      <div className="is-sched-panel__submenu">
        <span>Departments{count(filters.departments.length)}</span>
        <IconButton variant="secondary" size="regular" label="Filter by department" icon={<Icon name="chevron-right" />} onClick={() => setList('departments')} />
      </div>
      <div className="is-sched-panel__submenu">
        <span>Providers{count(filters.providers.length)}</span>
        <IconButton variant="secondary" size="regular" label="Filter by provider" icon={<Icon name="chevron-right" />} onClick={() => setList('providers')} />
      </div>
    </SchedulePanel>
  );
};

export interface ScheduleFilterListPanelProps {
  /** What is listed, e.g. "Providers" (title: "Providers Filter") */
  title: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  onBack?: () => void;
  className?: string;
}

/** Figma "Filter Submenu": ‹ back, a search field, the applied ones (with ×), then every option */
export const ScheduleFilterListPanel = ({ title, options, selected, onChange, onBack, className }: ScheduleFilterListPanelProps) => {
  const [query, setQuery] = useState('');
  const shown = options.filter((o) => !selected.includes(o) && o.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <SchedulePanel
      title={`${title} Filter`}
      onBack={onBack}
      className={`is-sched-panel--list ${className ?? ''}`}
      headerExtra={
        <label className="is-sched-search">
          <Icon name="search" size={20} />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${title}...`} />
        </label>
      }
    >
      {selected.length > 0 && (
        <>
          <p className="is-sched-panel__list-label">Applied Filters</p>
          {selected.map((o) => (
            <Button
              key={o}
              variant="secondary"
              size="regular"
              iconRight={<Icon name="close" />}
              aria-label={`Remove ${o}`}
              onClick={() => onChange(selected.filter((s) => s !== o))}
              className="is-sched-list-option"
            >
              {o}
            </Button>
          ))}
        </>
      )}
      <p className="is-sched-panel__list-label">{title}</p>
      {shown.map((o) => (
        <Button key={o} variant="secondary" size="regular" onClick={() => onChange([...selected, o])} className="is-sched-list-option">
          {o}
        </Button>
      ))}
      {shown.length === 0 && <p className="is-sched-panel__empty">No {title.toLowerCase()} found</p>}
    </SchedulePanel>
  );
};

/* ---------- Sort ---------- */

export type ScheduleSortKey = 'time' | 'name' | 'status';
export type ScheduleSortDirection = 'asc' | 'desc';
export interface ScheduleSort {
  by: ScheduleSortKey;
  direction: ScheduleSortDirection;
}

export interface ScheduleSortPanelProps {
  sort: ScheduleSort;
  onChange: (next: ScheduleSort) => void;
  onClose?: () => void;
  className?: string;
}

/** Figma "Sorting": one order at a time — by time, patient name (A-Z / Z-A) or status */
export const ScheduleSortPanel = ({ sort, onChange, onClose, className }: ScheduleSortPanelProps) => {
  const option = (by: ScheduleSortKey, direction: ScheduleSortDirection, label: string) => (
    <Option on={sort.by === by && sort.direction === direction} onClick={() => onChange({ by, direction })}>
      {label}
    </Option>
  );
  return (
    <SchedulePanel icon="reorder" title="Sort" subtitle="Set order preferences" onClose={onClose} className={`is-sched-panel--fit ${className ?? ''}`}>
      <Group label="Time">
        {option('time', 'asc', 'Ascending')}
        {option('time', 'desc', 'Descending')}
      </Group>
      <Group label="Patient Name">
        {option('name', 'asc', 'A-Z')}
        {option('name', 'desc', 'Z-A')}
      </Group>
      <Group label="Status">
        {option('status', 'asc', 'Ascending')}
        {option('status', 'desc', 'Descending')}
      </Group>
    </SchedulePanel>
  );
};

/* ---------- Calendar ---------- */

const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export interface ScheduleCalendarPanelProps {
  /** The day shown on the schedule (black) */
  value: Date;
  onChange: (date: Date) => void;
  /** Today (outlined). Default: now */
  today?: Date;
  onClose?: () => void;
  className?: string;
}

/** Figma "Calendar": a month of 36px days, the chosen day black, today outlined, and a "Today" button */
export const ScheduleCalendarPanel = ({ value, onChange, today = new Date(), onClose, className }: ScheduleCalendarPanelProps) => {
  const [month, setMonth] = useState(() => new Date(value.getFullYear(), value.getMonth(), 1));
  useEffect(() => setMonth(new Date(value.getFullYear(), value.getMonth(), 1)), [value]);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const blanks = month.getDay();
  const label = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const go = (step: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + step, 1));
  return (
    <SchedulePanel icon="calendar" title="Calendar" subtitle="Pick a date to view appointments" onClose={onClose} width={335} className={`is-sched-panel--calendar ${className ?? ''}`}>
      <div className="is-sched-cal__nav">
        <IconButton variant="ghost" size="small" label="Previous month" icon={<Icon name="chevron-left" />} onClick={() => go(-1)} />
        <span className="is-sched-cal__month">{label}</span>
        <IconButton variant="ghost" size="small" label="Next month" icon={<Icon name="chevron-right" />} onClick={() => go(1)} />
      </div>
      <div className="is-sched-cal__grid" role="grid" aria-label={label}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span key={d} className="is-sched-cal__weekday">
            {d}
          </span>
        ))}
        {Array.from({ length: blanks }, (_, i) => (
          <span key={`b${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const day = new Date(month.getFullYear(), month.getMonth(), i + 1);
          const chosen = sameDay(day, value);
          return (
            <button
              key={i}
              type="button"
              className={`is-sched-cal__day${chosen ? ' is-sched-cal__day--chosen' : ''}${sameDay(day, today) ? ' is-sched-cal__day--today' : ''}`}
              aria-pressed={chosen}
              aria-label={day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              onClick={() => onChange(day)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <div className="is-sched-cal__footer">
        <Button variant="outline" size="regular" onClick={() => onChange(today)}>
          Today
        </Button>
      </div>
    </SchedulePanel>
  );
};

/* ---------- Applied filters ---------- */

export interface AppliedFilterChip {
  key: string;
  label: string;
  remove: () => void;
}

/** A black 30px chip with its label and an × that removes it */
export const FilterChip = ({ label, remove }: { label: string; remove: () => void }) => (
  <Button variant="primary" size="small" iconRight={<Icon name="close" />} onClick={remove} aria-label={`Remove filter ${label}`} className="is-sched-chip">
    {label}
  </Button>
);

/**
 * Figma "Applied Filters": the chips in one row, 6px apart. When they don't fit, the row is cut off and a ⋯
 * button opens the whole list (Figma "List").
 */
export const AppliedFilters = ({ chips, className = '' }: { chips: AppliedFilterChip[]; className?: string }) => {
  const row = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [open, setOpen] = useState(false);
  const labels = useMemo(() => chips.map((c) => c.label).join('|'), [chips]);
  useLayoutEffect(() => {
    const el = row.current;
    if (!el) return;
    const measure = () => setOverflows(el.scrollWidth > el.clientWidth + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [labels]);
  useEffect(() => {
    if (!chips.length) setOpen(false);
  }, [chips.length]);
  if (!chips.length) return null;
  return (
    <div className={`is-applied-filters ${className}`}>
      <div ref={row} className="is-applied-filters__row">
        {chips.map((c) => (
          <FilterChip key={c.key} label={c.label} remove={c.remove} />
        ))}
      </div>
      {overflows && (
        <IconButton variant="secondary" size="small" label="All applied filters" icon={<Icon name="meatballs" />} aria-expanded={open} onClick={() => setOpen((o) => !o)} />
      )}
      {open && overflows && <AppliedFiltersList chips={chips} className="is-applied-filters__popover" />}
    </div>
  );
};

/** Figma "List": every applied filter, stacked, in a small floating card */
export const AppliedFiltersList = ({ chips, className = '' }: { chips: AppliedFilterChip[]; className?: string }) => (
  <div className={`is-applied-filters-list ${className}`}>
    <p className="is-applied-filters-list__title">Applied Filters:</p>
    {chips.map((c) => (
      <FilterChip key={c.key} label={c.label} remove={c.remove} />
    ))}
  </div>
);
