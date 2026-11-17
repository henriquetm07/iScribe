import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScheduleList, type ScheduleListProps } from './ScheduleList';
import { sampleAppointments } from './sampleAppointments';

const meta = {
  title: 'Components/Schedule List/Schedule List',
  component: ScheduleList,
  args: { appointments: sampleAppointments, expanded: false, selectedId: '6' },
  argTypes: {
    expanded: { control: 'boolean' },
    appointments: { table: { disable: true } },
    selectedId: { table: { disable: true } },
    onSelect: { table: { disable: true } },
    onMoreInfo: { table: { disable: true } },
    height: { table: { disable: true } },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof ScheduleList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The day's appointments. Click one to select it; switch Collapsed / Expanded with "expanded" in Controls. */
export const Default: Story = {
  render: function Render(args: ScheduleListProps) {
    const [selected, setSelected] = useState(args.selectedId);
    return <ScheduleList {...args} selectedId={selected} onSelect={setSelected} />;
  },
};

/** Collapsed and expanded side by side, as in the Figma sheet. */
export const CollapsedAndExpanded: Story = {
  name: 'Collapsed and expanded',
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [selected, setSelected] = useState<string | undefined>('6');
    return (
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <ScheduleList appointments={sampleAppointments} selectedId={selected} onSelect={setSelected} />
        <ScheduleList appointments={sampleAppointments} expanded selectedId={selected} onSelect={setSelected} />
      </div>
    );
  },
};

/** While a note syncs, its appointment shows "Syncing note…" over the loading animation. */
export const Syncing: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [selected, setSelected] = useState<string | undefined>();
    const appointments = sampleAppointments.slice(0, 4).map((a) => (a.id === '2' ? { ...a, syncing: true } : a));
    return (
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <ScheduleList appointments={appointments} selectedId={selected} onSelect={setSelected} />
        <ScheduleList appointments={appointments} expanded selectedId={selected} onSelect={setSelected} />
      </div>
    );
  },
};
