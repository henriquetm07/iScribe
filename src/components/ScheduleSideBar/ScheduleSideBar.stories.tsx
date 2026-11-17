import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ProviderName, ScheduleSideBar } from './ScheduleSideBar';
import { samplePending, sampleProviders, sampleDepartments, sampleSideBarAppointments } from './sampleSchedule';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;
/** The side bar, 760px tall here (974 in Figma), outlined so its edge shows; panels can open past it */
const frame = { height: 760, display: 'flex', outline: '1px solid var(--is-surface-soft-contrast-background)' } as const;

const meta = {
  title: 'Components/Schedule Side Bar/Schedule Side Bar',
  component: ScheduleSideBar,
  args: {
    platform: 'web',
    defaultCollapsed: false,
    appointments: sampleSideBarAppointments,
    pending: samplePending,
    selectedId: '6',
    providers: sampleProviders,
    departments: sampleDepartments,
    onNewNote: fn(),
    onSelect: fn(),
    onDateChange: fn(),
  },
  argTypes: {
    platform: { control: 'inline-radio', options: ['web', 'chrome'] },
    defaultCollapsed: { control: 'boolean', name: 'collapsed (web)' },
    appointments: { table: { disable: true } },
    pending: { table: { disable: true } },
    providers: { table: { disable: true } },
    departments: { table: { disable: true } },
    appointmentTypes: { table: { disable: true } },
    ehrs: { table: { disable: true } },
    defaultFilters: { table: { disable: true } },
    defaultSort: { table: { disable: true } },
    collapsed: { table: { disable: true } },
    date: { table: { disable: true } },
    today: { table: { disable: true } },
    height: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div style={{ ...frame, minWidth: 0 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScheduleSideBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Web. The sidebar button collapses it to 180px; ‹ › change the day; the date opens the Calendar; Filter and
 * Sort open their panels, and applied filters show as chips above the list.
 */
export const Web: Story = {};

/** Web, collapsed: compact appointments; ≡ or the sidebar button expands it again. */
export const Collapsed: Story = { args: { defaultCollapsed: true } };

/** Chrome extension: the provider's name on top and a New Note button at the bottom. */
export const ChromeExtension: Story = {
  name: 'Chrome extension',
  args: { platform: 'chrome', onProviderMenu: fn() },
};

/** With filters applied: the chips above the list, cut off with ⋯ when they don't fit. */
export const WithFilters: Story = {
  name: 'With filters',
  args: {
    defaultFilters: { appointmentTypes: ['Office Visit'], ehrs: [], statuses: ['checked-in', 'note-in-progress', 'not-checked-in'], departments: [], providers: [] },
  },
};

/** Figma "Provider Name" (Chrome extension header). */
export const Provider: Story = {
  name: 'Provider name',
  parameters: { controls: { disable: true } },
  decorators: [(Story) => <div style={{ width: 340 }}>{Story()}</div>],
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      <span style={caption}>Provider Name</span>
      <ProviderName name="Dr. Chris Bulkey-Jones" onMenu={fn()} />
    </div>
  ),
};
