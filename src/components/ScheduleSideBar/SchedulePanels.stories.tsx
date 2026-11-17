import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AppliedFilters,
  AppliedFiltersList,
  appliedFilterChips,
  emptyScheduleFilters,
  ScheduleCalendarPanel,
  ScheduleFilterListPanel,
  ScheduleFilterPanel,
  ScheduleSortPanel,
  type ScheduleFilters,
  type ScheduleSort,
} from './SchedulePanels';
import { sampleDepartments, sampleProviders } from './sampleSchedule';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;

const meta = {
  title: 'Components/Schedule Side Bar/Panels',
  component: ScheduleFilterPanel,
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof ScheduleFilterPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Filter". Pick options; Departments and Providers open their lists. */
export const Filter: Story = {
  args: { filters: emptyScheduleFilters, onChange: () => {} },
  render: function Render() {
    const [filters, setFilters] = useState<ScheduleFilters>({ ...emptyScheduleFilters, appointmentTypes: ['Office Visit'] });
    return <ScheduleFilterPanel filters={filters} onChange={setFilters} providers={sampleProviders} departments={sampleDepartments} onClose={() => {}} />;
  },
};

/** Figma "Filter Submenu": search, the applied ones with ×, then every provider. */
export const ProvidersFilter: Story = {
  name: 'Providers filter',
  args: { filters: emptyScheduleFilters, onChange: () => {} },
  render: function Render() {
    const [selected, setSelected] = useState(['Cali, Doctor (dcali)']);
    return <ScheduleFilterListPanel title="Providers" options={sampleProviders} selected={selected} onChange={setSelected} onBack={() => {}} />;
  },
};

/** Figma "Sorting": one order at a time. */
export const Sort: Story = {
  args: { filters: emptyScheduleFilters, onChange: () => {} },
  render: function Render() {
    const [sort, setSort] = useState<ScheduleSort>({ by: 'time', direction: 'asc' });
    return <ScheduleSortPanel sort={sort} onChange={setSort} onClose={() => {}} />;
  },
};

/** Figma "Calendar": the chosen day black, today outlined. */
export const Calendar: Story = {
  args: { filters: emptyScheduleFilters, onChange: () => {} },
  render: function Render() {
    const [date, setDate] = useState(new Date());
    return <ScheduleCalendarPanel value={date} onChange={setDate} onClose={() => {}} />;
  },
};

/** Figma "Applied Filters" and "List": chips in a row, cut off with ⋯ when they don't fit; ⋯ shows them all. */
export const AppliedFilterChips: Story = {
  name: 'Applied filters',
  args: { filters: emptyScheduleFilters, onChange: () => {} },
  render: function Render() {
    const [few, setFew] = useState<ScheduleFilters>({ ...emptyScheduleFilters, appointmentTypes: ['Office Visit'], statuses: ['checked-in'] });
    const [many, setMany] = useState<ScheduleFilters>({
      ...emptyScheduleFilters,
      appointmentTypes: ['Office Visit'],
      statuses: ['checked-in', 'note-in-progress', 'not-checked-in'],
    });
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <span style={caption}>Applied filters (380px)</span>
        <div style={{ width: 380 }}>
          <AppliedFilters chips={appliedFilterChips(few, setFew)} />
        </div>
        <div style={{ width: 380, minHeight: 230 }}>
          <AppliedFilters chips={appliedFilterChips(many, setMany)} />
        </div>
        <span style={caption}>All applied filters</span>
        <div>
          <AppliedFiltersList chips={appliedFilterChips(many, setMany)} />
        </div>
      </div>
    );
  },
};
