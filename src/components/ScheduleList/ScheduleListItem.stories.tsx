import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { appointmentStatuses } from '../AppointmentStatus/AppointmentStatus';
import { ehrs } from '../EhrIcon/EhrIcon';
import { ScheduleListItem, VisitType, type ScheduleListItemProps } from './ScheduleList';
import { scheduleListItemSpecComment } from './ScheduleList.docs';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;
const photo = './samples/patient-sample.jpg';

const meta = {
  title: 'Components/Schedule List/Schedule List Item',
  component: ScheduleListItem,
  args: {
    state: 'active',
    size: 'compact',
    name: 'Mathieu Donte',
    time: '8:00 AM',
    status: 'sent-to-ehr',
    sex: 'Female',
    dateOfBirth: '03/15/1982',
    age: 42,
    visitType: 'Visit',
    ehr: 'athena',
    integrated: false,
  },
  argTypes: {
    state: { control: 'inline-radio', options: ['syncing', 'active', 'selected'] },
    size: { control: 'inline-radio', options: ['compact', 'expanded'] },
    status: { control: 'select', options: appointmentStatuses.map((s) => s.value) },
    ehr: { control: 'select', options: ehrs.map((e) => e.value) },
    integrated: { control: 'boolean' },
    photo: { control: 'inline-radio', options: ['none', 'sample'], mapping: { none: undefined, sample: photo }, labels: { none: 'No photo', sample: 'Sample photo' } },
    onMoreInfo: { table: { disable: true } },
    onClick: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  parameters: {
    docs: {
      source: {
        transform: (code: string, ctx: { args: ScheduleListItemProps }) => `${scheduleListItemSpecComment(ctx.args)}\n${code}`,
      },
    },
  },
} satisfies Meta<typeof ScheduleListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One appointment. Pick its state, size, status and EHR in Controls. */
export const Default: Story = { args: { onMoreInfo: fn() } };

/** Every state in both sizes, as in the Figma sheet. */
export const AllStates: Story = {
  name: 'All states',
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gap: '20px 16px', alignItems: 'center', justifyItems: 'start' }}>
      {(['syncing', 'active', 'selected'] as const).map((state) => (
        <div key={state} style={{ display: 'contents' }}>
          <span style={{ ...caption, justifySelf: 'end', textTransform: 'capitalize' }}>{state}</span>
          <ScheduleListItem {...args} state={state} size="compact" />
          <ScheduleListItem {...args} state={state} size="expanded" photo={state === 'selected' ? photo : undefined} />
        </div>
      ))}
    </div>
  ),
};

/** Figma "Visit type": the EHR Icon (link when not integrated, the EHR's logo when integrated) and the visit type. */
export const VisitTypes: Story = {
  name: 'Visit type',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '12px 24px', alignItems: 'center', justifyItems: 'start' }}>
      <span style={caption}>Not integrated</span>
      <VisitType />
      {ehrs.map(({ value, label }) => (
        <div key={value} style={{ display: 'contents' }}>
          <span style={caption}>{label}</span>
          <VisitType ehr={value} integrated />
        </div>
      ))}
    </div>
  ),
};
